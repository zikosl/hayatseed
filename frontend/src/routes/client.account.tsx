import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Mail, Phone, UserCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/client/account")({
  component: ClientAccountPage,
});

function ClientAccountPage() {
  const { user } = useAuth();
  const { notifications, orders, updateClient } = useAppState();
  const { t } = useI18n();

  if (!user) return null;

  const myOrders = orders.filter((order) => order.userId === user.id);
  const unread = notifications.filter(
    (notification) => notification.userId === user.id && !notification.read,
  ).length;

  return (
    <RoleGate allow={["client", "admin"]}>
      <DashboardShell
        kicker={t("client.account.kicker")}
        title={t("client.account.title")}
        intro={t("client.account.intro")}
      >
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="surface-card rounded-[1.8rem] p-6">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero">
              <UserCircle2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="mt-5 space-y-4">
              <EditableField
                icon={UserCircle2}
                label={t("order.fullName")}
                value={user.name}
                onChange={(value) => updateClient(user.id, { name: value })}
              />
              <EditableField
                icon={Mail}
                label={t("auth.email")}
                value={user.email}
                onChange={(value) => updateClient(user.id, { email: value })}
              />
              <EditableField
                icon={Phone}
                label={t("ct.phone")}
                value={user.phone ?? ""}
                onChange={(value) => updateClient(user.id, { phone: value })}
              />
            </div>
          </section>

          <section className="surface-card rounded-[1.8rem] p-6">
            <div className="text-xs font-bold tracking-[0.24em] text-primary">
              {t("client.account.profileStatus")}
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              {t("client.account.relationship")}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <ProfileStat
                label={t("client.orders")}
                value={`${myOrders.length}`}
              />
              <ProfileStat
                label={t("client.unreadAlerts")}
                value={`${unread}`}
              />
              <ProfileStat
                label={t("client.account.state")}
                value={user.role === "admin" ? "Admin" : "Client"}
              />
            </div>
            <div className="mt-5 space-y-3">
              <ProfileNote
                icon={BadgeCheck}
                title={t("client.account.why")}
                text={t("client.account.whyText")}
              />
              <ProfileNote
                icon={Phone}
                title={t("client.account.bestPractice")}
                text={t("client.account.bestPracticeText")}
              />
            </div>
          </section>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}

function EditableField({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[1.35rem] border border-white/60 bg-white/75 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full bg-transparent text-base font-semibold text-foreground outline-none"
      />
    </label>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-white/60 bg-white/75 p-4">
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function ProfileNote({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/60 bg-white/75 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </div>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
