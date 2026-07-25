import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/trace")({
  head: () => ({
    meta: [
      { title: "Trace — SignalOps" },
      { name: "description", content: "Immutable lifecycle trace across the pipeline." },
      { property: "og:title", content: "Trace — SignalOps" },
      { property: "og:description", content: "Immutable lifecycle trace across the pipeline." },
    ],
  }),
  component: () => <RouteStub titleKey="nav.trace" descriptionKey="route.header.trace" />,
});
