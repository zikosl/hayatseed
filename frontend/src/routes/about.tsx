import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Globe2, Recycle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Hayatseed" },
      {
        name: "description",
        content: "An Algerian eco-tech startup transforming arid lands into green ecosystems.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.32em] text-primary">{t("ab.kicker")}</div>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Algerian eco-tech with a product mindset.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("ab.intro")}
          </p>
        </div>
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.28em] text-muted-foreground">
            POSITIONING
          </div>
          <div className="mt-5 space-y-3">
            <AboutFact
              label="Core focus"
              value="Irrigation, restoration, and green land recovery"
            />
            <AboutFact
              label="Operating style"
              value="Field execution supported by digital workflows"
            />
            <AboutFact
              label="Platform direction"
              value="Visitor, client, and admin operations in one product"
            />
          </div>
        </div>
      </section>

      <div className="rounded-3xl bg-gradient-mission p-6 text-primary-foreground">
        <h3 className="text-lg font-bold">{t("ab.mission")}</h3>
        <p className="mt-2 text-sm opacity-90">{t("ab.missiontxt")}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: FlaskConical, label: t("ab.v1") },
          { icon: Globe2, label: t("ab.v2") },
          { icon: Recycle, label: t("ab.v3") },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="rounded-2xl bg-card p-4 shadow-card text-center">
            <div className="h-10 w-10 mx-auto rounded-full bg-gradient-hero grid place-items-center">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-card">
        <h3 className="font-bold text-foreground">{t("ab.team")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("ab.teamtxt")}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-card">
        <h3 className="font-bold text-foreground">{t("ab.values")}</h3>
        <ul className="mt-2 space-y-1.5">
          {["ab.val1", "ab.val2", "ab.val3", "ab.val4"].map((v) => (
            <li key={v} className="flex items-center gap-2 text-sm text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t(v)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AboutFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/60 bg-white/75 p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
