import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import {
  Bell,
  Cpu,
  ShoppingBag,
  Ticket,
  WavesLadder,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/client")({
  component: ClientHomePage,
});

function ClientHomePage() {
  const location = useLocation();
  const { user } = useAuth();
  const { orders, notifications } = useAppState();
  const { t } = useI18n();
  if (location.pathname !== "/client") return <Outlet />;

  const clientOrders = orders.filter((order) => order.userId === user?.id);
  const unread = notifications.filter(
    (notification) => notification.userId === user?.id && !notification.read,
  ).length;
  const latestOrders = clientOrders.slice(0, 3);

  return (
    <RoleGate allow={["client", "admin"]}>
      <DashboardShell
        kicker={t("client.kicker")}
        title={t("client.welcome", {
          name: user?.name ?? t("client.fallbackName"),
        })}
        intro={t("client.intro")}
      >
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-card rounded-[1.8rem] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold tracking-[0.24em] text-primary">
                  {t("client.overview")}
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  {t("client.currentActivity")}
                </h2>
              </div>
              <Link
                to="/client/smart-control"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                {t("client.openSmart")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <ClientMetric
                label={t("client.orders")}
                value={String(clientOrders.length)}
                icon={ShoppingBag}
                to="/client/orders"
              />
              <ClientMetric
                label={t("client.unreadAlerts")}
                value={String(unread)}
                icon={Bell}
                to="/client/notifications"
              />
              <ClientMetric
                label={t("client.smartControl")}
                value={t("common.live")}
                icon={Cpu}
                to="/client/smart-control"
              />
              <ClientMetric
                label={t("client.tracking")}
                value={t("common.ready")}
                icon={Ticket}
                to="/client/track"
              />
            </div>
          </div>

          <div className="surface-card rounded-[1.8rem] p-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero">
              <WavesLadder className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="mt-5 text-xs font-bold tracking-[0.24em] text-primary">
              {t("client.nextAction")}
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              {t("client.keepMoving")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {t("client.keepMovingText")}
            </p>
            <div className="mt-5 space-y-2">
              <PanelNote
                label={t("client.simulationMode")}
                value={t("client.simulationValue")}
              />
              <PanelNote
                label={t("client.preferredFlow")}
                value={t("client.preferredFlowValue")}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard
            to="/order"
            title={t("client.createOrder")}
            text={t("client.createOrderText")}
          />
          <ActionCard
            to="/client/notifications"
            title={t("client.reviewAlerts")}
            text={t("client.reviewAlertsText")}
          />
          <ActionCard
            to="/client/track"
            title={t("client.checkCodes")}
            text={t("client.checkCodesText")}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="surface-card rounded-[1.8rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold tracking-[0.24em] text-primary">
                  {t("client.recentOrders")}
                </div>
                <h2 className="mt-2 text-xl font-semibold text-foreground">
                  {t("client.latestRequests")}
                </h2>
              </div>
              <Link
                to="/client/orders"
                className="text-sm font-semibold text-primary"
              >
                {t("common.viewAll")}
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {latestOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[1.35rem] border border-white/60 bg-white/75 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-primary">
                        {order.orderNumber}
                      </div>
                      <div className="mt-1 font-semibold text-foreground">
                        {order.itemLabel}
                      </div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {t(`status.${order.status}`)}
                    </span>
                  </div>
                </div>
              ))}
              {!latestOrders.length && (
                <div className="rounded-[1.35rem] border border-white/60 bg-white/75 px-4 py-4 text-sm text-muted-foreground">
                  {t("client.noOrders")}
                </div>
              )}
            </div>
          </section>

          <section className="surface-card rounded-[1.8rem] p-6">
            <div className="text-xs font-bold tracking-[0.24em] text-primary">
              {t("client.workspaceReady")}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-foreground">
              {t("client.panelHandles")}
            </h2>
            <div className="mt-5 space-y-3">
              <PanelNote
                label={t("client.orders")}
                value={t("client.ordersValue")}
              />
              <PanelNote
                label={t("client.notifications")}
                value={t("client.notificationsValue")}
              />
              <PanelNote
                label={t("client.smartControl")}
                value={t("client.smartValue")}
              />
            </div>
          </section>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}

function ClientMetric({
  label,
  value,
  icon: Icon,
  to,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="surface-subtle rounded-[1.5rem] p-5 transition-transform hover:-translate-y-0.5"
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-hero">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="mt-4 text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </Link>
  );
}

function PanelNote({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-subtle rounded-2xl px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-semibold text-foreground">{value}</div>
    </div>
  );
}

function ActionCard({
  to,
  title,
  text,
}: {
  to: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="surface-card rounded-[1.6rem] p-5 transition-transform hover:-translate-y-0.5"
    >
      <div className="text-lg font-semibold text-foreground">{title}</div>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
    </Link>
  );
}
