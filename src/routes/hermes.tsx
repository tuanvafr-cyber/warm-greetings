import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/hermes")({
  head: () => ({
    meta: [
      { title: "Hermes — SignalOps" },
      { name: "description", content: "Hermes: intelligence, learning and recommendations." },
      { property: "og:title", content: "Hermes — SignalOps" },
      { property: "og:description", content: "Hermes: intelligence, learning and recommendations." },
    ],
  }),
  component: () => <RouteStub titleKey="nav.hermes" descriptionKey="route.header.hermes" />,
});
