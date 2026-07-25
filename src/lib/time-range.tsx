import { useCallback } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

export type TimeRange =
  | "today"
  | "yesterday"
  | "7d"
  | "30d"
  | "90d"
  | "mtd"
  | "ytd"
  | "custom";

export const TIME_RANGES: TimeRange[] = [
  "today", "yesterday", "7d", "30d", "90d", "mtd", "ytd", "custom",
];

const DEFAULT: TimeRange = "7d";

function isTimeRange(v: unknown): v is TimeRange {
  return typeof v === "string" && (TIME_RANGES as string[]).includes(v);
}

/**
 * Shared time-range selection stored in the URL as `?tr=<value>`. Routes
 * that opt in can additionally consume `?trFrom=YYYY-MM-DD&trTo=YYYY-MM-DD`
 * when the custom range is selected. Never queries unlimited history.
 */
export function useTimeRange(): {
  range: TimeRange;
  from: string | null;
  to: string | null;
  setRange: (r: TimeRange, opts?: { from?: string; to?: string }) => void;
} {
  const router = useRouter();
  const search = useRouterState({ select: (s) => s.location.search as Record<string, unknown> });

  const raw = search?.tr;
  const range: TimeRange = isTimeRange(raw) ? raw : DEFAULT;
  const from = typeof search?.trFrom === "string" ? (search.trFrom as string) : null;
  const to = typeof search?.trTo === "string" ? (search.trTo as string) : null;

  const setRange = useCallback(
    (r: TimeRange, opts?: { from?: string; to?: string }) => {
      router.navigate({
        to: ".",
        search: (prev: Record<string, unknown>) => {
          const next: Record<string, unknown> = { ...prev, tr: r };
          if (r === "custom") {
            if (opts?.from) next.trFrom = opts.from;
            if (opts?.to) next.trTo = opts.to;
          } else {
            delete next.trFrom;
            delete next.trTo;
          }
          return next;
        },
        replace: true,
      });
    },
    [router],
  );

  return { range, from, to, setRange };
}
