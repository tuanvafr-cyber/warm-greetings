import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Order History — SignalOps" },
      { name: "description", content: "Bounded order history for the current scope." },
      { property: "og:title", content: "Order History — SignalOps" },
      { property: "og:description", content: "Bounded order history for the current scope." },
    ],
  }),
  component: () => <RouteStub titleKey="nav.orders" descriptionKey="route.header.orders" />,
});
