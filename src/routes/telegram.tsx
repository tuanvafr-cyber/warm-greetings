import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/telegram")({
  head: () => ({
    meta: [
      { title: "Telegram — SignalOps" },
      { name: "description", content: "Telegram session and authentication for SignalOps." },
      { property: "og:title", content: "Telegram — SignalOps" },
      { property: "og:description", content: "Telegram session and authentication for SignalOps." },
    ],
  }),
  component: () => <RouteStub titleKey="nav.telegram" descriptionKey="route.header.telegram" />,
});
