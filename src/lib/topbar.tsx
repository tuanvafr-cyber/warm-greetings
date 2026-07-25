import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
 * Register the page's TopBar contribution. Values reset on unmount so
 * routes don't leak state across navigation.
 */
export function useTopBar(state: TopBarState) {
  const ctx = useContext(TopBarContext);
  const serialised = JSON.stringify({
    title: state.title,
    lastUpdatedIso: state.lastUpdatedIso,
    showTimeRange: state.showTimeRange,
    // extraActions is a ReactNode — we cannot serialise it, so update whenever
    // other identity changes.
  });
  useEffect(() => {
    if (!ctx) return;
    ctx.set(state);
    return () => ctx.set({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, serialised]);
  // Also push extra actions on every render — cheap and keeps them current.
  useEffect(() => {
    if (!ctx) return;
    ctx.set(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.extraActions]);
}
