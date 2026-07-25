import { useI18n } from "@/lib/i18n";

/**
 * Native sizing rule (docs/genesis-pack/07_DATA_AND_METRIC_CONTRACTS.md):
 *   - Account currency USC, configured sizing 2000 → display "2000 USC" (never convert).
 *   - Account currency USD, configured sizing 100 → display "100 USD".
 *
 * Reporting rule:
 *   - USD stays USD.
 *   - USC divides by 100 → display as USD equivalent for REPORTING only.
 */

export type Currency = "USC" | "USD";

export function formatNativeSizing(amount: number, currency: Currency): string {
  return `${new Intl.NumberFormat("en-US").format(amount)} ${currency}`;
}

export function toReportingUsd(amount: number, currency: Currency): number {
  return currency === "USC" ? amount / 100 : amount;
}

export function formatReportingUsd(
  amount: number,
  currency: Currency,
  locale: string = "en-US",
): string {
  const usd = toReportingUsd(amount, currency);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(usd);
}

export function formatPercent(v: number, digits = 1): string {
  return `${(v * 100).toFixed(digits)}%`;
}

export function useLocaleFormatters() {
  const { locale } = useI18n();
  const bcp47 = locale === "vi" ? "vi-VN" : "en-US";
  return {
    number: (n: number) => new Intl.NumberFormat(bcp47).format(n),
    date: (d: Date) => new Intl.DateTimeFormat(bcp47, { dateStyle: "medium" }).format(d),
    dateTime: (d: Date) =>
      new Intl.DateTimeFormat(bcp47, { dateStyle: "medium", timeStyle: "short" }).format(d),
    usd: (n: number, currency: Currency = "USD") => formatReportingUsd(n, currency, bcp47),
  };
}
