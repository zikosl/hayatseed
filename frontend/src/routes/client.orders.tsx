import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useAuth } from "@/lib/auth";
import type { OrderEvent, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/client/orders")({
  component: ClientOrdersPage,
});

function ClientOrdersPage() {
  const { user } = useAuth();
  const { addOrderNote, clientRespondToOrder, orders } = useAppState();
  const clientOrders = orders.filter((order) => order.userId === user?.id);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [kindFilter, setKindFilter] = useState<"all" | "product" | "service">(
    "all",
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    clientOrders[0]?.id ?? null,
  );
  const [note, setNote] = useState("");

  const filteredOrders = useMemo(
    () =>
      clientOrders.filter((order) => {
        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;
        const matchesKind = kindFilter === "all" || order.kind === kindFilter;
        return matchesStatus && matchesKind;
      }),
    [clientOrders, kindFilter, statusFilter],
  );

  useEffect(() => {
    if (!filteredOrders.find((order) => order.id === selectedOrderId)) {
      setSelectedOrderId(filteredOrders[0]?.id ?? null);
    }
  }, [filteredOrders, selectedOrderId]);

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) ?? null;

  return (
    <RoleGate allow={["client", "admin"]}>
      <DashboardShell
        kicker="CLIENT ORDERS"
        title="Your orders"
        intro="Both product and service requests live here, along with status history, admin notes, and client responses."
      >
        <div className="surface-card grid gap-3 rounded-[1.7rem] p-5 md:grid-cols-2">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | OrderStatus)
            }
            className="rounded-[1.1rem] border border-white/60 bg-white/80 px-4 py-3 text-sm outline-none"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={kindFilter}
            onChange={(event) =>
              setKindFilter(event.target.value as "all" | "product" | "service")
            }
            className="rounded-[1.1rem] border border-white/60 bg-white/80 px-4 py-3 text-sm outline-none"
          >
            <option value="all">All order types</option>
            <option value="product">Products</option>
            <option value="service">Services</option>
          </select>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="space-y-3">
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`block w-full rounded-[1.7rem] p-5 text-left transition-transform hover:-translate-y-0.5 ${
                  selectedOrder?.id === order.id
                    ? "border border-primary/20 bg-primary/5 shadow-soft"
                    : "surface-card"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold tracking-widest text-primary">
                      {order.orderNumber}
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-foreground">
                      {order.itemLabel}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.kind === "product"
                        ? "Product request"
                        : "Service request"}
                    </p>
                  </div>
                  <span className="rounded-full border border-primary/15 bg-primary/7 px-3 py-1 text-xs font-semibold uppercase text-primary">
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <OrderMeta label="Location" value={order.location} />
                  <OrderMeta label="Contact" value={order.preferredContact} />
                  <OrderMeta label="Access code" value={order.accessCode} />
                </div>
              </button>
            ))}
            {!filteredOrders.length && (
              <div className="surface-card rounded-[1.7rem] p-6 text-sm text-muted-foreground">
                No client orders match the selected filters.
              </div>
            )}
            <Link
              to="/order"
              className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Create another order
            </Link>
          </section>

          <section className="surface-card rounded-[1.8rem] p-6">
            {selectedOrder ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold tracking-[0.24em] text-primary">
                      ORDER DETAIL
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold text-foreground">
                      {selectedOrder.itemLabel}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {selectedOrder.message}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {selectedOrder.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <ActionButton
                    icon={ShieldCheck}
                    label="Approve"
                    onClick={() =>
                      clientRespondToOrder(selectedOrder.id, "approve")
                    }
                    disabled={
                      selectedOrder.status === "approved" ||
                      selectedOrder.status === "completed"
                    }
                  />
                  <ActionButton
                    icon={PhoneCall}
                    label="Request callback"
                    onClick={() =>
                      clientRespondToOrder(selectedOrder.id, "request_callback")
                    }
                    disabled={selectedOrder.status === "cancelled"}
                  />
                  <ActionButton
                    icon={XCircle}
                    label="Cancel request"
                    onClick={() =>
                      clientRespondToOrder(selectedOrder.id, "cancel")
                    }
                    disabled={
                      selectedOrder.status === "cancelled" ||
                      selectedOrder.status === "completed"
                    }
                    tone="danger"
                  />
                </div>

                <div className="mt-6">
                  <div className="text-xs font-bold tracking-[0.24em] text-primary">
                    TIMELINE
                  </div>
                  <div className="mt-4 space-y-3">
                    {(selectedOrder.timeline ?? []).map((event) => (
                      <TimelineItem key={event.id} event={event} />
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-white/60 bg-white/75 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MessageSquareText className="h-4 w-4 text-primary" />
                    Send a note to Hayatseed
                  </div>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={4}
                    className="mt-3 w-full rounded-[1rem] border border-white/60 bg-white/80 px-4 py-3 text-sm outline-none"
                    placeholder="Ask a question, confirm details, or request a follow-up."
                  />
                  <button
                    onClick={() => {
                      if (!note.trim()) return;
                      addOrderNote(selectedOrder.id, "client", note);
                      setNote("");
                    }}
                    className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Send note
                  </button>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Select an order to see its status history and actions.
              </div>
            )}
          </section>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}

function OrderMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-subtle rounded-2xl px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-semibold capitalize text-foreground">
        {value}
      </div>
    </div>
  );
}

function TimelineItem({ event }: { event: OrderEvent }) {
  return (
    <div className="rounded-[1.35rem] border border-white/60 bg-white/75 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock3 className="h-4 w-4 text-primary" />
          <span className="capitalize">{event.actor}</span>
          <span className="text-muted-foreground">· {event.type}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(event.createdAt).toLocaleString()}
        </div>
      </div>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {event.message}
      </p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  tone = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "primary" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-[1.2rem] px-4 py-3 text-sm font-semibold ${
        tone === "danger"
          ? "bg-destructive text-destructive-foreground disabled:opacity-50"
          : "bg-primary text-primary-foreground disabled:opacity-50"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
