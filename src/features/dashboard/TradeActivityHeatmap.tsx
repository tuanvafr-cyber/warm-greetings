import type { HeatmapBucket } from "@/data/contracts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "@tanstack/react-router";
import { controls } from "@/lib/control-registry";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Trade Activity Heatmap — dense, chart-first: date × hour grid, dots sized
 * by Total Orders, coloured strictly green / red / gray. Click a bucket to
 * open Order History filtered by that date + hour bucket.
 */
export function TradeActivityHeatmap({ buckets }: { buckets: HeatmapBucket[] }) {
  const t = useT();
  const navigate = useNavigate();

  const dates = Array.from(new Set(buckets.map((b) => b.date))).sort();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const map = new Map<string, HeatmapBucket>();
  buckets.forEach((b) => map.set(`${b.date}|${b.hour}`, b));
  const maxOrders = Math.max(1, ...buckets.map((b) => b.orderCount));

  return (
    <TooltipProvider delayDuration={80}>
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid text-[10px] text-muted-foreground"
               style={{ gridTemplateColumns: `44px repeat(${dates.length}, minmax(28px, 1fr))` }}>
            <div />
            {dates.map((d) => (
              <div key={d} className="truncate px-1 text-center">{d.slice(5)}</div>
            ))}
          </div>
          {hours.map((h) => (
            <div key={h} className="grid items-center"
                 style={{ gridTemplateColumns: `44px repeat(${dates.length}, minmax(28px, 1fr))` }}>
              <div className="pr-1 text-right text-[10px] text-muted-foreground">
                {String(h).padStart(2, "0")}
              </div>
              {dates.map((d) => {
                const b = map.get(`${d}|${h}`);
                if (!b) return <div key={d + h} className="h-6" />;
                const tone =
                  b.netPnlUsd > 5 ? "bg-[oklch(0.72_0.15_150)]"
                  : b.netPnlUsd < -5 ? "bg-[oklch(0.66_0.19_25)]"
                  : "bg-muted-foreground/30";
                const size = 8 + (b.orderCount / maxOrders) * 14; // 8..22
                return (
                  <div key={d + h} className="grid h-6 place-items-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          data-control-id={controls.dashboard.heatmapBucketOpen}
                          onClick={() =>
                            navigate({ to: "/orders", search: { d: b.date, h: b.hour } as never })
                          }
                          className={cn("rounded-full transition-transform hover:scale-125", tone)}
                          style={{ width: size, height: size }}
                          aria-label={`${b.date} ${h}:00`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <div className="font-medium">{b.date} · {String(h).padStart(2, "0")}:00</div>
                        <div>{t("dashboard.total_orders")}: {b.orderCount}</div>
                        <div>Win: {b.winCount} · Loss: {b.lossCount} · —: {b.unresolvedCount}</div>
                        <div>{t("dashboard.net_pnl")}: {b.netPnlUsd.toFixed(2)}</div>
                        <div>{t("dashboard.net_pips")}: {b.netPips.toFixed(0)}</div>
                        {b.topSource ? <div className="text-muted-foreground">Top: {b.topSource}</div> : null}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          ))}
          <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.15_150)]" /> Win
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[oklch(0.66_0.19_25)]" /> Loss
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" /> Even / unresolved
            </span>
            <span className="ml-auto">Dot size = {t("dashboard.total_orders")}</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
