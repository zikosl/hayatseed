import { createFileRoute } from "@tanstack/react-router";
import { Database, KeyRound, ServerCog, ShieldCheck } from "lucide-react";
import { AdminStat } from "@/components/AdminPrimitives";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { notifications, orders, products, services, users } = useAppState();

  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        kicker="ADMIN SETTINGS"
        title="System settings"
        intro="Operational readiness, demo credentials, data storage notes, and production handoff guidance for the Hayatseed admin workspace."
      >
        <div className="grid gap-3 md:grid-cols-4">
          <AdminStat icon={Database} label="Users" value={`${users.length}`} />
          <AdminStat
            icon={Database}
            label="Orders"
            value={`${orders.length}`}
          />
          <AdminStat
            icon={Database}
            label="Catalog"
            value={`${products.length + services.length}`}
          />
          <AdminStat
            icon={Database}
            label="Notifications"
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
                  Access
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Demo credentials
                </h2>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <SettingRow label="Admin email" value="admin@hayatseed.dz" />
              <SettingRow label="Admin password" value="admin123" />
              <SettingRow label="Client email" value="client@hayatseed.dz" />
              <SettingRow label="Client password" value="client123" />
            </div>
          </section>

          <section className="surface-card rounded-lg p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                <ServerCog className="h-5 w-5 text-primary" />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Environment
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Development stack
                </h2>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <SettingRow label="Frontend" value="http://localhost:3000" />
              <SettingRow
                label="Backend health"
                value="http://localhost:4000/api/health"
              />
              <SettingRow
                label="Database"
                value="Postgres 16 via Docker Compose"
              />
              <SettingRow
                label="Persistence"
                value="Browser localStorage plus Docker volumes"
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
                  Production checklist
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Before launch
                </h2>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ChecklistItem
                title="Move admin data to API persistence"
                text="The interface is production-shaped, but current browser state should be replaced with authenticated backend storage for live deployment."
              />
              <ChecklistItem
                title="Harden authentication"
                text="Use hashed passwords, server sessions or JWT refresh flow, and role checks enforced by the backend."
              />
              <ChecklistItem
                title="Audit destructive actions"
                text="Keep soft-delete/archive for catalog records tied to historical orders."
              />
              <ChecklistItem
                title="Add observability"
                text="Track failed requests, order status changes, and admin actions in server logs."
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
