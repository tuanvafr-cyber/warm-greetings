import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Signal Sources — SignalOps" },
      {
        name: "description",
        content: "Manage signal sources — Active, Performance, Archive.",
      },
      { property: "og:title", content: "Signal Sources — SignalOps" },
      {
        property: "og:description",
        content: "Manage signal sources — Active, Performance, Archive.",
      },
    ],
  }),
  component: () => <RouteStub titleKey="nav.sources" descriptionKey="route.header.sources" />,
});
