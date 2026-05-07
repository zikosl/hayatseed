import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { UserRole } from "@/lib/types";

export function RoleGate({
  allow,
  children,
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { t } = useI18n();
  const role = user?.role ?? "visitor";

  if (allow.includes(role)) return <>{children}</>;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="text-sm font-semibold text-primary">
        {t("gate.restricted")}
      </div>
      <h1 className="mt-2 text-2xl font-bold text-foreground">
        {t("gate.title")}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t("gate.text")}
      </p>
      <Link
        to="/auth"
        className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        {t("gate.open")}
      </Link>
    </div>
  );
}
