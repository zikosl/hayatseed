import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  MessageCircle,
  PackageSearch,
  Search,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { formatDzd } from "@/components/AdminPrimitives";
import { useAppState } from "@/lib/app-state";
import { useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Hayatseed" },
      {
        name: "description",
        content:
          "Premium grass seed, hydroseeding mulch and biofertilizer made in Algeria.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { products } = useAppState();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const activeProducts = products.filter((product) => product.active);

  const filteredProducts = useMemo(() => {
    const next = activeProducts.filter((product) =>
      [product.name, product.description]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
    return [...next].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [activeProducts, query, sort]);

  const averagePrice =
    activeProducts.reduce((sum, product) => sum + product.price, 0) /
    Math.max(activeProducts.length, 1);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.32em] text-primary">
            {t("prod.kicker")}
          </div>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {t("prod.heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("prod.intro")} {t("prod.heroIntro")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/order"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              {t("prod.orderDesk")}
            </Link>
          </div>
        </div>
        <div className="surface-card rounded-[2rem] p-7">
          <div className="text-xs font-bold tracking-[0.28em] text-muted-foreground">
            {t("prod.snapshot")}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <CatalogStat
              label={t("prod.visible")}
              value={`${activeProducts.length}`}
            />
            <CatalogStat
              label={t("prod.average")}
              value={formatDzd(Math.round(averagePrice))}
            />
            <CatalogStat label={t("prod.managedIn")} value={t("prod.admin")} />
          </div>
          <div className="mt-5 rounded-[1.2rem] border border-border bg-card p-5">
            <div className="text-sm font-semibold text-foreground">
              {t("prod.buyingFlow")}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("prod.buyingFlowText")}
            </p>
          </div>
        </div>
      </section>

      <section className="surface-card rounded-[1.4rem] p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-center">
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("prod.searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <label className="flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-4">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("common.sort")}
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="bg-transparent text-sm font-semibold outline-none"
            >
              <option value="featured">{t("prod.sort.name")}</option>
              <option value="price-low">{t("prod.sort.priceLow")}</option>
              <option value="price-high">{t("prod.sort.priceHigh")}</option>
            </select>
          </label>
        </div>
      </section>

      <div>
        <div>
          <div className="text-xs font-bold tracking-[0.28em] text-primary">
            {t("prod.catalog")}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            {filteredProducts.length === 1
              ? t("prod.readyOne")
              : t("prod.readyMany", { count: filteredProducts.length })}
          </h2>
        </div>
      </div>

      {filteredProducts.length ? (
        <div className="grid gap-5 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="surface-card rounded-[1.4rem] p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-secondary">
            <PackageSearch className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            {t("prod.noMatch")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("prod.noMatchText")}
          </p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  const orderByWhatsapp = () => {
    const text = encodeURIComponent(
      `Hello Hayatseed, I'd like to order: ${product.name}`,
    );
    window.open(`https://wa.me/213540990219?text=${text}`, "_blank");
  };

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-card-active">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/86 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          {formatDzd(product.price)}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug text-foreground">
            {product.name}
          </h3>
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            {t("common.available")}
          </span>
        </div>
        <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>
        {!!product.features?.length && (
          <div className="mt-4 grid gap-2">
            {product.features.slice(0, 4).map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-lg bg-secondary/65 px-3 py-2 text-sm font-medium text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span className="min-w-0 truncate">{feature}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Link
            to="/order"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t("prod.platformOrder")}
          </Link>
          <button
            onClick={orderByWhatsapp}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-card px-4 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            <MessageCircle className="h-4 w-4" />
            {t("common.whatsapp")}
          </button>
        </div>
      </div>
    </article>
  );
}

function CatalogStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-border bg-card p-4">
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
