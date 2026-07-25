import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { MoneyUsd, Sensitive } from "@/components/shared/MoneyText";
import { FilterBar } from "@/components/shared/FilterBar";
import { TimeRangePicker } from "@/components/shared/TimeRangePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useAccounts, useOrders } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { useTopBar } from "@/lib/topbar";
import { controls } from "@/lib/control-registry";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import type { Order, OrderResult } from "@/data/contracts";

const searchSchema = z.object({
  d: fallback(z.string(), "").default(""),
  h: fallback(z.number().int(), -1).default(-1),
});

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Order History — SignalOps Panel" },
      { name: "description", content: "Bounded order history with filters and CSV/JSON export." },
      { property: "og:title", content: "Order History — SignalOps Panel" },
      {
        property: "og:description",
        content: "Bounded order history with filters and CSV/JSON export.",
      },
    ],
  }),
  validateSearch: zodValidator(searchSchema),
  component: OrdersPage,
});

function resultTone(r: OrderResult): StatusTone {
  return r === "win"
    ? "healthy"
    : r === "loss"
      ? "blocked"
      : r === "pending"
        ? "input_required"
        : "stale";
}

function OrdersPage() {
  const t = useT();
  const search = Route.useSearch();
  const q = useOrders();
  const accountsQ = useAccounts();
  // time range persists via URL through <TimeRangePicker />.
  const [account, setAccount] = useState("all");
  const [symbol, setSymbol] = useState("all");
  const [side, setSide] = useState<"all" | "buy" | "sell">("all");
  const [result, setResult] = useState<"all" | OrderResult>("all");
  const [txt, setTxt] = useState("");
  const [pageSize, setPageSize] = useState<25 | 50 | 100>(25);
  const [page, setPage] = useState(1);

  useTopBar({
    title: t("nav.orders"),
    lastUpdatedIso: new Date().toISOString(),
    showTimeRange: true,
    extraActions: (
      <>
        <Button
          size="sm"
          variant="outline"
          data-control-id={controls.orders.exportCsv}
          className="h-8 gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          {t("orders.export.csv")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          data-control-id={controls.orders.exportJson}
          className="h-8 gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          {t("orders.export.json")}
        </Button>
      </>
    ),
  });

  const symbols = Array.from(new Set((q.data ?? []).map((o) => o.symbol)));

  const filtered = useMemo(
    () =>
      (q.data ?? []).filter(
        (o) =>
          (account === "all" || o.accountId === account) &&
          (symbol === "all" || o.symbol === symbol) &&
          (side === "all" || o.side === side) &&
          (result === "all" || o.result === result) &&
          (!txt || o.ticket.includes(txt) || o.correlationId.includes(txt)) &&
          (!search.d || o.closedAt.slice(0, 10) === search.d) &&
          (search.h < 0 || new Date(o.closedAt).getUTCHours() === search.h),
      ),
    [q.data, account, symbol, side, result, txt, search],
  );

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div className="flex flex-col gap-4">
      <FixtureBanner />

      <TimeRangePicker />

      <FilterBar>
        <Input
          placeholder={t("common.search")}
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          data-control-id={controls.orders.search}
          className="max-w-xs"
        />
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          data-control-id={controls.orders.filterAccount}
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        >
          <option value="all">{t("orders.filter.all_accounts")}</option>
          {(accountsQ.data ?? []).map((a) => (
            <option key={a.id} value={a.id}>
              {a.displayName}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          data-control-id={controls.orders.filterSymbol}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option value="all">{t("orders.filter.all_symbols")}</option>
          {symbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          data-control-id={controls.orders.filterSide}
          value={side}
          onChange={(e) => setSide(e.target.value as never)}
        >
          <option value="all">{t("orders.filter.any_side")}</option>
          <option value="buy">{t("orders.side.buy")}</option>
          <option value="sell">{t("orders.side.sell")}</option>
        </select>
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          data-control-id={controls.orders.filterResult}
          value={result}
          onChange={(e) => setResult(e.target.value as never)}
        >
          <option value="all">{t("orders.filter.any_result")}</option>
          <option value="win">{t("orders.result.win")}</option>
          <option value="loss">{t("orders.result.loss")}</option>
          <option value="break_even">{t("orders.result.break_even")}</option>
          <option value="pending">{t("orders.result.pending")}</option>
        </select>
        <select
          className="h-8 rounded-md border border-input bg-background px-2 text-xs ml-auto"
          data-control-id={controls.orders.pageSize}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value) as never);
            setPage(1);
          }}
        >
          <option value={25}>25</option>
          <option value={50}>100</option>
          <option value={100}>100</option>
        </select>
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
                  <th className="px-4 py-2">{t("col.time")}</th>
                  <th className="px-2 py-2">{t("col.account")}</th>
                  <th className="px-2 py-2">{t("col.source")}</th>
                  <th className="px-2 py-2">{t("col.symbol")}</th>
                  <th className="px-2 py-2">{t("col.side")}</th>
                  <th className="px-2 py-2 text-right">{t("col.entry")}</th>
                  <th className="px-2 py-2 text-right">{t("col.close")}</th>
                  <th className="px-2 py-2 text-right">{t("col.pips")}</th>
                  <th className="px-2 py-2 text-right">{t("col.pnl")}</th>
                  <th className="px-2 py-2">{t("col.ticket")}</th>
                  <th className="px-2 py-2">{t("col.result")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {paged.map((o: Order) => (
                  <tr
                    key={o.id}
                    className="border-b border-border/60 last:border-none hover:bg-muted/40"
                  >
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {o.closedAt.slice(0, 16).replace("T", " ")}
                    </td>
                    <td className="px-2 py-2 truncate">{o.accountLabel}</td>
                    <td className="px-2 py-2 truncate">{o.sourceName}</td>
                    <td className="px-2 py-2 font-medium">{o.symbol}</td>
                    <td className="px-2 py-2 uppercase text-xs">{o.side}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{o.entryPrice.toFixed(3)}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{o.closePrice.toFixed(3)}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{o.pips}</td>
                    <td className="px-2 py-2 text-right">
                      <MoneyUsd value={o.netPnlUsd} colorize />
                    </td>
                    <td className="px-2 py-2">
                      <Sensitive value={o.ticket} />
                    </td>
                    <td className="px-2 py-2">
                      <StatusBadge tone={resultTone(o.result)} />
                    </td>
                    <td className="pr-3">
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        data-control-id={controls.orders.openTrace}
                      >
                        <Link to="/trace">T</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-border p-2 text-xs text-muted-foreground">
              <span>
                {filtered.length} {t("common.results").toLowerCase()}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  {t("common.prev")}
                </Button>
                <span>
                  {t("common.page")} {page} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("common.next")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
