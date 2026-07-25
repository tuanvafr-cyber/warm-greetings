import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SignalOps" },
      {
        name: "description",
        content:
          "SignalOps dashboard: trading P&L, exposure, execution rate, activity heatmap and runtime health.",
      },
      { property: "og:title", content: "Dashboard — SignalOps" },
      {
        property: "og:description",
        content:
          "SignalOps dashboard: trading P&L, exposure, execution rate, activity heatmap and runtime health.",
      },
    ],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  // Phase 1: chrome + not-connected state. Rich cards, carousel and heatmap
  // land in Phase 2 per docs/genesis-pack/11_LOVABLE_FULL_BUILD_ORDER.md.
  return <RouteStub titleKey="dashboard.title" descriptionKey="dashboard.subtitle" />;
}
