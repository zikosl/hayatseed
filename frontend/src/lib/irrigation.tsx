import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type IrrMode = "manual" | "auto" | "smart" | "scheduled" | "eco";

type IrrCtx = {
  isOn: boolean;
  toggle: () => void;
  zone: "A" | "B" | "C";
  setZone: (z: "A" | "B" | "C") => void;
  zones: { A: boolean; B: boolean; C: boolean };
  setZoneActive: (z: "A" | "B" | "C", v: boolean) => boolean;
  startedAt: number | null;
  elapsed: number; // seconds
  mode: IrrMode;
  setMode: (m: IrrMode) => void;
};

const Ctx = createContext<IrrCtx | null>(null);

export function IrrigationProvider({ children }: { children: ReactNode }) {
  const [isOn, setIsOn] = useState(false);
  const [zone, setZone] = useState<"A" | "B" | "C">("A");
  const [zones, setZones] = useState({ A: true, B: false, C: true });
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState<IrrMode>("auto");

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("hs_irr") : null;
    if (raw) {
      const s = JSON.parse(raw);
      setIsOn(!!s.isOn);
      if (s.zone) setZone(s.zone);
      if (s.zones) setZones(s.zones);
      if (s.startedAt) setStartedAt(s.startedAt);
      if (s.mode) setMode(s.mode);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("hs_irr", JSON.stringify({ isOn, zone, zones, startedAt, mode }));
  }, [isOn, zone, zones, startedAt, mode]);

  useEffect(() => {
    if (!isOn || !startedAt) {
      setElapsed(0);
      return;
    }
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [isOn, startedAt]);

  const toggle = () => {
    setIsOn((v) => {
      const next = !v;
      setStartedAt(next ? Date.now() : null);
      return next;
    });
  };

  return (
    <Ctx.Provider
      value={{
        isOn,
        toggle,
        zone,
        setZone,
        zones,
        setZoneActive: (z, v) => {
          let changed = true;
          setZones((previous) => {
            if (!v) {
              const activeCount = Object.values(previous).filter(Boolean).length;
              if (previous[z] && activeCount === 1) {
                changed = false;
                return previous;
              }
            }
            return { ...previous, [z]: v };
          });
          return changed;
        },
        startedAt,
        elapsed,
        mode,
        setMode,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useIrrigation = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("IrrigationProvider missing");
  return c;
};

export function formatDuration(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
