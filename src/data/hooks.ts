import { keepPreviousData, useQuery, type QueryKey } from "@tanstack/react-query";
import { FixturePanelDataAdapter } from "./adapters/FixturePanelDataAdapter";
import type { PanelDataAdapter } from "./adapters/PanelDataAdapter";
import type {
  QueryScope,
  DashboardQuery,
  HeatmapQuery,
  SignalsQuery,
  OrdersQuery,
  PositionsQuery,
} from "./contracts";

// Panel Next ships with the visual fixture adapter. Codex swaps this for
// SignalOpsApiAdapter once the real backend is available.
const adapter: PanelDataAdapter = new FixturePanelDataAdapter();

export const usePanelAdapter = () => adapter;

export type { QueryScope, DashboardQuery, HeatmapQuery, SignalsQuery, OrdersQuery, PositionsQuery };

const useScopedQ = <T, Q extends QueryScope | undefined>(
  base: string,
  scope: Q,
  fn: (q: Q) => Promise<T>,
  staleTime: number,
) => {
  const key: QueryKey = [base, scope ?? null];
  return useQuery({
    queryKey: key,
    queryFn: () => fn(scope),
    staleTime,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
};

// Domain-appropriate stale times.
const S = {
  live: 5_000,
  fast: 15_000,
  normal: 30_000,
  slow: 60_000,
  cold: 5 * 60_000,
};

export const useAccounts = (scope?: QueryScope) =>
  useScopedQ("accounts", scope, (q) => adapter.listAccounts(q), S.slow);
export const useSources = (scope?: QueryScope) =>
  useScopedQ("sources", scope, (q) => adapter.listSources(q), S.normal);
export const useSignals = (scope?: SignalsQuery) =>
  useScopedQ("signals", scope, (q) => adapter.listSignals(q), S.fast);
export const usePositions = (scope?: PositionsQuery) =>
  useScopedQ("positions", scope, (q) => adapter.listPositions(q), S.live);
export const useOrders = (scope?: OrdersQuery) =>
  useScopedQ("orders", scope, (q) => adapter.listOrders(q), S.live);
export const useDashboardKpis = (scope?: DashboardQuery) =>
  useScopedQ("kpis", scope, (q) => adapter.dashboardKpis(q), S.normal);
export const usePnlSeries = (scope?: DashboardQuery) =>
  useScopedQ("pnl", scope, (q) => adapter.pnlSeries(q), S.normal);
export const useHeatmap = (scope?: HeatmapQuery) =>
  useScopedQ("heatmap", scope, (q) => adapter.heatmap(q), S.normal);
export const useRiskPolicyVersions = (scope?: QueryScope) =>
  useScopedQ("risk", scope, (q) => adapter.riskPolicyVersions(q), S.slow);
export const useTelegramSession = (scope?: QueryScope) =>
  useScopedQ("telegram", scope, (q) => adapter.telegramSession(q), S.live);
export const useRuntimeComponents = (scope?: QueryScope) =>
  useScopedQ("runtime", scope, (q) => adapter.runtimeComponents(q), S.slow);
export const useProviders = (scope?: QueryScope) =>
  useScopedQ("providers", scope, (q) => adapter.providers(q), S.slow);
export const useInboxItems = (scope?: QueryScope) =>
  useScopedQ("inbox", scope, (q) => adapter.inboxItems(q), S.fast);
export const useTraces = (scope?: QueryScope) =>
  useScopedQ("traces", scope, (q) => adapter.traces(q), S.fast);
export const useHermesRecommendations = (scope?: QueryScope) =>
  useScopedQ("hermes", scope, (q) => adapter.hermesRecommendations(q), S.normal);

export const useProviderSlots = (scope?: QueryScope) =>
  useScopedQ("provider_slots", scope, (q) => adapter.providerSlots(q), S.slow);
export const useRoutingPolicy = (scope?: QueryScope) =>
  useScopedQ("routing_policy", scope, (q) => adapter.routingPolicy(q), S.cold);
export const usePromptProfiles = (scope?: QueryScope) =>
  useScopedQ("prompt_profiles", scope, (q) => adapter.promptProfiles(q), S.cold);
export const useNativeCurrencyReviews = (scope?: QueryScope) =>
  useScopedQ("native_ccy_reviews", scope, (q) => adapter.nativeCurrencyReviews(q), S.normal);
export const useAccountLines = (scope?: QueryScope) =>
  useScopedQ("account_lines", scope, (q) => adapter.accountLines(q), S.slow);
export const useAccountReadiness = (scope?: QueryScope) =>
  useScopedQ("account_readiness", scope, (q) => adapter.accountReadiness(q), S.slow);
export const useInstrumentMapping = (scope?: QueryScope) =>
  useScopedQ("instrument_mapping", scope, (q) => adapter.instrumentMapping(q), S.cold);
export const useSourceAccountMatrix = (scope?: QueryScope) =>
  useScopedQ("source_account_matrix", scope, (q) => adapter.sourceAccountMatrix(q), S.slow);
