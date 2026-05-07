import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAppState } from "@/lib/app-state";
import type { User } from "@/lib/types";

type SessionUser = Omit<User, "password">;

type AuthCtx = {
  user: SessionUser | null;
  signIn: (email: string, password: string) => { ok: boolean; message?: string };
  signOut: () => void;
  isAdmin: boolean;
  isClient: boolean;
};

const STORAGE_KEY = "hs_current_user_v1";
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users } = useAppState();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUserId(saved);
  }, []);

  const user = useMemo<SessionUser | null>(() => {
    const match = users.find((entry) => entry.id === userId);
    if (!match) return null;
    const { password, ...safeUser } = match;
    return safeUser;
  }, [userId, users]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      signIn: (email, password) => {
        const match = users.find((entry) => entry.email === email.trim().toLowerCase());
        if (!match || match.password !== password) {
          return { ok: false, message: "Invalid credentials." };
        }
        setUserId(match.id);
        localStorage.setItem(STORAGE_KEY, match.id);
        return { ok: true };
      },
      signOut: () => {
        setUserId(null);
        localStorage.removeItem(STORAGE_KEY);
      },
      isAdmin: user?.role === "admin",
      isClient: user?.role === "client",
    }),
    [user, users],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const context = useContext(Ctx);
  if (!context) throw new Error("AuthProvider missing");
  return context;
}
