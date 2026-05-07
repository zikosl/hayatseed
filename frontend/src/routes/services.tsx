import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Droplet,
  Mountain,
  Sprout,
  Trees,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Hayatseed" },
      {
        name: "description",
        content:
          "Hydroseeding, smart & offline irrigation, landscaping and soil stabilization in Algeria.",
      },
    ],
  }),
  component: ServicesPage,
});

const serviceIcons = [Sprout, Droplet, Wifi, WifiOff, Trees, Mountain];

function ServicesPage() {
  const { services } = useAppState();
  const { t } = useI18n();
  const visibleServices = services.filter((service) => service.active);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.32em] text-primary">
            {t("svc.kicker")}
          </div>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {t("svc.heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("svc.intro")} {t("svc.heroIntro")}
          </p>
        </div>
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.28em] text-muted-foreground">
            {t("svc.delivery")}
          </div>
          <div className="mt-5 space-y-3">
            <ServiceMetric
              label={t("svc.visibleServices")}
              value={`${visibleServices.length} ${t("svc.activeOfferings")}`}
            />
            <ServiceMetric
              label={t("svc.imageSource")}
              value={t("svc.linkedRecords")}
            />
            <ServiceMetric
              label={t("svc.orderPath")}
              value={t("svc.orderPathValue")}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        {visibleServices.map((service, index) => {
          const Icon = serviceIcons[index % serviceIcons.length];
          return (
            <article
              key={service.id}
              className="group relative min-h-[320px] overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-card"
            >
              {service.image && (
                <img
                  src={service.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/82 via-foreground/48 to-primary/22" />
              <div className="relative flex h-full min-h-[320px] flex-col justify-end p-6 text-primary-foreground">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/25 bg-white/18 backdrop-blur">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{service.name}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/82">
                  {service.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full border border-white/25 bg-white/16 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">
                    {t("svc.fieldService")}
                  </span>
                  <Link
                    to="/order"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary"
                  >
                    {t("svc.request")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ServiceMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/60 bg-white/75 p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
