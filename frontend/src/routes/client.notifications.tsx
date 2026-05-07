import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, Droplets, PackageCheck } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/client/notifications")({
  component: ClientNotificationsPage,
});

function ClientNotificationsPage() {
  const { user } = useAuth();
  const { markAllNotificationsRead, notifications, markNotificationRead } = useAppState();
  const items = notifications.filter((notification) => notification.userId === user?.id);
  const unread = items.filter((notification) => !notification.read).length;

  return (
    <RoleGate allow={["client", "admin"]}>
      <DashboardShell
        kicker="NOTIFICATIONS"
        title="Client notifications"
        intro="This panel is ready for order updates, irrigation alerts, and future device events."
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoTile
                icon={Bell}
                label="Unread"
                value={`${unread}`}
                tone={unread ? "primary" : "neutral"}
              />
              <InfoTile
                icon={PackageCheck}
                label="Order updates"
                value={`${items.filter((notification) => notification.title.includes("Order")).length}`}
                tone="neutral"
              />
              <InfoTile
                icon={Droplets}
                label="System alerts"
                value={`${items.filter((notification) => !notification.title.includes("Order")).length}`}
                tone="neutral"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => user?.id && markAllNotificationsRead(user.id)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Mark all as read
              </button>
            </div>
            {items.map((notification) => (
              <button
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={`block w-full rounded-[1.75rem] border p-5 text-left transition-transform hover:-translate-y-0.5 ${
                  notification.read
                    ? "surface-card border-white/60"
                    : "border-primary/30 bg-primary/5 shadow-[0_22px_60px_rgba(13,148,136,0.14)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-bold text-foreground">{notification.title}</h2>
                  {!notification.read && (
                    <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
                      NEW
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {notification.body}
                </p>
              </button>
            ))}
          </div>
          <aside className="surface-card rounded-[1.8rem] p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Inbox flow
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Notifications should feel operational, not noisy.
            </h2>
            <div className="mt-5 space-y-3">
              <SideNote
                title="Orders"
                text="Quote changes, approval requests, and delivery updates stay grouped here for quick follow-up."
              />
              <SideNote
                title="Smart control"
                text="When real devices arrive, drought or irrigation anomalies can land in the same stream without changing the layout."
              />
              <SideNote
                title="Read state"
                text="Unread items stand out, but the panel still stays calm enough for everyday use on mobile."
              />
            </div>
          </aside>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "primary" | "neutral";
}) {
  return (
    <div
      className={`rounded-[1.45rem] border px-4 py-4 ${
        tone === "primary" ? "border-primary/20 bg-primary/5" : "border-white/60 bg-white/75"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <div className="text-lg font-semibold text-foreground">{value}</div>
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}

function SideNote({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/60 bg-white/75 p-4">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
