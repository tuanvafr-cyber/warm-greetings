import { useMemo } from "react";
import type { HeatmapBucket } from "@/data/contracts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "@tanstack/react-router";
import { controls } from "@/lib/control-registry";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const HOUR_BUCKETS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22] as const;

type Aggregated = {
  date: string;
  bucketStart: number; // 0,2,4...22
  orderCount: number;
  winCount: number;
  lossCount: number;
  unresolvedCount: number;
  netPnlUsd: number;
  netPips: number;
  bestOrderPnlUsd: number;
  worstOrderPnlUsd: number;
  topSource?: string;
};

/**
 * Trade Activity Heatmap — date × 2-hour bucket grid. Green = profitable,
 * red = losing, gray = break-even/unresolved. Dot size scales with total
 * orders. Click a bucket to open Order History filtered to that date +
 * two-hour window. Best/Worst tooltip fields report the largest single
 * order P&L in the bucket, sourced from the fixture contract.
 */
export function TradeActivityHeatmap({ buckets }: { buckets: HeatmapBucket[] }) {
  const t = useT();
  const navigate = useNavigate();

  const { dates, map, maxOrders } = useMemo(() => {
    const dateSet = new Set<string>();
    const agg = new Map<string, Aggregated>();
    const sourceTallies = new Map<string, Map<string, number>>();
    for (const b of buckets) {
      dateSet.add(b.date);
      const bs = Math.floor(b.hour / 2) * 2;
      const k = `${b.date}|${bs}`;
      const prev = agg.get(k);
      const next: Aggregated = prev
        ? {
            ...prev,
            orderCount: prev.orderCount + b.orderCount,
            winCount: prev.winCount + b.winCount,
            lossCount: prev.lossCount + b.lossCount,
            unresolvedCount: prev.unresolvedCount + b.unresolvedCount,
            netPnlUsd: prev.netPnlUsd + b.netPnlUsd,
            netPips: prev.netPips + b.netPips,
            bestOrderPnlUsd: Math.max(prev.bestOrderPnlUsd, b.bestOrderPnlUsd),
            worstOrderPnlUsd: Math.min(prev.worstOrderPnlUsd, b.worstOrderPnlUsd),
          }
        : {
            date: b.date,
            bucketStart: bs,
            orderCount: b.orderCount,
            winCount: b.winCount,
            lossCount: b.lossCount,
            unresolvedCount: b.unresolvedCount,
            netPnlUsd: b.netPnlUsd,
            netPips: b.netPips,
            bestOrderPnlUsd: b.bestOrderPnlUsd,
            worstOrderPnlUsd: b.worstOrderPnlUsd,
          };
      agg.set(k, next);
      if (b.topSource) {
        let tally = sourceTallies.get(k);
        if (!tally) {
          tally = new Map();
          sourceTallies.set(k, tally);
        }
        tally.set(b.topSource, (tally.get(b.topSource) ?? 0) + b.orderCount);
      }
    }
    for (const [k, tally] of sourceTallies) {
      let best: string | undefined;
      let bestN = -1;
      for (const [src, n] of tally) {
        if (n > bestN) {
          bestN = n;
          best = src;
        }
      }
      const cur = agg.get(k);
      if (cur && best) agg.set(k, { ...cur, topSource: best });
    }
    const dates = Array.from(dateSet).sort();
    const maxOrders = Math.max(1, ...Array.from(agg.values()).map((a) => a.orderCount));
    return { dates, map: agg, maxOrders };
  }, [buckets]);

  return (
    <TooltipProvider delayDuration={80}>
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="min-w-[720px]">
            <div
              className="grid text-[10px] text-muted-foreground"
              style={{ gridTemplateColumns: `56px repeat(${dates.length}, minmax(28px, 1fr))` }}
            >
              <div />
              {dates.map((d) => (
                <div key={d} className="truncate px-1 text-center">
                  {d.slice(5)}
                </div>
              ))}
            </div>
            {HOUR_BUCKETS.map((bs) => (
              <div
                key={bs}
                className="grid items-center"
                style={{ gridTemplateColumns: `56px repeat(${dates.length}, minmax(28px, 1fr))` }}
              >
                <div className="pr-1 text-right text-[10px] text-muted-foreground tabular-nums">
                  {String(bs).padStart(2, "0")}–{String(bs + 2).padStart(2, "0")}
                </div>
                {dates.map((d) => {
                  const b = map.get(`${d}|${bs}`);
                  if (!b) return <div key={d + bs} className="h-6" />;
                  const tone =
                    b.netPnlUsd > 5
                      ? "bg-[oklch(0.72_0.15_150)]"
                      : b.netPnlUsd < -5
                        ? "bg-[oklch(0.66_0.19_25)]"
                        : "bg-muted-foreground/30";
                  const size = 8 + (b.orderCount / maxOrders) * 14;
                  return (
                    <div key={d + bs} className="grid h-6 place-items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            data-control-id={controls.dashboard.heatmapBucketOpen}
                            onClick={() =>
                              navigate({
                                to: "/orders",
                                search: { d: b.date, h: b.bucketStart, hb: 2 } as never,
                              })
                            }
                            className={cn(
                              "rounded-full transition-transform hover:scale-125",
                              tone,
                            )}
                            style={{ width: size, height: size }}
                            aria-label={`${b.date} ${bs}:00–${bs + 2}:00`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <div className="font-medium">
                            {b.date} · {String(bs).padStart(2, "0")}:00–
                            {String(bs + 2).padStart(2, "0")}:00
                          </div>
                          <div>
                            {t("dashboard.total_orders")}: {b.orderCount}
                          </div>
                          <div>
                            {t("heat.win")}: {b.winCount} · {t("heat.loss")}: {b.lossCount} · —:{" "}
                            {b.unresolvedCount}
                          </div>
                          <div>
                            {t("dashboard.net_pnl")}: {b.netPnlUsd.toFixed(2)}
                          </div>
                          <div>
                            {t("dashboard.net_pips")}: {b.netPips.toFixed(0)}
                          </div>
                          <div className="text-muted-foreground">
                            {t("heat.best_order")}: {b.bestOrderPnlUsd.toFixed(2)} ·{" "}
                            {t("heat.worst_order")}: {b.worstOrderPnlUsd.toFixed(2)}
                          </div>
                          {b.topSource ? (
                            <div className="text-muted-foreground">
                              {t("heat.top_source")}: {b.topSource}
                            </div>
                          ) : null}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.15_150)]" /> {t("heat.win")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.66_0.19_25)]" /> {t("heat.loss")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />{" "}
            {t("heat.legend_even")}
          </span>
          <span className="ml-auto">
            {t("heat.dot_size")} = {t("dashboard.total_orders")}
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
}
