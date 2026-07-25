import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar, useLastUpdatedFromQueries } from "@/lib/topbar";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { TimeAgo } from "@/components/shared/MoneyText";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTraces } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import type { TraceRecord, TraceStep } from "@/data/contracts";
import { Copy, Download } from "lucide-react";

export const Route = createFileRoute("/trace")({
  head: () => ({
    meta: [
      { title: "Trace — SignalOps Panel" },
      { name: "description", content: "Immutable lifecycle trace across the SignalOps pipeline." },
      { property: "og:title", content: "Trace — SignalOps Panel" },
      {
        property: "og:description",
        content: "Immutable lifecycle trace across the SignalOps pipeline.",
      },
    ],
  }),
  component: TracePage,
});

function stepTone(s: TraceStep): StatusTone {
  return s.outcome === "ok"
    ? "healthy"
    : s.outcome === "blocked"
      ? "blocked"
      : s.outcome === "error"
        ? "degraded"
        : "input_required";
}

function TracePage() {
  const t = useT();
  useTopBar({ title: t("nav.trace"), lastUpdatedIso: useLastUpdatedFromQueries(q) });
  const q = useTraces();
  const [txt, setTxt] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      (q.data ?? []).filter(
        (tr) =>
          !txt ||
          tr.correlationId.includes(txt) ||
          tr.signalId?.includes(txt) ||
          tr.orderId?.includes(txt),
      ),
    [q.data, txt],
  );

  const opened = filtered.find((tr) => tr.correlationId === selected) ?? filtered[0] ?? null;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("nav.trace")}
        description={t("route.header.trace")}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              data-control-id={controls.trace.exportJson}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              JSON
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-control-id={controls.trace.exportCsv}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </Button>
          </>
        }
      />
      <FixtureBanner />

      <FilterBar>
        <Input
          data-control-id={controls.trace.search}
          placeholder="Search correlation / signal / order"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          className="max-w-md"
        />
      </FilterBar>

      {q.isPending ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <Card>
            <CardContent className="p-2">
              <ul className="space-y-1">
                {filtered.map((tr) => (
                  <li key={tr.correlationId}>
                    <button
                      type="button"
                      onClick={() => setSelected(tr.correlationId)}
                      className={`w-full rounded-md px-2 py-1.5 text-left text-xs ${opened?.correlationId === tr.correlationId ? "bg-muted" : "hover:bg-muted/60"}`}
                    >
                      <div className="font-mono">{tr.correlationId}</div>
                      <div className="text-[10px] text-muted-foreground">
                        <TimeAgo iso={tr.createdAt} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {opened ? <Timeline tr={opened} /> : null}
        </div>
      )}
    </div>
  );
}

function Timeline({ tr }: { tr: TraceRecord }) {
  const t = useT();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="font-mono">{tr.correlationId}</span>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              data-control-id={controls.trace.copyId}
              onClick={() => navigator.clipboard?.writeText(tr.correlationId)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            {tr.signalId ? (
              <Button asChild size="sm" variant="ghost" data-control-id={controls.trace.openSignal}>
                <Link to="/signals">Signal</Link>
              </Button>
            ) : null}
            {tr.orderId ? (
              <Button asChild size="sm" variant="ghost" data-control-id={controls.trace.openOrder}>
                <Link to="/orders">Order</Link>
              </Button>
            ) : null}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative ml-3 space-y-4 border-l border-border pl-4">
          {tr.steps.map((s, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-6 top-1 grid h-3 w-3 place-items-center rounded-full border-2 border-background bg-primary" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{t(`trace.step.${s.step}` as never)}</span>
                <StatusBadge tone={stepTone(s)} />
                <span className="text-xs text-muted-foreground">{s.component}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  <TimeAgo iso={s.at} />
                </span>
              </div>
              <p className="mt-0.5 text-sm">{s.detail}</p>
              {Object.keys(s.payloadRedacted).length ? (
                <details className="mt-1">
                  <summary className="cursor-pointer text-xs text-muted-foreground">
                    {t("trace.payload_redacted")}
                  </summary>
                  <pre className="mt-1 max-h-32 overflow-auto rounded-md border border-border bg-muted/40 p-2 text-[11px]">
                    {JSON.stringify(s.payloadRedacted, null, 2)}
                  </pre>
                </details>
              ) : null}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
