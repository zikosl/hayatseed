import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  Calendar,
  Cloud,
  CloudRain,
  Cpu,
  Droplet,
  FlaskConical,
  Hand,
  Leaf,
  Thermometer,
  Wifi,
  WifiOff,
  Clock,
  Sun,
} from "lucide-react";
import { IrrigationCore } from "@/components/IrrigationCore";
import { useI18n } from "@/lib/i18n";
import { useIrrigation, type IrrMode } from "@/lib/irrigation";

const sensorData = {
  "1": {
    ph: 6.8,
    phLabel: "Optimal",
    temp: 24,
    tempLabel: "Ideal",
    drought: 32,
    droughtLabel: "Moderate",
    humidity: 58,
    humidityLabel: "Healthy",
  },
  "2": {
    ph: 7.1,
    phLabel: "Acceptable",
    temp: 26,
    tempLabel: "Warm",
    drought: 41,
    droughtLabel: "Elevated",
    humidity: 47,
    humidityLabel: "Average",
  },
  "3": {
    ph: 6.5,
    phLabel: "Optimal",
    temp: 22,
    tempLabel: "Ideal",
    drought: 28,
    droughtLabel: "Moderate",
    humidity: 63,
    humidityLabel: "Strong",
  },
};

export function SmartControlPanel() {
  const { t } = useI18n();
  const { isOn, zone, setZone, zones, setZoneActive, mode, setMode } =
    useIrrigation();
  const [now, setNow] = useState("");
  const [sensorZone, setSensorZone] = useState<"1" | "2" | "3">("1");
  const [zoneWarning, setZoneWarning] = useState("");

  useEffect(() => {
    const update = () =>
      setNow(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const sensor = sensorData[sensorZone];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold tracking-widest text-primary">
          {t("smart.kicker")}
        </div>
        <h1 className="mt-1 text-3xl font-bold text-foreground">
          {t("smart.clientPanel")}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
            <Wifi className="h-3.5 w-3.5" />
            {t("smart.simulation")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
            <WifiOff className="h-3.5 w-3.5" />
            {t("smart.simulatedSensors")}
          </span>
        </div>
      </div>

      <div
        className={`rounded-3xl p-6 shadow-card ${
          isOn ? "bg-gradient-card-active" : "bg-gradient-card-off"
        }`}
      >
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              isOn
                ? "bg-success/20 text-success"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isOn ? "bg-success" : "bg-destructive"}`}
            />
            {isOn ? t("irr.active") : t("irr.off")}
          </span>
        </div>
        <h2 className="mt-3 text-center text-2xl font-bold text-foreground">
          {t("irr.main")}
        </h2>
        <p className="text-center text-sm text-muted-foreground">{now}</p>
        <div className="mt-6 flex justify-center">
          <IrrigationCore />
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">{t("smart.modes")}</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {(
            [
              { key: "manual", icon: Hand },
              { key: "auto", icon: Cpu },
              { key: "smart", icon: Wifi },
              { key: "scheduled", icon: Clock },
              { key: "eco", icon: Leaf },
            ] as {
              key: IrrMode;
              icon: React.ComponentType<{ className?: string }>;
            }[]
          ).map(({ key, icon: Icon }) => {
            const active = mode === key;
            return (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`rounded-2xl border p-3 text-left ${
                  active
                    ? "border-primary bg-primary/5 shadow-soft"
                    : "border-border bg-secondary/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full ${
                      active
                        ? "bg-gradient-hero text-primary-foreground"
                        : "bg-secondary text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-semibold">
                    {t(`smart.mode.${key}`)}
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  {t(`smart.mode.${key}.d`)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Droplet className="h-5 w-5 text-teal" />
          <h3 className="font-bold text-foreground">{t("smart.zoneCtl")}</h3>
        </div>
        <div className="space-y-2">
          {(["A", "B", "C"] as const).map((entry) => {
            const active = zones[entry];
            const selected = zone === entry;
            return (
              <div
                key={entry}
                onClick={() => setZone(entry)}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 ${
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-secondary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">
                    {t("smart.zone")} {entry}
                  </span>
                  {selected && (
                    <span className="text-[10px] font-bold tracking-wider text-primary">
                      {t("smart.selected")}
                    </span>
                  )}
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    const changed = setZoneActive(entry, !active);
                    setZoneWarning(changed ? "" : t("smart.zoneRequired"));
                  }}
                  className={`relative h-7 w-12 rounded-full ${
                    active ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-all ${
                      active ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
        {zoneWarning && (
          <p className="mt-3 text-sm font-medium text-destructive">
            {zoneWarning}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard icon={BarChart3} label={t("smart.saved")} value="38%" />
        <MetricCard icon={Calendar} label={t("smart.sessions")} value="14" />
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-card">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {t("smart.sensorOverview")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("smart.simulationFeed", { zone: sensorZone })}
            </p>
          </div>
        </div>
        <div className="mt-3 inline-flex rounded-full bg-secondary p-1">
          {(["1", "2", "3"] as const).map((entry) => (
            <button
              key={entry}
              onClick={() => setSensorZone(entry)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                sensorZone === entry
                  ? "bg-success text-success-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {t("smart.zone")} {entry}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SensorCard
            icon={FlaskConical}
            label={sensor.phLabel}
            title={t("smart.ph")}
            value={sensor.ph}
            unit=""
            pct={(sensor.ph / 14) * 100}
            color="bg-success"
          />
          <SensorCard
            icon={Thermometer}
            label={sensor.tempLabel}
            title={t("smart.temp")}
            value={sensor.temp}
            unit="°C"
            pct={(sensor.temp / 50) * 100}
            color="bg-amber-500"
          />
          <SensorCard
            icon={Sun}
            label={sensor.droughtLabel}
            title={t("smart.drought")}
            value={sensor.drought}
            unit="%"
            pct={sensor.drought}
            color="bg-amber-500"
          />
          <SensorCard
            icon={CloudRain}
            label={sensor.humidityLabel}
            title={t("smart.humidity")}
            value={sensor.humidity}
            unit="%"
            pct={sensor.humidity}
            color="bg-teal"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <InfoCard icon={Cloud} title={t("smart.f1.t")} text={t("smart.f1.d")} />
        <InfoCard
          icon={Bell}
          title={t("smart.alerts")}
          text={t("smart.alertsText")}
        />
        <InfoCard
          icon={WifiOff}
          title={t("smart.fallbackReady")}
          text={t("smart.fallbackText")}
        />
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function SensorCard({
  icon: Icon,
  label,
  title,
  value,
  unit,
  pct,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
  value: number;
  unit: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-secondary/30 p-4">
      <div className="flex items-center justify-between">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-secondary">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-[10px] font-bold tracking-wider text-success">
          {label}
        </span>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-bold text-foreground">
        {value}
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          {unit}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full ${color}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h4 className="mt-3 font-bold text-foreground">{title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
