import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAppState } from "@/lib/app-state";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import type { OrderChannel, OrderKind } from "@/lib/types";

export function OrderForm() {
  const { user } = useAuth();
  const { createOrder, products, services } = useAppState();
  const { t } = useI18n();
  const [result, setResult] = useState<null | {
    orderNumber: string;
    accessCode: string;
  }>(null);
  const [form, setForm] = useState({
    customerName: user?.name ?? "",
    customerEmail: user?.email ?? "",
    customerPhone: user?.phone ?? "",
    location: "",
    kind: "service" as OrderKind,
    itemId: services[0]?.id ?? "",
    message: "",
    preferredContact: "whatsapp" as "whatsapp" | "phone" | "email",
    channel: "platform" as OrderChannel,
  });

  const catalog =
    form.kind === "product"
      ? products.filter((item) => item.active)
      : services.filter((item) => item.active);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const order = createOrder({
      ...form,
      userId: user?.id,
    });
    setResult({ orderNumber: order.orderNumber, accessCode: order.accessCode });
    if (form.channel === "whatsapp" || form.channel === "platform") {
      const text = encodeURIComponent(
        `Hello Hayatseed,%0AOrder: ${order.orderNumber}%0AType: ${form.kind}%0AItem: ${order.itemLabel}%0ALocation: ${form.location}%0A${form.message}`,
      );
      if (form.channel === "whatsapp") {
        window.open(`https://wa.me/213540990219?text=${text}`, "_blank");
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={submit}
          className="surface-card rounded-[1.9rem] p-5 sm:p-6"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold tracking-[0.24em] text-primary">
                {t("order.form")}
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                {t("order.formTitle")}
              </h2>
            </div>
            <div className="surface-subtle rounded-2xl px-4 py-3 text-xs font-medium text-muted-foreground">
              {t("order.handoff")}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("order.fullName")}>
              <input
                required
                value={form.customerName}
                onChange={(event) =>
                  setForm({ ...form, customerName: event.target.value })
                }
                className="input"
              />
            </Field>
            <Field label={t("order.phone")}>
              <input
                required
                value={form.customerPhone}
                onChange={(event) =>
                  setForm({ ...form, customerPhone: event.target.value })
                }
                className="input"
              />
            </Field>
            <Field label={t("auth.email")}>
              <input
                value={form.customerEmail}
                onChange={(event) =>
                  setForm({ ...form, customerEmail: event.target.value })
                }
                className="input"
              />
            </Field>
            <Field label={t("order.location")}>
              <input
                required
                value={form.location}
                onChange={(event) =>
                  setForm({ ...form, location: event.target.value })
                }
                className="input"
              />
            </Field>
            <Field label={t("order.type")}>
              <select
                value={form.kind}
                onChange={(event) => {
                  const kind = event.target.value as OrderKind;
                  const nextCatalog =
                    kind === "product"
                      ? products.filter((item) => item.active)
                      : services.filter((item) => item.active);
                  setForm({ ...form, kind, itemId: nextCatalog[0]?.id ?? "" });
                }}
                className="input"
              >
                <option value="service">{t("order.service")}</option>
                <option value="product">{t("order.product")}</option>
              </select>
            </Field>
            <Field
              label={
                form.kind === "product"
                  ? t("order.product")
                  : t("order.service")
              }
            >
              <select
                value={form.itemId}
                onChange={(event) =>
                  setForm({ ...form, itemId: event.target.value })
                }
                className="input"
              >
                {catalog.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("order.preferredContact")}>
              <select
                value={form.preferredContact}
                onChange={(event) =>
                  setForm({
                    ...form,
                    preferredContact: event.target.value as
                      | "whatsapp"
                      | "phone"
                      | "email",
                  })
                }
                className="input"
              >
                <option value="whatsapp">{t("common.whatsapp")}</option>
                <option value="phone">{t("ct.phone")}</option>
                <option value="email">{t("ct.email")}</option>
              </select>
            </Field>
            <Field label={t("order.sendVia")}>
              <select
                value={form.channel}
                onChange={(event) =>
                  setForm({
                    ...form,
                    channel: event.target.value as OrderChannel,
                  })
                }
                className="input"
              >
                <option value="platform">{t("order.adminPlatform")}</option>
                <option value="whatsapp">{t("common.whatsapp")}</option>
              </select>
            </Field>
          </div>
          <Field label={t("order.details")}>
            <textarea
              rows={5}
              value={form.message}
              onChange={(event) =>
                setForm({ ...form, message: event.target.value })
              }
              className="input resize-none"
            />
          </Field>
          <button
            type="submit"
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            {t("order.submit")}
          </button>
        </form>

        <div className="space-y-4">
          <div className="surface-card rounded-[1.9rem] p-6">
            <div className="text-xs font-bold tracking-[0.24em] text-primary">
              {t("order.flow")}
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">
              {t("order.clean")}
            </h3>
            <div className="mt-5 space-y-3">
              <SideNote
                step="01"
                title={t("order.step1")}
                text={t("order.step1Text")}
              />
              <SideNote
                step="02"
                title={t("order.step2")}
                text={t("order.step2Text")}
              />
              <SideNote
                step="03"
                title={t("order.step3")}
                text={t("order.step3Text")}
              />
            </div>
          </div>

          {result && (
            <div className="rounded-[1.9rem] bg-gradient-mission p-6 text-primary-foreground shadow-soft">
              <div className="text-sm font-semibold">{t("order.created")}</div>
              <div className="mt-2 text-2xl font-bold">
                {result.orderNumber}
              </div>
              <div className="mt-1 text-sm opacity-90">
                {t("order.accessCode")}: {result.accessCode}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.95rem;
          border: 1px solid color-mix(in oklab, var(--border) 86%, white 14%);
          background: color-mix(in oklab, var(--card) 88%, var(--secondary) 12%);
          padding: 0.85rem 1rem;
          color: var(--foreground);
          box-shadow: inset 0 1px 0 color-mix(in oklab, white 80%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-sm font-medium text-foreground">{label}</div>
      {children}
    </label>
  );
}

function SideNote({
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
      <div className="text-[11px] font-bold tracking-[0.24em] text-primary">
        {step}
      </div>
      <div className="mt-2 font-semibold text-foreground">{title}</div>
      <p className="mt-1 text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
