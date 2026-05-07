import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.32em] text-primary">CONTACT</div>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Reach the Hayatseed team without friction.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            The order desk handles product and service requests. This space stays focused on direct
            contact, office context, and quick routing when someone already knows what they need.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/order"
              className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Open order desk
            </Link>
            <a
              href="https://wa.me/213540990219"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-primary/20 bg-white/80 px-5 py-3 text-sm font-semibold text-primary"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.28em] text-muted-foreground">
            RESPONSE FLOW
          </div>
          <div className="mt-5 space-y-3">
            <ContactStep
              title="1. Order desk"
              text="Use the platform when you need a tracked request and follow-up reference."
            />
            <ContactStep
              title="2. Direct contact"
              text="Use WhatsApp or phone for urgent pre-sales conversations and local coordination."
            />
            <ContactStep
              title="3. Admin handoff"
              text="Submitted requests flow into the admin workspace for status management."
            />
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <InfoCard icon={MessageCircle} title="WhatsApp" value="+213 540 99 02 19" />
        <InfoCard icon={Phone} title="Phone" value="+213 540 99 02 19" />
        <InfoCard icon={Mail} title="Email" value="hayatseed.dz@gmail.com" />
        <InfoCard icon={MapPin} title="Location" value="Staoueli, Algiers - Algeria" />
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
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
