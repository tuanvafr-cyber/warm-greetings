import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar } from "@/lib/topbar";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { TimeAgo } from "@/components/shared/MoneyText";
import { BackendRequiredDialog } from "@/components/shared/BackendRequiredDialog";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useInboxItems } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import type { InboxItem, InboxSeverity } from "@/data/contracts";
import { Copy, Download } from "lucide-react";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Processing Inbox — SignalOps Panel" },
      { name: "description", content: "Inputs, blockers and reconciliations to process." },
      { property: "og:title", content: "Processing Inbox — SignalOps Panel" },
      { property: "og:description", content: "Inputs, blockers and reconciliations to process." },
    ],
  }),
  component: InboxPage,
});

function severityTone(s: InboxSeverity): StatusTone {
  return s === "critical" ? "blocked" : s === "blocker" ? "blocked" : s === "warning" ? "degraded" : "input_required";
}

function InboxPage() {
  const t = useT();
  const q = useInboxItems();
  const [severity, setSeverity] = useState<InboxSeverity | "all">("all");
  const [component, setComponent] = useState<string>("all");
  const [state, setState] = useState<"all" | "open" | "acknowledged">("all");
  const [opened, setOpened] = useState<InboxItem | null>(null);

  const components = Array.from(new Set((q.data ?? []).map((i) => i.component)));
  const filtered = useMemo(() => (q.data ?? []).filter((i) =>
    (severity === "all" || i.severity === severity) &&
    (component === "all" || i.component === component) &&
    (state === "all" || i.state === state)
  ), [q.data, severity, component, state]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("nav.inbox")} description={t("route.header.inbox")} />
      <FixtureBanner />

      <FilterBar>
        <select className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          value={severity} onChange={(e) => setSeverity(e.target.value as never)}
          data-control-id={controls.inbox.filterSeverity}>
          <option value="all">All severities</option>
          <option value="info">Info</option><option value="warning">Warning</option>
          <option value="blocker">Blocker</option><option value="critical">Critical</option>
        </select>
        <select className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          value={component} onChange={(e) => setComponent(e.target.value)}
          data-control-id={controls.inbox.filterComponent}>
          <option value="all">All components</option>
          {components.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          value={state} onChange={(e) => setState(e.target.value as never)}
          data-control-id={controls.inbox.filterState}>
          <option value="all">All states</option><option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
        </select>
      </FilterBar>

      {q.isPending ? <LoadingState /> : filtered.length === 0 ? <EmptyState /> : (
        <div className="flex flex-col gap-2">
          {filtered.map((i) => (
            <Card key={i.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setOpened(i)}
                  data-control-id={controls.inbox.openDetail}>
              <CardContent className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={severityTone(i.severity)} />
                    <span className="text-xs text-muted-foreground">{i.component}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <TimeAgo iso={i.createdAt} />
                  </div>
                  <div className="mt-1 truncate font-medium">{i.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{i.detail}</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs text-muted-foreground">{i.correlationId}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!opened} onOpenChange={(v) => !v && setOpened(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>{opened?.title}</SheetTitle></SheetHeader>
          {opened ? (
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <StatusBadge tone={severityTone(opened.severity)} />
                <span className="text-xs text-muted-foreground">{opened.component}</span>
              </div>
              <p>{opened.detail}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{opened.correlationId}</span>
                <Button size="icon" variant="ghost" data-control-id={controls.inbox.copyCorrelation}
                  onClick={() => navigator.clipboard?.writeText(opened.correlationId)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                <BackendRequiredDialog
                  controlId={controls.inbox.provideInput}
                  trigger={<Button size="sm">{t("inbox.provide_input")}</Button>}
                  title={t("inbox.provide_input")} payloadPreview={{ intent: "inbox.provide_input", id: opened.id }}
                />
                <BackendRequiredDialog
                  controlId={controls.inbox.recheck}
                  trigger={<Button size="sm" variant="outline">{t("inbox.recheck")}</Button>}
                  title={t("inbox.recheck")} payloadPreview={{ intent: "inbox.recheck", id: opened.id }}
                />
                <Button size="sm" variant="ghost" data-control-id={controls.inbox.exportEvidence} className="gap-1">
                  <Download className="h-3.5 w-3.5" />{t("inbox.export_evidence")}
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
