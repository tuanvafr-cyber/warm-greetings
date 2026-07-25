import { createFileRoute } from "@tanstack/react-router";
import { RouteStub } from "@/components/shared/RouteStub";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — SignalOps" },
      { name: "description", content: "Manage active and archived SignalOps accounts." },
      { property: "og:title", content: "Accounts — SignalOps" },
      { property: "og:description", content: "Manage active and archived SignalOps accounts." },
    ],
  }),
  component: () => <RouteStub titleKey="nav.accounts" descriptionKey="route.header.accounts" />,
});
