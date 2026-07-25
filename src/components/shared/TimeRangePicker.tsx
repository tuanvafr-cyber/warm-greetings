import { useState } from "react";
import { CalendarClock, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/i18n/dictionary";
import { TIME_RANGES, useTimeRange, type TimeRange } from "@/lib/time-range";
import { controls } from "@/lib/control-registry";

export type { TimeRange };
import { cn } from "@/lib/utils";

const KEY: Record<TimeRange, TKey> = {
  today: "time.today",
  yesterday: "time.yesterday",
  "7d": "time.7d",
  "30d": "time.30d",
  "90d": "time.90d",
  mtd: "time.mtd",
  ytd: "time.ytd",
  custom: "time.custom",
};

/**
 * Compact shared dropdown — one control replaces the horizontal row of
 * time buttons. Persists selection in the URL via `useTimeRange`.
 */
export function TimeRangePicker({
  controlId = controls.shell.timeRange,
  className,
}: {
  controlId?: string;
  className?: string;
}) {
  const t = useT();
  const { range, from, to, setRange } = useTimeRange();
  const [customOpen, setCustomOpen] = useState(false);
  const [fromDraft, setFromDraft] = useState(from ?? "");
  const [toDraft, setToDraft] = useState(to ?? "");

  const label = range === "custom" && from && to ? `${from} → ${to}` : t(KEY[range]);
  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 gap-1.5 px-2 text-xs font-medium", className)}
            data-control-id={controlId}
            aria-label={t("time.picker.aria")}
          >
            <CalendarClock className="h-3.5 w-3.5 opacity-70" />
            <span className="max-w-[160px] truncate">{label}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>{t("time.range")}</span>
            <span className="text-[10px] font-normal text-muted-foreground">{tz}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {TIME_RANGES.map((r) => (
            <DropdownMenuItem
              key={r}
              onSelect={(e) => {
                if (r === "custom") {
                  e.preventDefault();
                  setCustomOpen(true);
                } else {
                  setRange(r);
                }
              }}
            >
              {range === r ? <Check className="mr-2 h-4 w-4" /> : <span className="mr-2 w-4" />}
              {t(KEY[r])}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("time.custom")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label htmlFor="tr-from">{t("time.from")}</Label>
              <Input
                id="tr-from"
                type="date"
                value={fromDraft}
                onChange={(e) => setFromDraft(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="tr-to">{t("time.to")}</Label>
              <Input
                id="tr-to"
                type="date"
                value={toDraft}
                onChange={(e) => setToDraft(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("time.timezone")}: {tz}
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCustomOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              disabled={!fromDraft || !toDraft || fromDraft > toDraft}
              onClick={() => {
                setRange("custom", { from: fromDraft, to: toDraft });
                setCustomOpen(false);
              }}
            >
              {t("common.apply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
