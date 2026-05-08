import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.32em] text-primary">
            {t("ct.kicker")}
          </div>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {t("contact.heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("contact.heroText")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/order"
              className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              {t("prod.orderDesk")}
            </Link>
            <a
              href="https://wa.me/213540990219"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-primary/20 bg-white/80 px-5 py-3 text-sm font-semibold text-primary"
            >
              {t("common.whatsapp")}
            </a>
          </div>
        </div>
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.28em] text-muted-foreground">
            {t("contact.responseFlow")}
          </div>
          <div className="mt-5 space-y-3">
            <ContactStep
              title={t("contact.step1")}
              text={t("contact.step1Text")}
            />
            <ContactStep
              title={t("contact.step2")}
              text={t("contact.step2Text")}
            />
            <ContactStep
              title={t("contact.step3")}
              text={t("contact.step3Text")}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <InfoCard
          icon={MessageCircle}
          title={t("common.whatsapp")}
          value="+213 540 99 02 19"
        />
        <InfoCard
          icon={Phone}
          title={t("ct.phone")}
          value="+213 540 99 02 19"
        />
        <InfoCard
          icon={Mail}
          title={t("ct.email")}
          value="hayatseed.dz@gmail.com"
        />
        <InfoCard
          icon={MapPin}
          title={t("ct.location")}
          value={t("ct.locval")}
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-card p-5 shadow-card">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="mt-3 font-bold text-foreground">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{value}</div>
    </div>
  );
}

function ContactStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/60 bg-white/75 p-4">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
