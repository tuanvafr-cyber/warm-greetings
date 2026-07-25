import { keepPreviousData, useQuery, type QueryKey } from "@tanstack/react-query";
import { FixturePanelDataAdapter } from "./adapters/FixturePanelDataAdapter";
import type { PanelDataAdapter } from "./adapters/PanelDataAdapter";

// Panel Next ships with the visual fixture adapter. Codex swaps this for
// SignalOpsApiAdapter once the real backend is available.
const adapter: PanelDataAdapter = new FixturePanelDataAdapter();

export const usePanelAdapter = () => adapter;

/**
 * Query-key scope shared by all data hooks so the same endpoint can be
 * cached separately per account scope, time range, filters and cursor.
 * `keepPreviousData` keeps the previous result visible while the next
 * page loads, giving a subtle "refreshing" state instead of blanking.
 */
export type QueryScope = {
  account?: string | "all";
  range?: string;
  from?: string | null;
  to?: string | null;
  filters?: Record<string, unknown>;
  cursor?: string | number | null;
};

const useScopedQ = <T>(
  base: string,
  scope: QueryScope | undefined,
  fn: () => Promise<T>,
  staleTime: number,
) => {
  const key: QueryKey = [base, scope ?? null];
  return useQuery({
    queryKey: key,
    queryFn: fn,
    staleTime,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
};

// Domain-appropriate stale times.
const S = {
  live: 5_000, // positions, orders, telegram session
  fast: 15_000, // signals, inbox, traces
  normal: 30_000, // kpis, pnl, heatmap, sources
  slow: 60_000, // accounts, risk versions, runtime, providers
  cold: 5 * 60_000, // instrument mapping, prompt profiles, routing policy
};

export const useAccounts = (scope?: QueryScope) =>
  useScopedQ("accounts", scope, () => adapter.listAccounts(), S.slow);
export const useSources = (scope?: QueryScope) =>
  useScopedQ("sources", scope, () => adapter.listSources(), S.normal);
export const useSignals = (scope?: QueryScope) =>
  useScopedQ("signals", scope, () => adapter.listSignals(), S.fast);
export const usePositions = (scope?: QueryScope) =>
  useScopedQ("positions", scope, () => adapter.listPositions(), S.live);
export const useOrders = (scope?: QueryScope) =>
  useScopedQ("orders", scope, () => adapter.listOrders(), S.live);
export const useDashboardKpis = (scope?: QueryScope) =>
  useScopedQ("kpis", scope, () => adapter.dashboardKpis(), S.normal);
export const usePnlSeries = (scope?: QueryScope) =>
  useScopedQ("pnl", scope, () => adapter.pnlSeries(), S.normal);
export const useHeatmap = (scope?: QueryScope) =>
  useScopedQ("heatmap", scope, () => adapter.heatmap(), S.normal);
export const useRiskPolicyVersions = (scope?: QueryScope) =>
  useScopedQ("risk", scope, () => adapter.riskPolicyVersions(), S.slow);
export const useTelegramSession = (scope?: QueryScope) =>
  useScopedQ("telegram", scope, () => adapter.telegramSession(), S.live);
export const useRuntimeComponents = (scope?: QueryScope) =>
  useScopedQ("runtime", scope, () => adapter.runtimeComponents(), S.slow);
export const useProviders = (scope?: QueryScope) =>
  useScopedQ("providers", scope, () => adapter.providers(), S.slow);
export const useInboxItems = (scope?: QueryScope) =>
  useScopedQ("inbox", scope, () => adapter.inboxItems(), S.fast);
export const useTraces = (scope?: QueryScope) =>
  useScopedQ("traces", scope, () => adapter.traces(), S.fast);
export const useHermesRecommendations = (scope?: QueryScope) =>
  useScopedQ("hermes", scope, () => adapter.hermesRecommendations(), S.normal);

export const useProviderSlots = (scope?: QueryScope) =>
  useScopedQ("provider_slots", scope, () => adapter.providerSlots(), S.slow);
export const useRoutingPolicy = (scope?: QueryScope) =>
  useScopedQ("routing_policy", scope, () => adapter.routingPolicy(), S.cold);
export const usePromptProfiles = (scope?: QueryScope) =>
  useScopedQ("prompt_profiles", scope, () => adapter.promptProfiles(), S.cold);
export const useNativeCurrencyReviews = (scope?: QueryScope) =>
  useScopedQ("native_ccy_reviews", scope, () => adapter.nativeCurrencyReviews(), S.normal);
export const useAccountLines = (scope?: QueryScope) =>
  useScopedQ("account_lines", scope, () => adapter.accountLines(), S.slow);
export const useAccountReadiness = (scope?: QueryScope) =>
  useScopedQ("account_readiness", scope, () => adapter.accountReadiness(), S.slow);
export const useInstrumentMapping = (scope?: QueryScope) =>
  useScopedQ("instrument_mapping", scope, () => adapter.instrumentMapping(), S.cold);
export const useSourceAccountMatrix = (scope?: QueryScope) =>
  useScopedQ("source_account_matrix", scope, () => adapter.sourceAccountMatrix(), S.slow);
