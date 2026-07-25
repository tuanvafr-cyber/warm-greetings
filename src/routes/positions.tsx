import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/positions")({
  head: () => ({
    meta: [
      { title: "Open Positions — SignalOps" },
      { name: "description", content: "Open positions and pending orders across accounts." },
      { property: "og:title", content: "Open Positions — SignalOps" },
      { property: "og:description", content: "Open positions and pending orders across accounts." },
    ],
  }),
  component: () => <RouteStub titleKey="nav.positions" descriptionKey="route.header.positions" />,
});
