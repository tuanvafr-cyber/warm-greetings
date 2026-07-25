import { useQuery } from "@tanstack/react-query";
import { FixturePanelDataAdapter } from "./adapters/FixturePanelDataAdapter";
import type { PanelDataAdapter } from "./adapters/PanelDataAdapter";

// Panel Next ships with the visual fixture adapter. Codex swaps this for
// SignalOpsApiAdapter once the real backend is available.
const adapter: PanelDataAdapter = new FixturePanelDataAdapter();

export const usePanelAdapter = () => adapter;

const useQ = <T>(key: string, fn: () => Promise<T>) =>
  useQuery({ queryKey: [key], queryFn: fn, staleTime: 30_000 });

export const useAccounts = () => useQ("accounts", () => adapter.listAccounts());
export const useSources = () => useQ("sources", () => adapter.listSources());
export const useSignals = () => useQ("signals", () => adapter.listSignals());
export const usePositions = () => useQ("positions", () => adapter.listPositions());
export const useOrders = () => useQ("orders", () => adapter.listOrders());
export const useDashboardKpis = () => useQ("kpis", () => adapter.dashboardKpis());
export const usePnlSeries = () => useQ("pnl", () => adapter.pnlSeries());
export const useHeatmap = () => useQ("heatmap", () => adapter.heatmap());
export const useRiskPolicyVersions = () => useQ("risk", () => adapter.riskPolicyVersions());
export const useTelegramSession = () => useQ("telegram", () => adapter.telegramSession());
export const useRuntimeComponents = () => useQ("runtime", () => adapter.runtimeComponents());
export const useProviders = () => useQ("providers", () => adapter.providers());
export const useInboxItems = () => useQ("inbox", () => adapter.inboxItems());
export const useTraces = () => useQ("traces", () => adapter.traces());
export const useHermesRecommendations = () => useQ("hermes", () => adapter.hermesRecommendations());

export const useProviderSlots = () => useQ("provider_slots", () => adapter.providerSlots());
export const useRoutingPolicy = () => useQ("routing_policy", () => adapter.routingPolicy());
export const usePromptProfiles = () => useQ("prompt_profiles", () => adapter.promptProfiles());
export const useNativeCurrencyReviews = () =>
  useQ("native_ccy_reviews", () => adapter.nativeCurrencyReviews());
export const useAccountLines = () => useQ("account_lines", () => adapter.accountLines());
export const useAccountReadiness = () =>
  useQ("account_readiness", () => adapter.accountReadiness());
export const useInstrumentMapping = () =>
  useQ("instrument_mapping", () => adapter.instrumentMapping());
export const useSourceAccountMatrix = () =>
  useQ("source_account_matrix", () => adapter.sourceAccountMatrix());
