import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/hayatseed-logo.png";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — Hayatseed" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("client@hayatseed.dz");
  const [password, setPassword] = useState("client123");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.message ?? t("auth.unable"));
      return;
    }
    navigate({ to: email === "admin@hayatseed.dz" ? "/admin" : "/client" });
  };

  return (
    <div className="mx-auto max-w-md space-y-6 pt-8">
      <div className="text-center">
        <img src={logo} alt="Hayatseed" className="mx-auto h-14" />
        <h1 className="mt-4 text-3xl font-bold text-foreground">
          {t("auth.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("auth.demo")}</p>
      </div>
      <form
        onSubmit={submit}
        className="rounded-3xl border border-border bg-card p-5 shadow-card"
      >
        <label className="block text-sm font-medium text-foreground">
          {t("auth.email")}
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-foreground">
          {t("auth.password")}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3"
          />
        </label>
        {error && (
          <p className="mt-3 text-sm font-medium text-destructive">{error}</p>
        )}
        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          {t("auth.signin")}
        </button>
      </form>
      <div className="rounded-3xl bg-secondary/50 p-4 text-sm text-muted-foreground">
        {t("auth.clientDemo")}: `client@hayatseed.dz / client123`
        <br />
        {t("auth.adminDemo")}: `admin@hayatseed.dz / admin123`
      </div>
    </div>
  );
}
