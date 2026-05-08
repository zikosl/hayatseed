import { createFileRoute } from "@tanstack/react-router";
import { Database, KeyRound, ServerCog, ShieldCheck } from "lucide-react";
import { AdminStat } from "@/components/AdminPrimitives";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { notifications, orders, products, services, users } = useAppState();
  const { t } = useI18n();

  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        kicker={t("admin.settings.kicker")}
        title={t("admin.settings.title")}
        intro={t("admin.settings.intro")}
      >
        <div className="grid gap-3 md:grid-cols-4">
          <AdminStat
            icon={Database}
            label={t("admin.settings.users")}
            value={`${users.length}`}
          />
          <AdminStat
            icon={Database}
            label={t("nav.orders")}
            value={`${orders.length}`}
          />
          <AdminStat
            icon={Database}
            label={t("admin.settings.catalog")}
            value={`${products.length + services.length}`}
          />
          <AdminStat
            icon={Database}
            label={t("nav.notifications")}
            value={`${notifications.length}`}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <section className="surface-card rounded-lg p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                <KeyRound className="h-5 w-5 text-primary" />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {t("admin.settings.access")}
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t("admin.settings.demoCredentials")}
                </h2>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <SettingRow
                label={t("admin.settings.adminEmail")}
                value="admin@hayatseed.dz"
              />
              <SettingRow
                label={t("admin.settings.adminPassword")}
                value="admin123"
              />
              <SettingRow
                label={t("admin.settings.clientEmail")}
                value="client@hayatseed.dz"
              />
              <SettingRow
                label={t("admin.settings.clientPassword")}
                value="client123"
              />
            </div>
          </section>

          <section className="surface-card rounded-lg p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                <ServerCog className="h-5 w-5 text-primary" />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {t("admin.settings.environment")}
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t("admin.settings.developmentStack")}
                </h2>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <SettingRow
                label={t("admin.settings.frontend")}
                value="http://localhost:3000"
              />
              <SettingRow
                label={t("admin.settings.backendHealth")}
                value="http://localhost:4000/api/health"
              />
              <SettingRow
                label={t("admin.settings.database")}
                value={t("admin.settings.databaseValue")}
              />
              <SettingRow
                label={t("admin.settings.persistence")}
                value={t("admin.settings.persistenceValue")}
              />
            </div>
          </section>

          <section className="surface-card rounded-lg p-5 xl:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {t("admin.settings.productionChecklist")}
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t("admin.settings.beforeLaunch")}
                </h2>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ChecklistItem
                title={t("admin.settings.apiPersistence")}
                text={t("admin.settings.apiPersistenceText")}
              />
              <ChecklistItem
                title={t("admin.settings.auth")}
                text={t("admin.settings.authText")}
              />
              <ChecklistItem
                title={t("admin.settings.audit")}
                text={t("admin.settings.auditText")}
              />
              <ChecklistItem
                title={t("admin.settings.observability")}
                text={t("admin.settings.observabilityText")}
              />
            </div>
          </section>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function ChecklistItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="font-semibold text-foreground">{title}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
