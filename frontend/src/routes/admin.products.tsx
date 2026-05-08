import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Archive,
  Boxes,
  Check,
  Eye,
  PackagePlus,
  Pencil,
  Plus,
  Trash2,
  X,
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
  formatDzd,
} from "@/components/AdminPrimitives";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAppState } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

type ProductForm = Omit<Product, "id">;

const blankProduct: ProductForm = {
  name: "",
  description: "",
  price: 0,
  image: "",
  active: true,
  features: [],
};

function AdminProductsPage() {
  const { products, createProduct, updateProduct, deleteProduct, orders } =
    useAppState();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    products[0]?.id ?? null,
  );
  const [draft, setDraft] = useState<ProductForm>(blankProduct);
  const [featureInput, setFeatureInput] = useState("");
  const selected =
    products.find((product) => product.id === selectedId) ?? null;
  const activeCount = products.filter((product) => product.active).length;
  const productOrders = orders.filter((order) => order.kind === "product");

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = [product.name, product.description]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesVisibility =
          visibility === "all" ||
          (visibility === "active" && product.active) ||
          (visibility === "hidden" && !product.active);
        return matchesQuery && matchesVisibility;
      }),
    [products, query, visibility],
  );

  function beginCreate() {
    setSelectedId(null);
    setDraft(blankProduct);
  }

  function beginEdit(product: Product) {
    setSelectedId(product.id);
    setDraft({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image ?? "",
      active: product.active,
      features: product.features ?? [],
    });
    setFeatureInput("");
  }

  function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.description.trim() || draft.price <= 0) {
      toast.error(t("admin.products.validation"));
      return;
    }
    const payload = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      image: draft.image?.trim() || undefined,
      features: (draft.features ?? [])
        .map((feature) => feature.trim())
        .filter(Boolean)
        .slice(0, 6),
    };
    if (selectedId) {
      updateProduct(selectedId, payload);
      toast.success(t("admin.products.updated"));
      return;
    }
    createProduct(payload);
    setDraft(blankProduct);
    toast.success(t("admin.products.created"));
  }

  function removeProduct(product: Product) {
    const used = orders.some((order) => order.itemId === product.id);
    if (used) {
      toast.error(t("admin.products.archiveUsed"));
      updateProduct(product.id, { active: false });
      return;
    }
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`))
      return;
    deleteProduct(product.id);
    if (selectedId === product.id) beginCreate();
    toast.success(t("admin.products.deleted"));
  }

  function addFeature() {
    const next = featureInput.trim();
    if (!next) return;
    const current = draft.features ?? [];
    if (
      current.some((feature) => feature.toLowerCase() === next.toLowerCase())
    ) {
      toast.error(t("admin.products.duplicateHighlight"));
      return;
    }
    if (current.length >= 6) {
      toast.error(t("admin.products.maxHighlights"));
      return;
    }
    setDraft({ ...draft, features: [...current, next] });
    setFeatureInput("");
  }

  function removeFeature(index: number) {
    setDraft({
      ...draft,
      features: (draft.features ?? []).filter(
        (_, entryIndex) => entryIndex !== index,
      ),
    });
  }

  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        kicker={t("admin.products.kicker")}
        title={t("admin.products.title")}
        intro={t("admin.products.intro")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <AdminStat
            icon={Boxes}
            label={t("admin.products.catalogSize")}
            value={`${products.length}`}
          />
          <AdminStat
            icon={Eye}
            label={t("common.visible")}
            value={`${activeCount}`}
          />
          <AdminStat
            icon={Archive}
            label={t("admin.products.productOrders")}
            value={`${productOrders.length}`}
            detail={t("admin.products.deleteSafety")}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <section className="space-y-4">
            <AdminToolbar
              query={query}
              onQueryChange={setQuery}
              placeholder={t("admin.products.search")}
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
                {t("admin.products.new")}
              </PrimaryButton>
            </AdminToolbar>

            <div className="surface-card overflow-hidden rounded-lg">
              <div className="grid grid-cols-[1.4fr_0.5fr_0.5fr_0.45fr] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground max-lg:hidden">
                <div>{t("admin.products.product")}</div>
                <div>{t("common.price")}</div>
                <div>{t("common.status")}</div>
                <div className="text-right">{t("common.actions")}</div>
              </div>
              <div className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="grid gap-3 px-4 py-4 lg:grid-cols-[1.4fr_0.5fr_0.5fr_0.45fr] lg:items-center"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground">
                        {product.name}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {formatDzd(product.price)}
                    </div>
                    <StatePill active={product.active} />
                    <div className="flex justify-start gap-2 lg:justify-end">
                      <SecondaryButton onClick={() => beginEdit(product)}>
                        <Pencil className="h-4 w-4" />
                        {t("common.edit")}
                      </SecondaryButton>
                      <button
                        onClick={() => {
                          updateProduct(product.id, {
                            active: !product.active,
                          });
                          toast.success(
                            product.active
                              ? t("admin.products.hidden")
                              : t("admin.products.activated"),
                          );
                        }}
                        className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary"
                        aria-label={
                          product.active
                            ? t("admin.products.hidden")
                            : t("admin.products.activated")
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {!filteredProducts.length && (
                  <div className="p-4">
                    <EmptyState
                      title={t("admin.products.noFound")}
                      text={t("admin.products.noFoundText")}
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
                    ? t("admin.products.edit")
                    : t("admin.products.new")}
                </div>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  {selected?.name ?? t("admin.products.create")}
                </h2>
              </div>
              {selected && <StatePill active={selected.active} />}
            </div>

            <form onSubmit={saveProduct} className="mt-5 space-y-4">
              <Field
                label={t("common.name")}
                value={draft.name}
                onChange={(value) => setDraft({ ...draft, name: value })}
                placeholder={t("admin.products.namePlaceholder")}
                required
              />
              <TextAreaField
                label={t("common.description")}
                value={draft.description}
                onChange={(value) => setDraft({ ...draft, description: value })}
                placeholder={t("admin.products.intro")}
              />
              <Field
                label={t("common.price")}
                type="number"
                value={draft.price}
                onChange={(value) =>
                  setDraft({ ...draft, price: Number(value) })
                }
                required
              />
              <Field
                label={t("admin.products.imageUrl")}
                value={draft.image ?? ""}
                onChange={(value) => setDraft({ ...draft, image: value })}
                placeholder={t("admin.products.imagePlaceholder")}
              />
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("admin.products.highlights")}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={featureInput}
                    onChange={(event) => setFeatureInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder={t("admin.products.addHighlight")}
                    className="min-h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground"
                    aria-label={t("admin.products.addHighlightAction")}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(draft.features ?? []).map((feature, index) => (
                    <span
                      key={`${feature}-${index}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="grid h-5 w-5 place-items-center rounded-full hover:bg-primary/10"
                        aria-label={`Remove ${feature}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {!(draft.features ?? []).length && (
                    <span className="text-sm text-muted-foreground">
                      {t("admin.products.emptyHighlights")}
                    </span>
                  )}
                </div>
              </div>
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
                  <PackagePlus className="h-4 w-4" />
                  {selected
                    ? t("common.saveChanges")
                    : t("admin.products.createProduct")}
                </PrimaryButton>
                {selected && (
                  <DangerButton onClick={() => removeProduct(selected)}>
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
