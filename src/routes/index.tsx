import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Boxes, Gauge, PlayCircle, TrendingUp, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { TimeRangePicker } from "@/components/shared/TimeRangePicker";
import { LoadingState } from "@/components/shared/StateViews";
import { MoneyUsd, Pct, TimeAgo } from "@/components/shared/MoneyText";
import { AnalyticsCarousel } from "@/features/dashboard/AnalyticsCarousel";
import { TradeActivityHeatmap } from "@/features/dashboard/TradeActivityHeatmap";
import { BalanceEquityChart, PnlOverTimeChart } from "@/features/dashboard/PnlCharts";
import {
  useDashboardKpis,
  useHeatmap,
  useInboxItems,
  useOrders,
  usePnlSeries,
  usePositions,
  useRiskPolicyVersions,
  useRuntimeComponents,
  useSources,
} from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { controls } from "@/lib/control-registry";
import { useTopBar } from "@/lib/topbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SignalOps Panel" },
      {
        name: "description",
        content: "Operational overview: P&L, exposure, execution and heatmap.",
      },
      { property: "og:title", content: "Dashboard — SignalOps Panel" },
      {
        property: "og:description",
        content: "Operational overview across accounts, sources and runtime.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const t = useT();
  const kpis = useDashboardKpis();
  const pnl = usePnlSeries();
  const heatmap = useHeatmap();
  const sources = useSources();
  const orders = useOrders();
  const positions = usePositions();
  const risk = useRiskPolicyVersions();
  const runtime = useRuntimeComponents();
  const inbox = useInboxItems();

  const loading = [kpis, pnl, heatmap, sources, orders, positions, risk, runtime, inbox].some(
    (q) => q.isPending,
  );

  const lastUpdated = useMemo(() => new Date().toISOString(), []);
  useTopBar({
    title: t("dashboard.title"),
    lastUpdatedIso: lastUpdated,
    showTimeRange: true,
  });

  const [analyticsHeight, setAnalyticsHeight] = useState<number>(360);

  const slides = useMemo(
    () => [
      {
        key: "be",
        label: t("dashboard.balance_equity"),
        content: <BalanceEquityChart data={pnl.data ?? []} />,
      },
      {
        key: "pnl",
        label: t("dashboard.pnl_over_time"),
        content: <PnlOverTimeChart data={pnl.data ?? []} />,
      },
      {
        key: "heat",
        label: t("dashboard.heatmap"),
        content: <TradeActivityHeatmap buckets={heatmap.data ?? []} />,
      },
    ],
    [pnl.data, heatmap.data, t],
  );
  // suppress-unused
  useEffect(() => {
    void 0;
  }, []);


  return (
    <div className="flex flex-col gap-4">
      <FixtureBanner />

      {loading || !kpis.data ? (
        <LoadingState />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label={t("dashboard.trading_pnl")}
              value={<MoneyUsd value={kpis.data.tradingPnlUsd} colorize />}
              delta={`${t("dashboard.executed")}: ${kpis.data.executedSignals}`}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatCard
              label={t("dashboard.total_income")}
              value={<MoneyUsd value={kpis.data.totalIncomeUsd} colorize />}
              delta={t("dashboard.income_breakdown")}
              icon={<Gauge className="h-4 w-4" />}
            />
            <StatCard
              label={t("dashboard.active_exposure")}
              value={<MoneyUsd value={kpis.data.activeExposureUsd} />}
              delta={`${kpis.data.openPositions} ${t("dashboard.exposure_open")} · ${kpis.data.pendingOrders} ${t("dashboard.exposure_pending")} · ${t("dashboard.exposure_floating")}: `}
              icon={<Activity className="h-4 w-4" />}
            >
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{t("dashboard.exposure_floating")}</span>
                <MoneyUsd value={kpis.data.floatingPnlUsd} colorize />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{t("dashboard.exposure_margin_used")}</span>
                <MoneyUsd value={kpis.data.marginUsedUsd} />
              </div>
            </StatCard>
            <StatCard
              label={t("dashboard.signal_execution_rate")}
              value={<Pct value={kpis.data.executionRate} />}
              delta={`${t("dashboard.eligible")}: ${kpis.data.eligibleSignals} · ${t("dashboard.blocked")}: ${kpis.data.blockedSignals} · ${t("dashboard.tech_failed")}: ${kpis.data.technicalFailedSignals}`}
              icon={<Zap className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AnalyticsCarousel slides={slides} onHeightChange={setAnalyticsHeight} />
            </div>
            <div
              className="flex flex-col gap-4 lg:h-full"
              style={{ minHeight: analyticsHeight }}
            >
              <div className="flex-1 min-h-0">
                <RiskTodayCard version={risk.data?.[0]} />
              </div>
              <div className="flex-1 min-h-0">
                <RuntimeInboxCard runtime={runtime.data ?? []} inbox={inbox.data ?? []} />
              </div>
            </div>
          </div>


          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SourcePerformanceCard sources={sources.data ?? []} />
            </div>
            <RecentOrdersCard orders={orders.data ?? []} positions={positions.data ?? []} />
          </div>
        </>
      )}
    </div>
  );
}

function RiskTodayCard({
  version,
}: {
  version: import("@/data/contracts").RiskPolicyVersion | undefined;
}) {
  const t = useT();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          {t("dashboard.risk_today")}
          <Link
            to="/risk"
            data-control-id={controls.dashboard.riskOpen}
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("common.view_details")}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <Metric
          label={t("dashboard.risk.daily_loss")}
          value={<MoneyUsd value={version?.dailyLossLimitUsd ?? 0} />}
        />
        <Metric
          label={t("dashboard.risk.drawdown")}
          value={<MoneyUsd value={version?.drawdownLimitUsd ?? 0} />}
        />
        <Metric
          label={t("dashboard.risk.margin_usage")}
          value={`${version?.marginBufferPct ?? 0}%`}
        />
        <Metric
          label={t("dashboard.risk.budget")}
          value={<MoneyUsd value={version?.riskBudgetUsd ?? 0} />}
        />
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-base font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function RuntimeInboxCard({
  runtime,
  inbox,
}: {
  runtime: import("@/data/contracts").RuntimeComponent[];
  inbox: import("@/data/contracts").InboxItem[];
}) {
  const t = useT();
  const degraded = runtime.filter((c) => c.health !== "healthy");
  const open = inbox.filter((i) => i.state === "open");
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          {t("dashboard.runtime_inbox")}
          <Link to="/inbox" className="text-xs font-medium text-primary hover:underline">
            {t("common.view_details")}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs text-muted-foreground">
          {degraded.length} components need attention · {open.length} open inbox items
        </div>
        <ul className="space-y-1.5 text-sm">
          {degraded.slice(0, 3).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-2">
              <span className="truncate">{c.name}</span>
              <StatusBadge tone={healthToTone(c.health)} />
            </li>
          ))}
          {open.slice(0, 3).map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-2">
              <span className="truncate">{i.title}</span>
              <StatusBadge
                tone={
                  i.severity === "critical" || i.severity === "blocker"
                    ? "blocked"
                    : i.severity === "warning"
                      ? "degraded"
                      : "input_required"
                }
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function healthToTone(h: import("@/data/contracts").ComponentHealth): StatusTone {
  return h === "healthy"
    ? "healthy"
    : h === "degraded"
      ? "degraded"
      : h === "input_required"
        ? "input_required"
        : h === "blocked"
          ? "blocked"
          : h === "stale"
            ? "stale"
            : "unavailable";
}

function SourcePerformanceCard({ sources }: { sources: import("@/data/contracts").Source[] }) {
  const t = useT();
  const top = [...sources]
    .filter((s) => s.lifecycle !== "archived")
    .sort((a, b) => b.netPnlUsd - a.netPnlUsd)
    .slice(0, 5);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          {t("dashboard.source_performance")}
          <Link
            to="/sources"
            data-control-id={controls.dashboard.sourcesViewAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("dashboard.view_all")}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">{t("col.source")}</th>
              <th className="px-2 py-2 font-medium">{t("dashboard.win_rate")}</th>
              <th className="px-2 py-2 text-right font-medium">{t("dashboard.net_pnl")}</th>
              <th className="px-2 py-2 text-right font-medium">{t("dashboard.today_usd")}</th>
              <th className="px-2 py-2 text-right font-medium">{t("dashboard.net_pips")}</th>
              <th className="px-2 py-2 text-right font-medium">{t("dashboard.total_orders")}</th>
              <th className="px-4 py-2 font-medium">{t("col.status")}</th>
            </tr>
          </thead>
          <tbody>
            {top.map((s) => (
              <tr key={s.id} className="border-b border-border/60 last:border-none">
                <td className="px-4 py-2 font-medium">{s.displayName}</td>
                <td className="px-2 py-2">
                  <Pct value={s.signalWinRate} />
                </td>
                <td className="px-2 py-2 text-right">
                  <MoneyUsd value={s.netPnlUsd} colorize />
                </td>
                <td className="px-2 py-2 text-right">
                  <MoneyUsd value={s.todayPnlUsd} colorize />
                </td>
                <td className="px-2 py-2 text-right tabular-nums">{s.netPips.toFixed(0)}</td>
                <td className="px-2 py-2 text-right tabular-nums">{s.totalOrders}</td>
                <td className="px-4 py-2">
                  <StatusBadge tone={sourceToTone(s.lifecycle)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function sourceToTone(lc: import("@/data/contracts").SourceLifecycle): StatusTone {
  return lc === "enabled"
    ? "active"
    : lc === "disabled"
      ? "disabled"
      : lc === "draining"
        ? "draining"
        : lc === "degraded"
          ? "degraded"
          : "archived";
}

function RecentOrdersCard({
  orders,
  positions,
}: {
  orders: import("@/data/contracts").Order[];
  positions: import("@/data/contracts").Position[];
}) {
  const t = useT();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5">
            <PlayCircle className="h-4 w-4" />
            {t("dashboard.open_positions_recent")}
          </span>
          <Link
            to="/orders"
            data-control-id={controls.dashboard.ordersViewAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("dashboard.view_all")}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
            {t("nav.positions")}
          </div>
          <ul className="space-y-1">
            {positions.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2">
                <span className="truncate">
                  {p.symbol} · {p.side.toUpperCase()} · {p.accountLabel}
                </span>
                <MoneyUsd value={p.floatingPnlUsd} colorize />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
            {t("nav.orders")}
          </div>
          <ul className="space-y-1">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2">
                <span className="truncate">
                  {o.symbol} · {o.side.toUpperCase()} · {o.accountLabel}
                </span>
                <MoneyUsd value={o.netPnlUsd} colorize />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 border-t border-border pt-2">
          <Boxes className="h-3.5 w-3.5 text-muted-foreground" />
          <Link to="/positions" className="text-xs font-medium text-primary hover:underline">
            {t("nav.positions")}
          </Link>
          <span className="text-xs text-muted-foreground">·</span>
          <Link to="/orders" className="text-xs font-medium text-primary hover:underline">
            {t("nav.orders")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
