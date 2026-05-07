import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { OrderForm } from "@/components/OrderForm";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/order")({
  component: OrderPage,
});

function OrderPage() {
  const { t } = useI18n();
  return (
    <DashboardShell
      kicker={t("order.kicker")}
      title={t("order.title")}
      intro={t("order.intro")}
    >
      <OrderForm />
    </DashboardShell>
  );
}
