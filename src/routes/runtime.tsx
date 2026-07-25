import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/runtime")({
  head: () => ({
    meta: [
      { title: "Runtime — SignalOps" },
      {
        name: "description",
        content: "Runtime components, providers, updates and logs.",
      },
      { property: "og:title", content: "Runtime — SignalOps" },
      {
        property: "og:description",
        content: "Runtime components, providers, updates and logs.",
      },
    ],
  }),
  component: () => <RouteStub titleKey="nav.runtime" descriptionKey="route.header.runtime" />,
});
