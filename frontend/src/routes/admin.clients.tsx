import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  AdminStat,
  AdminToolbar,
  DangerButton,
  EmptyState,
  Field,
  PrimaryButton,
  StatusBadge,
  TextAreaField,
  formatDate,
} from "@/components/AdminPrimitives";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import type { User } from "@/lib/types";

export const Route = createFileRoute("/admin/clients")({
  component: AdminClientsPage,
});

type ClientForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const blankClient: ClientForm = {
  name: "",
  email: "",
  phone: "",
  password: "client123",
};

function AdminClientsPage() {
  const {
    createClient,
    createNotification,
    deleteClient,
    notifications,
    orders,
    updateClient,
    users,
  } = useAppState();
  const clients = users.filter((user) => user.role === "client");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    clients[0]?.id ?? null,
  );
  const [draft, setDraft] = useState<ClientForm>(blankClient);
  const [message, setMessage] = useState("");
  const selected =
    clients.find((client) => client.id === selectedId) ?? clients[0] ?? null;

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        [client.name, client.email, client.phone]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [clients, query],
  );

  const ordersByClient = useMemo(
    () =>
      Object.fromEntries(
        clients.map((client) => [
          client.id,
          orders.filter((order) => order.userId === client.id),
        ]),
      ),
    [clients, orders],
  );

  const totalAttachedOrders = orders.filter((order) => order.userId).length;
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  ).length;

  function beginCreate() {
    setSelectedId(null);
    setDraft(blankClient);
  }

  function beginEdit(client: User) {
    setSelectedId(client.id);
    setDraft({
      name: client.name,
      email: client.email,
      phone: client.phone ?? "",
      password: client.password,
    });
  }

  function saveClient(event: React.FormEvent) {
    event.preventDefault();
    if (
      !draft.name.trim() ||
      !draft.email.trim() ||
      (!selectedId && !draft.password.trim())
    ) {
      toast.error("Client needs name, email, and password.");
      return;
    }
    const duplicate = users.some(
      (user) =>
        user.email === draft.email.trim().toLowerCase() &&
        user.id !== selectedId,
    );
    if (duplicate) {
      toast.error("A user with this email already exists.");
      return;
    }
    if (selectedId) {
      updateClient(selectedId, {
        name: draft.name.trim(),
        email: draft.email.trim().toLowerCase(),
        phone: draft.phone.trim(),
      });
      toast.success("Client profile updated.");
      return;
    }
    createClient({
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      phone: draft.phone.trim(),
      password: draft.password.trim(),
    });
    setDraft(blankClient);
    toast.success("Client created.");
  }

  function notifyClient(client: User) {
    if (!message.trim()) {
      toast.error("Write a notification before sending.");
      return;
    }
    createNotification({
      userId: client.id,
      title: "Admin update",
      body: message.trim(),
    });
    setMessage("");
    toast.success(`Notification sent to ${client.name}.`);
  }

  function removeClient(client: User) {
    if (
      !window.confirm(
        `Remove ${client.name}? Existing orders will remain as visitor orders.`,
      )
    ) {
      return;
    }
    deleteClient(client.id);
    setSelectedId(clients.find((entry) => entry.id !== client.id)?.id ?? null);
    toast.success("Client removed and orders detached.");
  }

  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        kicker="ADMIN CLIENTS"
        title="Clients"
        intro="Manage client accounts, contact details, order history, and direct notifications from one CRM-style workspace."
      >
        <div className="grid gap-3 md:grid-cols-4">
          <AdminStat
            icon={UsersRound}
            label="Clients"
            value={`${clients.length}`}
          />
          <AdminStat
            icon={BadgeCheck}
            label="Attached orders"
            value={`${totalAttachedOrders}`}
          />
          <AdminStat
            icon={Mail}
            label="Unread notices"
            value={`${unreadNotifications}`}
          />
          <AdminStat
            icon={ShieldCheck}
            label="Avg orders"
            value={`${(totalAttachedOrders / Math.max(clients.length, 1)).toFixed(1)}`}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(390px,0.85fr)]">
          <section className="space-y-4">
            <AdminToolbar
              query={query}
              onQueryChange={setQuery}
              placeholder="Search clients by name, email, or phone"
            >
              <PrimaryButton onClick={beginCreate}>
                <UserPlus className="h-4 w-4" />
                New client
              </PrimaryButton>
            </AdminToolbar>

            <div className="surface-card overflow-hidden rounded-lg">
              <div className="grid grid-cols-[1fr_0.7fr_0.45fr_0.45fr] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground max-lg:hidden">
                <div>Client</div>
                <div>Contact</div>
                <div>Orders</div>
                <div className="text-right">Open</div>
              </div>
              <div className="divide-y divide-border">
                {filteredClients.map((client) => {
                  const clientOrders = ordersByClient[client.id] ?? [];
                  return (
                    <button
                      key={client.id}
                      onClick={() => beginEdit(client)}
                      className={`grid w-full gap-3 px-4 py-4 text-left transition lg:grid-cols-[1fr_0.7fr_0.45fr_0.45fr] lg:items-center ${
                        selected?.id === client.id
                          ? "bg-secondary/70"
                          : "hover:bg-secondary/45"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-foreground">
                          {client.name}
                        </div>
                        <div className="truncate text-sm text-muted-foreground">
                          {client.email}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {client.phone || "No phone"}
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {clientOrders.length}
                      </div>
                      <div className="text-right text-sm font-semibold text-primary">
                        Profile
                      </div>
                    </button>
                  );
                })}
                {!filteredClients.length && (
                  <div className="p-4">
                    <EmptyState
                      title="No clients found"
                      text="Adjust search or create a new managed client account."
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="surface-card rounded-lg p-5 xl:sticky xl:top-24 xl:self-start">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {selected ? "Client profile" : "New client"}
                </div>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {selected?.name ?? "Create account"}
                </h2>
              </div>
              {selected && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  Client
                </span>
              )}
            </div>

            <form onSubmit={saveClient} className="mt-5 space-y-4">
              <Field
                label="Name"
                value={draft.name}
                onChange={(value) => setDraft({ ...draft, name: value })}
                placeholder="Client name"
                required
              />
              <Field
                label="Email"
                type="email"
                value={draft.email}
                onChange={(value) => setDraft({ ...draft, email: value })}
                placeholder="client@hayatseed.dz"
                required
              />
              <Field
                label="Phone"
                value={draft.phone}
                onChange={(value) => setDraft({ ...draft, phone: value })}
                placeholder="+213..."
              />
              {!selected && (
                <Field
                  label="Temporary password"
                  value={draft.password}
                  onChange={(value) => setDraft({ ...draft, password: value })}
                  required
                />
              )}
              <PrimaryButton type="submit">
                <UserPlus className="h-4 w-4" />
                {selected ? "Save profile" : "Create client"}
              </PrimaryButton>
            </form>

            {selected && (
              <div className="mt-6 space-y-5">
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Contact
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${selected.email}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-secondary"
                        aria-label="Email client"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      {selected.phone && (
                        <a
                          href={`tel:${selected.phone}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-secondary"
                          aria-label="Call client"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <TextAreaField
                    label="Send notification"
                    value={message}
                    onChange={setMessage}
                    placeholder="Write a client-facing notification"
                  />
                  <div className="flex flex-wrap gap-2">
                    <PrimaryButton onClick={() => notifyClient(selected)}>
                      <Send className="h-4 w-4" />
                      Notify
                    </PrimaryButton>
                    <DangerButton onClick={() => removeClient(selected)}>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </DangerButton>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Order history
                  </div>
                  {(ordersByClient[selected.id] ?? []).map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border border-border bg-card p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {order.orderNumber}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {order.itemLabel} · {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                  {!(ordersByClient[selected.id] ?? []).length && (
                    <EmptyState
                      title="No orders yet"
                      text="This client has no linked orders in the workspace."
                    />
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}
