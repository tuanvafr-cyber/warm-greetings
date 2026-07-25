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
  const latest = useRef(state);
  latest.current = state;
  const serialised = JSON.stringify({
    title: state.title,
    showTimeRange: state.showTimeRange,
    hasActions: state.extraActions != null,
    // lastUpdatedIso intentionally excluded — routes commonly pass
    // `new Date().toISOString()`, which would otherwise re-fire the effect
    // on every render and cause an infinite update loop.
  });
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;
  useEffect(() => {
    const c = ctxRef.current;
    if (!c) return;
    c.set(latest.current);
    return () => c.set({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialised]);
}
