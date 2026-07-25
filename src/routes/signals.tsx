import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/signals")({
  head: () => ({
    meta: [
      { title: "Signals — SignalOps" },
      { name: "description", content: "Signal lifecycle from source to execution." },
      { property: "og:title", content: "Signals — SignalOps" },
      { property: "og:description", content: "Signal lifecycle from source to execution." },
    ],
  }),
  component: () => <RouteStub titleKey="nav.signals" descriptionKey="route.header.signals" />,
});
