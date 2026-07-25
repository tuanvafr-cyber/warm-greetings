import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { UseQueryResult } from "@tanstack/react-query";

/**
 * TopBar registration. Each route optionally registers a title override,
 * a "last updated" ISO timestamp, whether the shared TimeRange dropdown
 * should be visible, and up to one route-scoped action cluster.
 */
export type TopBarState = {
  title?: string;
  lastUpdatedIso?: string;
  showTimeRange?: boolean;
  extraActions?: ReactNode;
};

type Ctx = {
  state: TopBarState;
  set: (s: TopBarState) => void;
};

const TopBarContext = createContext<Ctx | undefined>(undefined);

export function TopBarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TopBarState>({});
  const set = useCallback((s: TopBarState) => setState(s), []);
  const value = useMemo(() => ({ state, set }), [state, set]);
  return <TopBarContext.Provider value={value}>{children}</TopBarContext.Provider>;
}

export function useTopBarState(): TopBarState {
  const ctx = useContext(TopBarContext);
  return ctx?.state ?? {};
}

/**
 * Register the page's TopBar contribution. `lastUpdatedIso` MUST be a
 * stable value derived from React Query's `dataUpdatedAt` (see
 * `useLastUpdatedFromQueries`). Never pass `new Date().toISOString()`
 * inline — it produces a fresh string on every render and would loop.
 */
export function useTopBar(state: TopBarState) {
  const ctx = useContext(TopBarContext);
  const latest = useRef(state);
  latest.current = state;
  const serialised = JSON.stringify({
    title: state.title,
    showTimeRange: state.showTimeRange,
    hasActions: state.extraActions != null,
    lastUpdatedIso: state.lastUpdatedIso ?? null,
  });
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;
  useEffect(() => {
    const c = ctxRef.current;
    if (!c) return;
    c.set(latest.current);
    return () => c.set({});
  }, [serialised]);
}

/**
 * Derive a stable `lastUpdatedIso` from React Query results. The value
 * only changes when the newest `dataUpdatedAt` across the given queries
 * advances (after a refetch), so it can safely feed `useTopBar` without
 * triggering render loops.
 */
export function useLastUpdatedFromQueries(
  ...queries: Array<Pick<UseQueryResult<unknown>, "dataUpdatedAt">>
): string | undefined {
  const max = queries.reduce((acc, q) => (q?.dataUpdatedAt > acc ? q.dataUpdatedAt : acc), 0);
  return useMemo(() => (max > 0 ? new Date(max).toISOString() : undefined), [max]);
}
