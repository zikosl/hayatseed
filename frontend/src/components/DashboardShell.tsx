import { useI18n } from "@/lib/i18n";

export function DashboardShell({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="surface-card overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="text-xs font-bold tracking-[0.28em] text-primary">
          {kicker}
        </div>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {intro}
            </p>
          </div>
          <div className="surface-subtle rounded-2xl px-4 py-3 text-xs font-medium text-muted-foreground">
            {t("common.workspaceView")}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
