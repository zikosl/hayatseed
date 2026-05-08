import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ClipboardList,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  AdminSelect,
  AdminStat,
  AdminToolbar,
  DangerButton,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  TextAreaField,
  formatDate,
} from "@/components/AdminPrimitives";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import type { Order, OrderEvent, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
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

const activeStatuses = new Set<OrderStatus>([
  "new",
  "contacted",
  "quoted",
  "approved",
  "in_progress",
]);

function AdminOrdersPage() {
  const { addOrderNote, deleteOrder, orders, updateOrderStatus, users } =
    useAppState();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    orders[0]?.id ?? null,
  );
  const [note, setNote] = useState("");
  const selected =
    orders.find((order) => order.id === selectedId) ?? orders[0] ?? null;

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const haystack = [
          order.orderNumber,
          order.customerName,
          order.customerEmail,
          order.customerPhone,
          order.itemLabel,
          order.location,
          order.accessCode,
        ]
          .join(" ")
          .toLowerCase();
        const matchesQuery = !query || haystack.includes(query.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;
        const matchesKind = kindFilter === "all" || order.kind === kindFilter;
        return matchesQuery && matchesStatus && matchesKind;
      }),
    [kindFilter, orders, query, statusFilter],
  );

  const activeCount = orders.filter((order) =>
    activeStatuses.has(order.status),
  ).length;
  const completedCount = orders.filter(
    (order) => order.status === "completed",
  ).length;
  const conversion = orders.length
    ? Math.round((completedCount / orders.length) * 100)
    : 0;

  function setStatus(order: Order, status: OrderStatus) {
    updateOrderStatus(order.id, status);
    toast.success(
      t("admin.orders.moved", {
        order: order.orderNumber,
        status: t(`status.${status}`),
      }),
    );
  }

  function addNote(order: Order) {
    if (!note.trim()) {
      toast.error(t("admin.orders.writeNote"));
      return;
    }
    addOrderNote(order.id, "admin", note);
    setNote("");
    toast.success(t("admin.orders.noteAdded"));
  }

  function removeOrder(order: Order) {
    if (!window.confirm(`Delete ${order.orderNumber}? This cannot be undone.`))
      return;
    deleteOrder(order.id);
    setSelectedId(orders.find((entry) => entry.id !== order.id)?.id ?? null);
    toast.success(t("admin.orders.deleted"));
  }

  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        kicker={t("admin.orders.kicker")}
        title={t("admin.orders.title")}
        intro={t("admin.orders.intro")}
      >
        <div className="grid gap-3 md:grid-cols-4">
          <AdminStat
            icon={ClipboardList}
            label={t("admin.orders.total")}
            value={`${orders.length}`}
          />
          <AdminStat
            icon={RotateCcw}
            label={t("admin.orders.activeQueue")}
            value={`${activeCount}`}
          />
          <AdminStat
            icon={TrendingUp}
            label={t("admin.orders.completed")}
            value={`${completedCount}`}
          />
          <AdminStat
            icon={TrendingUp}
            label={t("admin.orders.completion")}
            value={`${conversion}%`}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.65fr)]">
          <section className="space-y-4">
            <AdminToolbar
              query={query}
              onQueryChange={setQuery}
              placeholder={t("admin.orders.search")}
            >
              <AdminSelect
                label={t("common.status")}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <option value="all">{t("common.all")}</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {t(`status.${status}`)}
                  </option>
                ))}
              </AdminSelect>
              <AdminSelect
                label={t("admin.orders.type")}
                value={kindFilter}
                onChange={setKindFilter}
              >
                <option value="all">{t("common.all")}</option>
                <option value="product">{t("nav.products")}</option>
                <option value="service">{t("nav.services")}</option>
              </AdminSelect>
            </AdminToolbar>

            <div className="surface-card overflow-hidden rounded-lg">
              <div className="grid grid-cols-[1.1fr_0.85fr_0.75fr_0.55fr_0.45fr] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground max-lg:hidden">
                <div>{t("admin.orders.order")}</div>
                <div>{t("admin.orders.client")}</div>
                <div>{t("common.status")}</div>
                <div>{t("admin.orders.origin")}</div>
                <div className="text-right">{t("admin.orders.open")}</div>
              </div>
              <div className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedId(order.id)}
                    className={`grid w-full gap-3 px-4 py-4 text-left transition lg:grid-cols-[1.1fr_0.85fr_0.75fr_0.55fr_0.45fr] lg:items-center ${
                      selected?.id === order.id
                        ? "bg-secondary/70"
                        : "hover:bg-secondary/45"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                        {order.orderNumber}
                      </div>
                      <div className="mt-1 truncate font-semibold text-foreground">
                        {order.itemLabel}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="min-w-0 text-sm">
                      <div className="truncate font-semibold text-foreground">
                        {order.customerName}
                      </div>
                      <div className="truncate text-muted-foreground">
                        {order.location}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                    <div className="text-sm capitalize text-muted-foreground">
                      {order.userId
                        ? t("admin.orders.client")
                        : t("layout.visitorSpace")}{" "}
                      /{" "}
                      {order.kind === "product"
                        ? t("order.product")
                        : t("order.service")}
                    </div>
                    <div className="text-right text-sm font-semibold text-primary">
                      {t("admin.orders.details")}
                    </div>
                  </button>
                ))}
                {!filteredOrders.length && (
                  <div className="p-4">
                    <EmptyState
                      title={t("admin.orders.noMatch")}
                      text={t("admin.orders.noMatchText")}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="surface-card rounded-lg p-5 xl:sticky xl:top-24 xl:self-start">
            {selected ? (
              <OrderDetails
                order={selected}
                clientName={
                  users.find((user) => user.id === selected.userId)?.name
                }
                note={note}
                setNote={setNote}
                onAddNote={() => addNote(selected)}
                onDelete={() => removeOrder(selected)}
                onStatus={(status) => setStatus(selected, status)}
              />
            ) : (
              <EmptyState
                title={t("admin.orders.noSelected")}
                text={t("admin.orders.noSelectedText")}
              />
            )}
          </aside>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}

function OrderDetails({
  order,
  clientName,
  note,
  setNote,
  onAddNote,
  onDelete,
  onStatus,
}: {
  order: Order;
  clientName?: string;
  note: string;
  setNote: (value: string) => void;
  onAddNote: () => void;
  onDelete: () => void;
  onStatus: (status: OrderStatus) => void;
}) {
  const { t } = useI18n();
  const whatsappHref = `https://wa.me/${order.customerPhone.replace(/\D/g, "")}`;
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {order.orderNumber}
          </div>
          <h2 className="mt-1 text-xl font-semibold text-foreground">
            {order.itemLabel}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{order.location}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Detail label={t("admin.orders.customer")} value={order.customerName} />
        <Detail
          label={t("admin.orders.account")}
          value={clientName ?? t("admin.orders.visitorOrder")}
        />
        <Detail label={t("ct.phone")} value={order.customerPhone} />
        <Detail label={t("admin.orders.access")} value={order.accessCode} />
        <Detail label={t("admin.orders.channel")} value={order.channel} />
        <Detail
          label={t("admin.orders.preferred")}
          value={order.preferredContact}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-semibold hover:bg-secondary"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={`tel:${order.customerPhone}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-semibold hover:bg-secondary"
        >
          <Phone className="h-4 w-4" />
          {t("ct.phone")}
        </a>
        {order.customerEmail && (
          <a
            href={`mailto:${order.customerEmail}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-semibold hover:bg-secondary"
          >
            <Mail className="h-4 w-4" />
            {t("ct.email")}
          </a>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("admin.orders.request")}
        </div>
        <p className="mt-2 text-sm leading-6 text-foreground">
          {order.message}
        </p>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("admin.orders.moveStatus")}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => onStatus(status)}
              className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                order.status === status
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              {t(`status.${status}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <TextAreaField
          label={t("admin.orders.adminNote")}
          value={note}
          onChange={setNote}
          placeholder={t("admin.orders.notePlaceholder")}
        />
        <div className="flex flex-wrap gap-2">
          <PrimaryButton onClick={onAddNote}>
            <Plus className="h-4 w-4" />
            {t("admin.orders.addNote")}
          </PrimaryButton>
          <DangerButton onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            {t("admin.orders.deleteOrder")}
          </DangerButton>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("admin.orders.timeline")}
        </div>
        {(order.timeline ?? []).map((event) => (
          <TimelineItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold capitalize text-foreground">
        {value || t("admin.orders.notProvided")}
      </div>
    </div>
  );
}

function TimelineItem({ event }: { event: OrderEvent }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold capitalize text-foreground">
          {event.actor} · {event.type}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDate(event.createdAt)}
        </div>
      </div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {event.message}
      </p>
    </div>
  );
}
