import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { FilterBar } from "@/components/shared/FilterBar";
import { TimeAgo } from "@/components/shared/MoneyText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSignals } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { useTopBar, useLastUpdatedFromQueries } from "@/lib/topbar";
import { controls } from "@/lib/control-registry";
import type { Signal, SignalStatus } from "@/data/contracts";
import { Copy, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/signals")({
  head: () => ({
    meta: [
      { title: "Signals — SignalOps Panel" },
      { name: "description", content: "Signal lifecycle from source to execution." },
      { property: "og:title", content: "Signals — SignalOps Panel" },
      { property: "og:description", content: "Signal lifecycle from source to execution." },
    ],
  }),
  component: SignalsPage,
});

const STATUS_OPTIONS: (SignalStatus | "all")[] = [
  "all",
  "parsed",
  "deduped",
  "risk_blocked",
  "policy_blocked",
  "executed",
  "partial",
  "technical_failed",
];

function statusTone(s: SignalStatus): StatusTone {
  switch (s) {
    case "executed":
      return "healthy";
    case "partial":
      return "input_required";
    case "risk_blocked":
    case "policy_blocked":
      return "blocked";
    case "technical_failed":
      return "degraded";
    case "deduped":
      return "stale";
    default:
      return "input_required";
  }
}

function SignalsPage() {
  const t = useT();
  const q = useSignals();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SignalStatus | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  useTopBar({
    title: t("nav.signals"),
    lastUpdatedIso: useLastUpdatedFromQueries(q),
    showTimeRange: true,
  });

  const filtered = useMemo(() => {
    return (q.data ?? []).filter(
      (s) =>
        (status === "all" || s.status === status) &&
        (!search ||
          s.symbol.toLowerCase().includes(search.toLowerCase()) ||
          s.sourceName.toLowerCase().includes(search.toLowerCase()) ||
          s.correlationId.includes(search)),
    );
  }, [q.data, search, status]);

  const opened = filtered.find((s) => s.id === openId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <FixtureBanner />

      <FilterBar>
        <Input
          data-control-id={controls.signals.search}
          placeholder={t("common.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-1" data-control-id={controls.signals.filterStatus}>
          {STATUS_OPTIONS.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? "default" : "ghost"}
              className="h-7 px-2 text-xs"
              onClick={() => setStatus(s)}
            >
              {s === "all" ? t("common.all") : t(`status.${s}` as never)}
            </Button>
          ))}
        </div>
      </FilterBar>

      {q.isPending ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">{t("col.time")}</th>
                  <th className="px-2 py-2 font-medium">{t("col.source")}</th>
                  <th className="px-2 py-2 font-medium">{t("col.symbol")}</th>
                  <th className="px-2 py-2 font-medium">{t("col.side")}</th>
                  <th className="px-2 py-2 font-medium">{t("col.status")}</th>
                  <th className="px-4 py-2 font-medium">Correlation</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="cursor-pointer border-b border-border/60 last:border-none hover:bg-muted/50"
                    onClick={() => setOpenId(s.id)}
                    data-control-id={controls.signals.openDetail}
                  >
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      <TimeAgo iso={s.receivedAt} />
                    </td>
                    <td className="px-2 py-2 truncate">{s.sourceName}</td>
                    <td className="px-2 py-2 font-medium">{s.symbol}</td>
                    <td className="px-2 py-2 uppercase text-xs">{s.side}</td>
                    <td className="px-2 py-2">
                      <StatusBadge tone={statusTone(s.status)} />
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                      {s.correlationId}
                    </td>
                    <td className="pr-3 text-right">
                      <ExternalLink className="inline h-3.5 w-3.5 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Sheet open={!!opened} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {opened?.symbol} · {opened?.side.toUpperCase()}
            </SheetTitle>
          </SheetHeader>
          {opened ? <SignalDetail s={opened} /> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SignalDetail({ s }: { s: Signal }) {
  const t = useT();
  return (
    <div className="mt-4 space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <StatusBadge tone={statusTone(s.status)} />
        <span className="text-xs text-muted-foreground">
          <TimeAgo iso={s.receivedAt} />
        </span>
      </div>
      <Detail label={t("col.source")} value={s.sourceName} />
      <Detail
        label={t("signals.correlation")}
        value={
          <span className="inline-flex items-center gap-1 font-mono text-xs">
            {s.correlationId}
            <Button
              size="icon"
              variant="ghost"
              data-control-id={controls.signals.copyCorrelation}
              onClick={() => navigator.clipboard?.writeText(s.correlationId)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </span>
        }
      />
      <div>
        <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
          {t("signals.parsed_fields")}
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-md border border-border p-2 text-sm">
          <div>
            Entry: <span className="tabular-nums">{s.parsedEntry ?? "—"}</span>
          </div>
          <div>
            SL: <span className="tabular-nums">{s.parsedSl ?? "—"}</span>
          </div>
          <div>
            TP: <span className="tabular-nums">{s.parsedTp ?? "—"}</span>
          </div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Parser: {s.parserProfile}@{s.parserVersion}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
          {t("signals.original")}
        </div>
        <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-2 text-xs">
          {s.originalText}
        </pre>
      </div>
      {s.reason ? (
        <div>
          <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
            {t("signals.reason")}
          </div>
          <div className="rounded-md border border-border p-2 text-sm">
            <div className="font-mono text-xs text-muted-foreground">{s.reasonCode}</div>
            <div>{s.reason}</div>
          </div>
        </div>
      ) : null}
      <div>
        <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
          {t("signals.destination")}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {s.destinationAccountIds.map((id) => (
            <span key={id} className="rounded-md bg-muted px-2 py-0.5 text-xs">
              {id}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
          {t("signals.related_orders")}
        </div>
        {s.relatedOrderIds.length ? (
          <div className="flex flex-wrap gap-1.5">
            {s.relatedOrderIds.map((id) => (
              <Link
                key={id}
                to="/orders"
                data-control-id={controls.signals.openOrders}
                className="rounded-md border border-border px-2 py-0.5 text-xs hover:bg-muted"
              >
                {id}
              </Link>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
      <div className="flex gap-2 border-t border-border pt-3">
        <Button asChild size="sm" variant="outline" data-control-id={controls.signals.openTrace}>
          <Link to="/trace">Open trace</Link>
        </Button>
        <Button size="sm" variant="ghost" data-control-id={controls.signals.inspectParser}>
          Inspect parser
        </Button>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
