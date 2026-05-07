import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Eye,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import {
  AdminSelect,
  AdminStat,
  AdminToolbar,
  DangerButton,
  EmptyState,
  Field,
  PrimaryButton,
  SecondaryButton,
  StatePill,
  TextAreaField,
} from "@/components/AdminPrimitives";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import type { Service } from "@/lib/types";

export const Route = createFileRoute("/admin/services")({
  component: AdminServicesPage,
});

type ServiceForm = Omit<Service, "id">;

const blankService: ServiceForm = {
  name: "",
  description: "",
  image: "",
  active: true,
};

function AdminServicesPage() {
  const { services, createService, updateService, deleteService, orders } =
    useAppState();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    services[0]?.id ?? null,
  );
  const [draft, setDraft] = useState<ServiceForm>(blankService);
  const selected =
    services.find((service) => service.id === selectedId) ?? null;
  const activeCount = services.filter((service) => service.active).length;
  const serviceOrders = orders.filter((order) => order.kind === "service");

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const matchesQuery = [service.name, service.description]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesVisibility =
          visibility === "all" ||
          (visibility === "active" && service.active) ||
          (visibility === "hidden" && !service.active);
        return matchesQuery && matchesVisibility;
      }),
    [query, services, visibility],
  );

  function beginCreate() {
    setSelectedId(null);
    setDraft(blankService);
  }

  function beginEdit(service: Service) {
    setSelectedId(service.id);
    setDraft({
      name: service.name,
      description: service.description,
      image: service.image ?? "",
      active: service.active,
    });
  }

  function saveService(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.description.trim()) {
      toast.error(t("admin.services.validation"));
      return;
    }
    const payload = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      image: draft.image?.trim() || undefined,
    };
    if (selectedId) {
      updateService(selectedId, payload);
      toast.success(t("admin.services.updated"));
      return;
    }
    createService(payload);
    setDraft(blankService);
    toast.success(t("admin.services.created"));
  }

  function removeService(service: Service) {
    const used = orders.some((order) => order.itemId === service.id);
    if (used) {
      toast.error(t("admin.services.archiveUsed"));
      updateService(service.id, { active: false });
      return;
    }
    if (!window.confirm(`Delete ${service.name}? This cannot be undone.`))
      return;
    deleteService(service.id);
    if (selectedId === service.id) beginCreate();
    toast.success(t("admin.services.deleted"));
  }

  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        kicker={t("admin.services.kicker")}
        title={t("admin.services.title")}
        intro={t("admin.services.intro")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <AdminStat
            icon={BriefcaseBusiness}
            label={t("admin.services.title")}
            value={`${services.length}`}
          />
          <AdminStat
            icon={Eye}
            label={t("common.visible")}
            value={`${activeCount}`}
          />
          <AdminStat
            icon={Sparkles}
            label={t("admin.services.serviceOrders")}
            value={`${serviceOrders.length}`}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <section className="space-y-4">
            <AdminToolbar
              query={query}
              onQueryChange={setQuery}
              placeholder={t("admin.services.search")}
            >
              <AdminSelect
                label={t("common.status")}
                value={visibility}
                onChange={setVisibility}
              >
                <option value="all">{t("common.all")}</option>
                <option value="active">{t("common.active")}</option>
                <option value="hidden">{t("common.hidden")}</option>
              </AdminSelect>
              <PrimaryButton onClick={beginCreate}>
                <Plus className="h-4 w-4" />
                {t("admin.services.new")}
              </PrimaryButton>
            </AdminToolbar>

            <div className="surface-card overflow-hidden rounded-lg">
              <div className="grid grid-cols-[1.5fr_0.5fr_0.45fr] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground max-lg:hidden">
                <div>{t("admin.services.service")}</div>
                <div>{t("common.status")}</div>
                <div className="text-right">{t("common.actions")}</div>
              </div>
              <div className="divide-y divide-border">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="grid gap-3 px-4 py-4 lg:grid-cols-[1.5fr_0.5fr_0.45fr] lg:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        {service.image && (
                          <img
                            src={service.image}
                            alt=""
                            className="h-12 w-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground">
                            {service.name}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <StatePill active={service.active} />
                    <div className="flex justify-start gap-2 lg:justify-end">
                      <SecondaryButton onClick={() => beginEdit(service)}>
                        <Pencil className="h-4 w-4" />
                        {t("common.edit")}
                      </SecondaryButton>
                      <button
                        onClick={() => {
                          updateService(service.id, {
                            active: !service.active,
                          });
                          toast.success(
                            service.active
                              ? t("admin.services.hidden")
                              : t("admin.services.activated"),
                          );
                        }}
                        className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card hover:bg-secondary"
                        aria-label={
                          service.active
                            ? t("admin.services.hidden")
                            : t("admin.services.activated")
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {!filteredServices.length && (
                  <div className="p-4">
                    <EmptyState
                      title={t("admin.services.noFound")}
                      text={t("admin.services.noFoundText")}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="surface-card rounded-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {selected
                    ? t("admin.services.edit")
                    : t("admin.services.new")}
                </div>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {selected?.name ?? t("admin.services.create")}
                </h2>
              </div>
              {selected && <StatePill active={selected.active} />}
            </div>
            <form onSubmit={saveService} className="mt-5 space-y-4">
              <Field
                label={t("common.name")}
                value={draft.name}
                onChange={(value) => setDraft({ ...draft, name: value })}
                placeholder="Hydroseeding"
                required
              />
              <TextAreaField
                label={t("common.description")}
                value={draft.description}
                onChange={(value) => setDraft({ ...draft, description: value })}
                placeholder={t("admin.services.intro")}
                rows={5}
              />
              <Field
                label={t("admin.services.imageUrl")}
                value={draft.image ?? ""}
                onChange={(value) => setDraft({ ...draft, image: value })}
                placeholder={t("admin.services.imagePlaceholder")}
              />
              {draft.image && (
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <img
                    src={draft.image}
                    alt=""
                    className="h-36 w-full object-cover"
                  />
                </div>
              )}
              <label className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-3">
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    {t("common.visible")}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {t("admin.products.ordering")}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(event) =>
                    setDraft({ ...draft, active: event.target.checked })
                  }
                  className="h-5 w-5 accent-primary"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <PrimaryButton type="submit">
                  <Wrench className="h-4 w-4" />
                  {selected
                    ? t("common.saveChanges")
                    : t("admin.services.createService")}
                </PrimaryButton>
                {selected && (
                  <DangerButton onClick={() => removeService(selected)}>
                    <Trash2 className="h-4 w-4" />
                    {t("common.delete")}
                  </DangerButton>
                )}
              </div>
            </form>
          </section>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}
