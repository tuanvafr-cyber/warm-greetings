import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Risk Management — SignalOps" },
      { name: "description", content: "Risk policy and effective risk across accounts." },
      { property: "og:title", content: "Risk Management — SignalOps" },
      { property: "og:description", content: "Risk policy and effective risk across accounts." },
    ],
  }),
  component: () => <RouteStub titleKey="nav.risk" descriptionKey="route.header.risk" />,
});
