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
              Operations software for irrigation, orders, and field coordination
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
                  Hayatseed Platform
                </div>
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Smart land operations
                </div>
              </div>
            </div>

            <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-[3.6rem]">
              Run irrigation, orders, and field service from one clean control
              layer.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Hayatseed combines smart irrigation control, guest ordering,
              client follow-up, and admin operations in a product that feels
              modern enough for SaaS and practical enough for real work on the
              ground.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
              >
                Start an order <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-5 py-3 text-sm font-semibold text-foreground"
              >
                Open workspace
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <HeroStat value="38%" label="Water reduction model" />
              <HeroStat value="3 roles" label="Visitor, client, admin" />
              <HeroStat value="24/7" label="Order tracking access" />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="surface-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold tracking-[0.24em] text-primary">
                  LIVE PANEL
                </div>
                <h2 className="mt-2 text-xl font-semibold text-foreground">
                  Smart irrigation snapshot
                </h2>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                Demo Mode
              </span>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-gradient-card-active p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/70">
                  Main Valve
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    isOn
                      ? "bg-success/20 text-success"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {isOn ? "Active" : "Standby"}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-foreground/72">Runtime</div>
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
                <MiniMetric value="A-C" label="Zones" />
                <MiniMetric value="Auto" label="Mode" />
                <MiniMetric value="58%" label="Humidity" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <QuickCard
              icon={ShieldCheck}
              title="Client-only Smart Control"
              text="Visitors can order and track. Clients get the operational control layer."
            />
            <QuickCard
              icon={Bell}
              title="Unified notifications"
              text="Orders, approvals, and irrigation events all belong in one workflow."
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            to: "/services" as const,
            label: "Services catalog",
            text: "Hydroseeding, irrigation installation, and land restoration services.",
            icon: Leaf,
          },
          {
            to: "/products" as const,
            label: "Products catalog",
            text: "Grass seed, mulch fiber, and biofertilizer with order-ready flows.",
            icon: ShoppingBag,
          },
          {
            to: "/smart-control" as const,
            label: "Smart Control",
            text: "Client-focused control panel with simulation mode and zone logic.",
            icon: Cpu,
          },
          {
            to: "/order" as const,
            label: "Order desk",
            text: "Choose platform submission or WhatsApp handoff in one place.",
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
            WHY IT WORKS
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            A calm product surface for messy real operations
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            The visitor flow stays simple. The client workspace stays focused.
            The admin workspace keeps the dense decisions where they belong.
          </p>
          <div className="mt-6 space-y-3">
            <FeatureRow
              icon={Gauge}
              title="Operational visibility"
              text="Track orders, zones, sensor simulation, and contact preferences without context switching."
            />
            <FeatureRow
              icon={CloudOff}
              title="Offline-first mindset"
              text="The product is framed around remote areas where reliability matters more than flashy automation."
            />
            <FeatureRow
              icon={Mountain}
              title="Built for land work"
              text="Hydroseeding, irrigation, and soil stabilization are first-class entities, not generic SaaS placeholders."
            />
          </div>
        </div>

        <div className="surface-card rounded-[1.75rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold tracking-[0.24em] text-primary">
                WORKSPACE FLOW
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                From visitor to managed client
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <FlowCard
              step="01"
              title="Visitor order"
              text="Guests choose product or service, then send through the platform or WhatsApp."
            />
            <FlowCard
              step="02"
              title="Client workspace"
              text="Signed-in clients review orders, notifications, tracking, and irrigation access."
            />
            <FlowCard
              step="03"
              title="Admin control"
              text="Operations teams manage products, services, clients, and order status from one hub."
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
