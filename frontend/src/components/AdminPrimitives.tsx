import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock3,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { OrderStatus } from "@/lib/types";

export const statusLabels: Record<OrderStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  approved: "Approved",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<OrderStatus, string> = {
  new: "bg-teal/12 text-teal border-teal/20",
  contacted: "bg-accent text-accent-foreground border-accent",
  quoted: "bg-primary/10 text-primary border-primary/20",
  approved: "bg-success/12 text-success border-success/20",
  in_progress: "bg-secondary text-secondary-foreground border-secondary",
  completed: "bg-success text-success-foreground border-success",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusIcons = {
  new: Circle,
  contacted: Clock3,
  quoted: SlidersHorizontal,
  approved: CheckCircle2,
  in_progress: Clock3,
  completed: CheckCircle2,
  cancelled: XCircle,
} satisfies Record<OrderStatus, React.ComponentType<{ className?: string }>>;

export function AdminStat({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="surface-card rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold text-foreground">
            {value}
          </div>
          {detail && (
            <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
          )}
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary">
          <Icon className="h-5 w-5 text-primary" />
        </span>
      </div>
    </div>
  );
}

export function AdminToolbar({
  query,
  onQueryChange,
  children,
  placeholder,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  children?: React.ReactNode;
  placeholder?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="surface-card rounded-lg p-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-center">
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={placeholder ?? t("common.search")}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        {children && (
          <div className="flex flex-wrap items-center gap-2">{children}</div>
        )}
      </div>
    </div>
  );
}

export function AdminSelect({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-sm font-medium outline-none"
      >
        {children}
      </select>
    </label>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useI18n();
  const Icon = statusIcons[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {t(`status.${status}`)}
    </span>
  );
}

export function StatePill({
  active,
  trueLabel,
  falseLabel,
}: {
  active: boolean;
  trueLabel?: string;
  falseLabel?: string;
}) {
  const { t } = useI18n();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        active
          ? "border-success/20 bg-success/10 text-success"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      {active
        ? (trueLabel ?? t("common.active"))
        : (falseLabel ?? t("common.hidden"))}
    </span>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="surface-card rounded-lg p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-secondary">
        <AlertTriangle className="h-5 w-5 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {text}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 rounded-lg border border-border bg-card px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

export function PrimaryButton({
  children,
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-destructive px-3.5 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90"
    >
      {children}
    </button>
  );
}

export function formatDzd(value: number) {
  return new Intl.NumberFormat("en-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
