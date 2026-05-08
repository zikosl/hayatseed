import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CloudOff,
  Cpu,
  Droplet,
  Gauge,
  Leaf,
  Mountain,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import logo from "@/assets/hayatseed-logo.png";
import { useI18n } from "@/lib/i18n";
import { formatDuration, useIrrigation } from "@/lib/irrigation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hayatseed — Bringing Life to Dry Lands" },
      {
        name: "description",
        content:
          "Hayatseed turns irrigation, hydroseeding, and land restoration into a modern operations platform for Algeria.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();
  const { isOn, elapsed } = useIrrigation();

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
        <div className="surface-card data-grid relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-36 w-36 rounded-full bg-teal/12 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/7 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {t("home.opsBadge")}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero shadow-soft">
                <img
                  src={logo}
                  alt="Hayatseed"
                  className="h-9 w-auto brightness-[1.08]"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {t("home.platform")}
                </div>
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {t("home.landOps")}
                </div>
              </div>
            </div>

            <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-[3.6rem]">
              {t("home.mainTitle")}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              {t("home.mainIntro")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
              >
                {t("home.startOrder")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-5 py-3 text-sm font-semibold text-foreground"
              >
                {t("home.openWorkspace")}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <HeroStat value="38%" label={t("home.stat.water")} />
              <HeroStat value="3" label={t("home.stat.roles")} />
              <HeroStat value="24/7" label={t("home.stat.tracking")} />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="surface-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold tracking-[0.24em] text-primary">
                  {t("home.livePanel")}
                </div>
                <h2 className="mt-2 text-xl font-semibold text-foreground">
                  {t("home.smartSnapshot")}
                </h2>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                {t("home.demoMode")}
              </span>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-gradient-card-active p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/70">
                  {t("home.mainValve")}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    isOn
                      ? "bg-success/20 text-success"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {isOn ? t("common.active") : t("home.standby")}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-foreground/72">
                    {t("home.runtime")}
                  </div>
                  <div className="mt-1 font-mono text-3xl font-bold text-foreground">
                    {formatDuration(isOn ? elapsed : 0)}
                  </div>
                </div>
                <div className="grid h-20 w-20 place-items-center rounded-full bg-card/80 shadow-soft">
                  <Droplet
                    className={`h-9 w-9 ${isOn ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <MiniMetric value="A-C" label={t("smart.zone")} />
                <MiniMetric
                  value={t("home.stat.auto")}
                  label={t("home.stat.mode")}
                />
                <MiniMetric value="58%" label={t("home.humidity")} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <QuickCard
              icon={ShieldCheck}
              title={t("home.clientOnlySmart")}
              text={t("home.clientOnlySmartText")}
            />
            <QuickCard
              icon={Bell}
              title={t("home.unifiedNotifications")}
              text={t("home.unifiedNotificationsText")}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            to: "/services" as const,
            label: t("home.servicesCatalog"),
            text: t("home.servicesCatalogText"),
            icon: Leaf,
          },
          {
            to: "/products" as const,
            label: t("home.productsCatalog"),
            text: t("home.productsCatalogText"),
            icon: ShoppingBag,
          },
          {
            to: "/smart-control" as const,
            label: t("nav.smart"),
            text: t("home.smartControlText"),
            icon: Cpu,
          },
          {
            to: "/order" as const,
            label: t("home.orderDesk"),
            text: t("home.orderDeskText"),
            icon: Wrench,
          },
        ].map(({ to, label, text, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="surface-card rounded-[1.75rem] p-5 transition-transform hover:-translate-y-0.5"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-hero">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="mt-4 text-lg font-semibold text-foreground">
              {label}
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {text}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-card rounded-[1.75rem] p-6">
          <div className="text-xs font-bold tracking-[0.24em] text-primary">
            {t("home.why")}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            {t("home.whyTitle")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {t("home.whyText")}
          </p>
          <div className="mt-6 space-y-3">
            <FeatureRow
              icon={Gauge}
              title={t("home.visibility")}
              text={t("home.visibilityText")}
            />
            <FeatureRow
              icon={CloudOff}
              title={t("home.offlineMindset")}
              text={t("home.offlineMindsetText")}
            />
            <FeatureRow
              icon={Mountain}
              title={t("home.landWork")}
              text={t("home.landWorkText")}
            />
          </div>
        </div>

        <div className="surface-card rounded-[1.75rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold tracking-[0.24em] text-primary">
                {t("home.workspaceFlow")}
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                {t("home.workspaceFlowTitle")}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <FlowCard
              step="01"
              title={t("home.visitorOrder")}
              text={t("home.visitorOrderText")}
            />
            <FlowCard
              step="02"
              title={t("home.clientWorkspaceFlow")}
              text={t("home.clientWorkspaceFlowText")}
            />
            <FlowCard
              step="03"
              title={t("home.adminControl")}
              text={t("home.adminControlText")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="surface-subtle rounded-2xl px-4 py-4">
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-card/65 px-3 py-3 text-center">
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function QuickCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="surface-card rounded-[1.6rem] p-5">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="mt-4 text-lg font-semibold text-foreground">{title}</div>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="surface-subtle rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-foreground">{title}</div>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}

function FlowCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="surface-subtle rounded-2xl p-4">
      <div className="text-xs font-bold tracking-[0.24em] text-primary">
        {step}
      </div>
      <div className="mt-2 text-lg font-semibold text-foreground">{title}</div>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
