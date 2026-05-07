import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  PackagePlus,
  ShoppingBag,
  Sprout,
  Users,
} from "lucide-react";
import {
  AdminStat,
  StatusBadge,
  formatDate,
  formatDzd,
} from "@/components/AdminPrimitives";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import type { OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  component: AdminHomePage,
});

const statuses: OrderStatus[] = [
  "new",
  "contacted",
  "quoted",
  "approved",
  "in_progress",
  "completed",
  "cancelled",
];

function AdminHomePage() {
  const location = useLocation();
  const { t } = useI18n();
  const { orders, products, services, users } = useAppState();
  if (location.pathname !== "/admin") return <Outlet />;

  const clients = users.filter((user) => user.role === "client");
  const activeOrders = orders.filter((order) =>
    ["new", "contacted", "quoted", "approved", "in_progress"].includes(
      order.status,
    ),
  );
  const visibleProducts = products.filter((product) => product.active);
  const visibleServices = services.filter((service) => service.active);
  const catalogValue = visibleProducts.reduce(
    (sum, product) => sum + product.price,
    0,
  );
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        kicker={t("admin.dashboard.kicker")}
        title={t("admin.dashboard.title")}
        intro={t("admin.dashboard.intro")}
      >
        <div className="grid gap-3 md:grid-cols-4">
          <AdminStat
            icon={ShoppingBag}
            label={t("admin.activeOrders")}
            value={`${activeOrders.length}`}
          />
          <AdminStat
            icon={Users}
            label={t("admin.clients")}
            value={`${clients.length}`}
          />
          <AdminStat
            icon={Boxes}
            label={t("admin.visibleProducts")}
            value={`${visibleProducts.length}`}
          />
          <AdminStat
            icon={Sprout}
            label={t("admin.visibleServices")}
            value={`${visibleServices.length}`}
            detail={`${formatDzd(catalogValue)} ${t("admin.productCatalog")}`}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <section className="surface-card rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {t("admin.orderQueue")}
                </div>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {t("admin.statusOverview")}
                </h2>
              </div>
              <Link
                to="/admin/orders"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground"
              >
                {t("admin.openOrders")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {statuses.map((status) => {
                const count = orders.filter(
                  (order) => order.status === status,
                ).length;
                return (
                  <Link
                    key={status}
                    to="/admin/orders"
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition hover:border-primary/25 hover:bg-secondary/70"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {t(`status.${status}`)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {count === 1
                          ? t("admin.orderOne")
                          : t("admin.orderMany", { count })}
                      </div>
                    </div>
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-semibold ${
                        count
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="surface-card rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {t("admin.quickActions")}
            </div>
            <div className="mt-4 grid gap-2">
              <Shortcut
                to="/admin/orders"
                icon={Clock3}
                title={t("admin.reviewQueue")}
                text={t("admin.reviewQueueText", {
                  count: activeOrders.length,
                })}
              />
              <Shortcut
                to="/admin/products"
                icon={PackagePlus}
                title={t("admin.addProduct")}
                text={t("admin.addProductText")}
              />
              <Shortcut
                to="/admin/services"
                icon={Sprout}
                title={t("admin.maintainServices")}
                text={t("admin.maintainServicesText")}
              />
              <Shortcut
                to="/admin/clients"
                icon={Users}
                title={t("admin.followClients")}
                text={t("admin.followClientsText")}
              />
            </div>
          </section>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <section className="surface-card rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {t("admin.recentOrders")}
                </div>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {t("admin.latestActivity")}
                </h2>
              </div>
              <Link
                to="/admin/orders"
                className="text-sm font-semibold text-primary"
              >
                {t("common.viewAll")}
              </Link>
            </div>
            <div className="mt-4 divide-y divide-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                      {order.orderNumber}
                    </div>
                    <div className="mt-1 font-semibold text-foreground">
                      {order.itemLabel}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card rounded-lg p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {t("admin.systemReadiness")}
            </div>
            <div className="mt-4 grid gap-3">
              <Readiness
                label={t("admin.catalogVisibility")}
                value={t("admin.catalogVisibilityValue", {
                  products: visibleProducts.length,
                  services: visibleServices.length,
                })}
              />
              <Readiness
                label={t("admin.clientAccess")}
                value={t("admin.clientAccessValue", { count: clients.length })}
              />
              <Readiness
                label={t("admin.workflow")}
                value={t("admin.workflowValue")}
              />
            </div>
          </section>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}

function Shortcut({
  to,
  icon: Icon,
  title,
  text,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition hover:bg-secondary"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary">
          <Icon className="h-5 w-5 text-primary" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-foreground">{title}</span>
          <span className="block truncate text-sm text-muted-foreground">
            {text}
          </span>
        </span>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
    </Link>
  );
}

function Readiness({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <div className="text-sm font-semibold text-foreground">{label}</div>
      </div>
      <div className="mt-1 text-sm leading-6 text-muted-foreground">
        {value}
      </div>
    </div>
  );
}
