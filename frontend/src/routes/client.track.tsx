import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, MapPin, Package2, ScanSearch } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/client/track")({
  component: ClientTrackingPage,
});

function ClientTrackingPage() {
  const { user } = useAuth();
  const { orders } = useAppState();
  const { t } = useI18n();
  const items = orders.filter((order) => order.userId === user?.id);

  return (
    <RoleGate allow={["client", "admin"]}>
      <DashboardShell
        kicker={t("client.track.kicker")}
        title={t("client.track.title")}
        intro={t("client.track.intro")}
      >
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-3">
            {items.map((order) => (
              <div
                key={order.id}
                className="surface-card rounded-[1.75rem] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold tracking-[0.28em] text-primary">
                      {order.orderNumber}
                    </div>
                    <div className="mt-2 text-lg font-bold text-foreground">
                      {order.itemLabel}
                    </div>
                  </div>
                  <div className="rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                    {t(`status.${order.status}`)}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <TrackField
                    icon={Package2}
                    label={t("client.track.orderType")}
                    value={order.kind}
                  />
                  <TrackField
                    icon={MapPin}
                    label={t("client.track.location")}
                    value={order.location}
                  />
                  <TrackField
                    icon={KeyRound}
                    label={t("client.track.accessCode")}
                    value={order.accessCode}
                  />
                </div>
              </div>
            ))}
          </div>
          <aside className="surface-card rounded-[1.8rem] p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              <ScanSearch className="h-3.5 w-3.5" />
              {t("client.track.desk")}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              {t("client.track.cleanRef")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("client.track.cleanRefText")}
            </p>
            <div className="mt-5 space-y-3">
              <TrackHint
                title={t("client.track.shareable")}
                text={t("client.track.shareableText")}
              />
              <TrackHint
                title={t("client.track.private")}
                text={t("client.track.privateText")}
              />
            </div>
          </aside>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}

function TrackField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.3rem] border border-white/60 bg-white/75 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function TrackHint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/60 bg-white/75 p-4">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
