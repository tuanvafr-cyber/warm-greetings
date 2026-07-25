import { useI18n } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/**
 * Formatting helpers that also honor Privacy Mode. Money display always
 * uses these — never a raw Intl.NumberFormat in a component.
 */

type Currency = "USD" | "USC";

function formatUsd(n: number, bcp47: string) {
  return new Intl.NumberFormat(bcp47, {
    style: "currency", currency: "USD", maximumFractionDigits: 2,
  }).format(n);
}

export function MoneyUsd({
  value, className, colorize = false,
}: {
  value: number;
  className?: string;
  colorize?: boolean;
}) {
  const { locale } = useI18n();
  const { privacyMode } = usePreferences();
  const bcp47 = locale === "vi" ? "vi-VN" : "en-US";
  const sign = colorize ? (value > 0 ? "text-success" : value < 0 ? "text-destructive" : "text-muted-foreground") : "";
  return (
    <span className={cn("tabular-nums", sign, className)}>
      {privacyMode ? "••••" : formatUsd(value, bcp47)}
    </span>
  );
}

export function NativeAmount({
  amount, currency, className,
}: {
  amount: number;
  currency: Currency;
  className?: string;
}) {
  const { privacyMode } = usePreferences();
  return (
    <span className={cn("tabular-nums", className)}>
      {privacyMode ? "••••" : `${new Intl.NumberFormat("en-US").format(amount)} ${currency}`}
    </span>
  );
}

export function Sensitive({ value, className }: { value: string; className?: string }) {
  const { privacyMode } = usePreferences();
  return <span className={cn("font-mono text-xs", className)}>{privacyMode ? "••••" : value}</span>;
}

export function Pct({ value, digits = 1 }: { value: number; digits?: number }) {
  return <span className="tabular-nums">{(value * 100).toFixed(digits)}%</span>;
}

export function TimeAgo({ iso }: { iso: string | null }) {
  const { locale } = useI18n();
  if (!iso) return <span className="text-muted-foreground">—</span>;
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.round(diff / 1000);
  if (s < 60) return <span>{s}s</span>;
  const m = Math.round(s / 60);
  if (m < 60) return <span>{locale === "vi" ? `${m} phút` : `${m}m`}</span>;
  const h = Math.round(m / 60);
  if (h < 48) return <span>{locale === "vi" ? `${h} giờ` : `${h}h`}</span>;
  const d = Math.round(h / 24);
  return <span>{locale === "vi" ? `${d} ngày` : `${d}d`}</span>;
}
