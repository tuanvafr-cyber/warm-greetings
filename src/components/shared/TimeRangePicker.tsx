import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { TKey } from "@/lib/i18n/dictionary";

export type TimeRange = "today" | "yesterday" | "7d" | "30d" | "90d" | "mtd" | "ytd" | "custom";

const OPTIONS: { value: TimeRange; key: TKey; controlSuffix: string }[] = [
  { value: "today", key: "time.today", controlSuffix: "today" },
  { value: "yesterday", key: "time.yesterday", controlSuffix: "yesterday" },
  { value: "7d", key: "time.7d", controlSuffix: "7d" },
  { value: "30d", key: "time.30d", controlSuffix: "30d" },
  { value: "90d", key: "time.90d", controlSuffix: "90d" },
  { value: "mtd", key: "time.mtd", controlSuffix: "mtd" },
  { value: "ytd", key: "time.ytd", controlSuffix: "ytd" },
  { value: "custom", key: "time.custom", controlSuffix: "custom" },
];

export function TimeRangePicker({
  value, onChange, controlPrefix,
}: {
  value: TimeRange;
  onChange: (v: TimeRange) => void;
  controlPrefix: string;
}) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-card p-1">
      {OPTIONS.map((o) => (
        <Button
          key={o.value}
          size="sm"
          variant={value === o.value ? "default" : "ghost"}
          onClick={() => onChange(o.value)}
          data-control-id={`${controlPrefix}.time.${o.controlSuffix}`}
          className={cn("h-7 px-2 text-xs font-medium")}
        >
          {t(o.key)}
        </Button>
      ))}
    </div>
  );
}
