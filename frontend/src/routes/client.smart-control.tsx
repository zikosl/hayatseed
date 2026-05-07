import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/RoleGate";
import { SmartControlPanel } from "@/components/SmartControlPanel";

export const Route = createFileRoute("/client/smart-control")({
  component: ClientSmartControlPage,
});

function ClientSmartControlPage() {
  return (
    <RoleGate allow={["client", "admin"]}>
      <SmartControlPanel />
    </RoleGate>
  );
}
