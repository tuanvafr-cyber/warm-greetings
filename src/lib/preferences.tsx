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
 * Local preferences persisted in localStorage:
 *   sidebar state, privacy mode, pinned account, page size, carousel slide,
 *   auto-slide — per docs/genesis-pack/03_INFORMATION_ARCHITECTURE_AND_ROUTES.md.
 */

type AccountScope = { id: string; label: string } | "all";

type PreferencesContextValue = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;

  privacyMode: boolean;
  togglePrivacy: () => void;

  accountScope: AccountScope;
  setAccountScope: (s: AccountScope) => void;
  pinnedAccountId: string | "all" | null;
  pinAccount: (id: string | "all" | null) => void;

  carouselAutoSlide: boolean;
  setCarouselAutoSlide: (v: boolean) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const KEYS = {
  sidebar: "signalops.sidebarCollapsed",
  privacy: "signalops.privacyMode",
  scope: "signalops.accountScope",
  pinned: "signalops.pinnedAccount",
  autoSlide: "signalops.carouselAutoSlide",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    if (v == null) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [accountScope, setAccountScopeState] = useState<AccountScope>("all");
  const [pinnedAccountId, setPinnedAccountId] = useState<string | "all" | null>(null);
  const [carouselAutoSlide, setCarouselAutoSlideState] = useState(true);

  // Hydrate after mount to avoid SSR mismatch.
  useEffect(() => {
    setSidebarCollapsed(read(KEYS.sidebar, false));
    setPrivacyMode(read(KEYS.privacy, false));
    const pinned = read<string | "all" | null>(KEYS.pinned, null);
    setPinnedAccountId(pinned);
    setAccountScopeState(read<AccountScope>(KEYS.scope, pinned && pinned !== "all" ? { id: pinned, label: pinned } : "all"));
    setCarouselAutoSlideState(read(KEYS.autoSlide, true));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      write(KEYS.sidebar, next);
      return next;
    });
  }, []);

  const setSidebarCollapsedPersist = useCallback((v: boolean) => {
    setSidebarCollapsed(v);
    write(KEYS.sidebar, v);
  }, []);

  const togglePrivacy = useCallback(() => {
    setPrivacyMode((prev) => {
      const next = !prev;
      write(KEYS.privacy, next);
      return next;
    });
  }, []);

  const setAccountScope = useCallback((s: AccountScope) => {
    setAccountScopeState(s);
    write(KEYS.scope, s);
  }, []);

  const pinAccount = useCallback((id: string | "all" | null) => {
    setPinnedAccountId(id);
    write(KEYS.pinned, id);
  }, []);

  const setCarouselAutoSlide = useCallback((v: boolean) => {
    setCarouselAutoSlideState(v);
    write(KEYS.autoSlide, v);
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
      setSidebarCollapsed: setSidebarCollapsedPersist,
      privacyMode,
      togglePrivacy,
      accountScope,
      setAccountScope,
      pinnedAccountId,
      pinAccount,
      carouselAutoSlide,
      setCarouselAutoSlide,
    }),
    [
      sidebarCollapsed,
      toggleSidebar,
      setSidebarCollapsedPersist,
      privacyMode,
      togglePrivacy,
      accountScope,
      setAccountScope,
      pinnedAccountId,
      pinAccount,
      carouselAutoSlide,
      setCarouselAutoSlide,
    ],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}
