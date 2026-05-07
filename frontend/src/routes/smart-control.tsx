import { createFileRoute, Link } from "@tanstack/react-router";
import { SmartControlPanel } from "@/components/SmartControlPanel";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/smart-control")({
  component: SmartControlRoutePage,
});

function SmartControlRoutePage() {
  const { user } = useAuth();
  const { t } = useI18n();

  if (user?.role === "client" || user?.role === "admin") {
    return <SmartControlPanel />;
  }

  return (
    <div className="rounded-3xl bg-card p-6 shadow-card">
      <div className="text-xs font-bold tracking-widest text-primary">
        {t("smart.kicker")}
      </div>
      <h1 className="mt-2 text-3xl font-bold text-foreground">
        {t("smart.clientRequired")}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {t("smart.clientRequiredText")}
      </p>
      <div className="mt-5 flex gap-3">
        <Link
          to="/auth"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {t("auth.signin")}
        </Link>
        <Link
          to="/order"
          className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
        >
          {t("prod.orderDesk")}
        </Link>
      </div>
    </div>
  );
}
