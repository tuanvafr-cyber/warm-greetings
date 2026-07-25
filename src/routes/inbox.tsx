import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Processing Inbox — SignalOps" },
      { name: "description", content: "Inputs, blockers and reconciliations to process." },
      { property: "og:title", content: "Processing Inbox — SignalOps" },
      { property: "og:description", content: "Inputs, blockers and reconciliations to process." },
    ],
  }),
  component: () => <RouteStub titleKey="nav.inbox" descriptionKey="route.header.inbox" />,
});
