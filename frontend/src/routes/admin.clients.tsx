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
import { useI18n } from "@/lib/i18n";
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
  const { t } = useI18n();
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
      toast.error(t("admin.clients.validation"));
      return;
    }
    const duplicate = users.some(
      (user) =>
        user.email === draft.email.trim().toLowerCase() &&
        user.id !== selectedId,
    );
    if (duplicate) {
      toast.error(t("admin.clients.duplicate"));
      return;
    }
    if (selectedId) {
      updateClient(selectedId, {
        name: draft.name.trim(),
        email: draft.email.trim().toLowerCase(),
        phone: draft.phone.trim(),
      });
      toast.success(t("admin.clients.updated"));
      return;
    }
    createClient({
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      phone: draft.phone.trim(),
      password: draft.password.trim(),
    });
    setDraft(blankClient);
    toast.success(t("admin.clients.created"));
  }

  function notifyClient(client: User) {
    if (!message.trim()) {
      toast.error(t("admin.clients.writeNotification"));
      return;
    }
    createNotification({
      userId: client.id,
      title: t("admin.clients.adminUpdate"),
      body: message.trim(),
    });
    setMessage("");
    toast.success(t("admin.clients.notificationSent", { name: client.name }));
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
    toast.success(t("admin.clients.removed"));
  }

  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        kicker={t("admin.clients.kicker")}
        title={t("admin.clients.title")}
        intro={t("admin.clients.intro")}
      >
        <div className="grid gap-3 md:grid-cols-4">
          <AdminStat
            icon={UsersRound}
            label={t("admin.clients.title")}
            value={`${clients.length}`}
          />
          <AdminStat
            icon={BadgeCheck}
            label={t("admin.clients.attachedOrders")}
            value={`${totalAttachedOrders}`}
          />
          <AdminStat
            icon={Mail}
            label={t("admin.clients.unreadNotices")}
            value={`${unreadNotifications}`}
          />
          <AdminStat
            icon={ShieldCheck}
            label={t("admin.clients.avgOrders")}
            value={`${(totalAttachedOrders / Math.max(clients.length, 1)).toFixed(1)}`}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(390px,0.85fr)]">
          <section className="space-y-4">
            <AdminToolbar
              query={query}
              onQueryChange={setQuery}
              placeholder={t("admin.clients.search")}
            >
              <PrimaryButton onClick={beginCreate}>
                <UserPlus className="h-4 w-4" />
                {t("admin.clients.new")}
              </PrimaryButton>
            </AdminToolbar>

            <div className="surface-card overflow-hidden rounded-lg">
              <div className="grid grid-cols-[1fr_0.7fr_0.45fr_0.45fr] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground max-lg:hidden">
                <div>{t("admin.clients.title")}</div>
                <div>{t("admin.clients.contact")}</div>
                <div>{t("nav.orders")}</div>
                <div className="text-right">{t("admin.clients.open")}</div>
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
                        {client.phone || t("admin.clients.noPhone")}
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {clientOrders.length}
                      </div>
                      <div className="text-right text-sm font-semibold text-primary">
                        {t("admin.clients.profile")}
                      </div>
                    </button>
                  );
                })}
                {!filteredClients.length && (
                  <div className="p-4">
                    <EmptyState
                      title={t("admin.clients.noFound")}
                      text={t("admin.clients.noFoundText")}
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
                  {selected
                    ? t("admin.clients.clientProfile")
                    : t("admin.clients.new")}
                </div>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {selected?.name ?? t("admin.clients.createAccount")}
                </h2>
              </div>
              {selected && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {t("admin.clients.title")}
                </span>
              )}
            </div>

            <form onSubmit={saveClient} className="mt-5 space-y-4">
              <Field
                label={t("common.name")}
                value={draft.name}
                onChange={(value) => setDraft({ ...draft, name: value })}
                placeholder={t("admin.clients.clientName")}
                required
              />
              <Field
                label={t("auth.email")}
                type="email"
                value={draft.email}
                onChange={(value) => setDraft({ ...draft, email: value })}
                placeholder="client@hayatseed.dz"
                required
              />
              <Field
                label={t("ct.phone")}
                value={draft.phone}
                onChange={(value) => setDraft({ ...draft, phone: value })}
                placeholder="+213..."
              />
              {!selected && (
                <Field
                  label={t("admin.clients.tempPassword")}
                  value={draft.password}
                  onChange={(value) => setDraft({ ...draft, password: value })}
                  required
                />
              )}
              <PrimaryButton type="submit">
                <UserPlus className="h-4 w-4" />
                {selected
                  ? t("admin.clients.saveProfile")
                  : t("admin.clients.createClient")}
              </PrimaryButton>
            </form>

            {selected && (
              <div className="mt-6 space-y-5">
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {t("admin.clients.contact")}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${selected.email}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-secondary"
                        aria-label={t("admin.clients.emailClient")}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      {selected.phone && (
                        <a
                          href={`tel:${selected.phone}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-secondary"
                          aria-label={t("admin.clients.callClient")}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <TextAreaField
                    label={t("admin.clients.sendNotification")}
                    value={message}
                    onChange={setMessage}
                    placeholder={t("admin.clients.notificationPlaceholder")}
                  />
                  <div className="flex flex-wrap gap-2">
                    <PrimaryButton onClick={() => notifyClient(selected)}>
                      <Send className="h-4 w-4" />
                      {t("admin.clients.notify")}
                    </PrimaryButton>
                    <DangerButton onClick={() => removeClient(selected)}>
                      <Trash2 className="h-4 w-4" />
                      {t("admin.clients.remove")}
                    </DangerButton>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("admin.clients.orderHistory")}
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
                      title={t("admin.clients.noOrders")}
                      text={t("admin.clients.noOrdersText")}
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
