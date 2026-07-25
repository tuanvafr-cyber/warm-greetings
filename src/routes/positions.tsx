import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar, useLastUpdatedFromQueries } from "@/lib/topbar";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MoneyUsd, NativeAmount, Sensitive, TimeAgo } from "@/components/shared/MoneyText";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Download } from "lucide-react";
import { usePositions, useAccounts } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";

export const Route = createFileRoute("/positions")({
  head: () => ({
    meta: [
      { title: "Open Positions — SignalOps Panel" },
      { name: "description", content: "Open positions and pending orders across accounts." },
      { property: "og:title", content: "Open Positions — SignalOps Panel" },
      { property: "og:description", content: "Open positions and pending orders across accounts." },
    ],
  }),
  component: PositionsPage,
});

function PositionsPage() {
  const t = useT();
  useTopBar({ title: t("nav.positions"), lastUpdatedIso: useLastUpdatedFromQueries(q, accountsQ) });
  const q = usePositions();
  const accountsQ = useAccounts();
  const [side, setSide] = useState<"all" | "buy" | "sell">("all");
  const [account, setAccount] = useState<string>("all");
  const [symbol, setSymbol] = useState<string>("all");

  const symbols = Array.from(new Set((q.data ?? []).map((p) => p.symbol)));

  const filtered = useMemo(
    () =>
      (q.data ?? []).filter(
        (p) =>
          (side === "all" || p.side === side) &&
          (account === "all" || p.accountId === account) &&
          (symbol === "all" || p.symbol === symbol),
      ),
    [q.data, side, account, symbol],
  );

  const open = filtered.filter((p) => p.status === "open");
  const pending = filtered.filter((p) => p.status === "pending");

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("nav.positions")}
        description={t("route.header.positions")}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              data-control-id={controls.positions.refresh}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t("common.refresh")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-control-id={controls.positions.export}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {t("common.export")}
            </Button>
          </>
        }
      />
      <FixtureBanner />

      <FilterBar>
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          data-control-id={controls.positions.filterAccount}
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        >
          <option value="all">All accounts</option>
          {(accountsQ.data ?? []).map((a) => (
            <option key={a.id} value={a.id}>
              {a.displayName}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          data-control-id={controls.positions.filterSymbol}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option value="all">All symbols</option>
          {symbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="flex gap-1" data-control-id={controls.positions.filterSide}>
          {(["all", "buy", "sell"] as const).map((v) => (
            <Button
              key={v}
              size="sm"
              variant={side === v ? "default" : "ghost"}
              className="h-7 px-2 text-xs uppercase"
              onClick={() => setSide(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      </FilterBar>

      <section>
        <h2 className="mb-2 text-sm font-semibold">{t("nav.positions")}</h2>
        {q.isPending ? (
          <LoadingState />
        ) : open.length === 0 ? (
          <EmptyState />
        ) : (
          <PosTable rows={open} />
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">{t("positions.pending")}</h2>
        {q.isPending ? (
          <LoadingState />
        ) : pending.length === 0 ? (
          <EmptyState />
        ) : (
          <PosTable rows={pending} />
        )}
      </section>
    </div>
  );
}

function PosTable({ rows }: { rows: import("@/data/contracts").Position[] }) {
  const t = useT();
  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2">{t("col.account")}</th>
              <th className="px-2 py-2">{t("col.symbol")}</th>
              <th className="px-2 py-2">{t("col.side")}</th>
              <th className="px-2 py-2 text-right">{t("positions.entry")}</th>
              <th className="px-2 py-2 text-right">{t("positions.current")}</th>
              <th className="px-2 py-2 text-right">SL / TP</th>
              <th className="px-2 py-2 text-right">{t("positions.native_volume")}</th>
              <th className="px-2 py-2 text-right">{t("col.pips")}</th>
              <th className="px-2 py-2 text-right">{t("positions.floating_pnl")}</th>
              <th className="px-2 py-2">{t("col.ticket")}</th>
              <th className="px-4 py-2">Corr.</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-none">
                <td className="px-4 py-2 truncate">{p.accountLabel}</td>
                <td className="px-2 py-2 font-medium">{p.symbol}</td>
                <td className="px-2 py-2 uppercase text-xs">{p.side}</td>
                <td className="px-2 py-2 text-right tabular-nums">{p.entryPrice.toFixed(3)}</td>
                <td className="px-2 py-2 text-right tabular-nums">{p.currentPrice.toFixed(3)}</td>
                <td className="px-2 py-2 text-right tabular-nums">
                  {p.sl?.toFixed(2)} / {p.tp?.toFixed(2)}
                </td>
                <td className="px-2 py-2 text-right">
                  <NativeAmount
                    amount={p.nativeVolume}
                    currency={p.accountLabel.includes("USC") ? "USC" : "USD"}
                  />
                </td>
                <td className="px-2 py-2 text-right tabular-nums">{p.pips}</td>
                <td className="px-2 py-2 text-right">
                  <MoneyUsd value={p.floatingPnlUsd} colorize />
                </td>
                <td className="px-2 py-2">
                  <Sensitive value={p.ticket} />
                </td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  {p.correlationId}
                </td>
                <td className="pr-3">
                  <div className="flex gap-1">
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      data-control-id={controls.positions.openSignal}
                    >
                      <Link to="/signals">S</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      data-control-id={controls.positions.openTrace}
                    >
                      <Link to="/trace">T</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border p-2 text-right">
          <StatusBadge tone="not_connected" />
          <span className="ml-2 text-xs text-muted-foreground">
            Close-actions require SignalOps backend.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
