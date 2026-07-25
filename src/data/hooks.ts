import { useQuery } from "@tanstack/react-query";
import { FixturePanelDataAdapter } from "./adapters/FixturePanelDataAdapter";
import type { PanelDataAdapter } from "./adapters/PanelDataAdapter";

// Panel Next ships with the visual fixture adapter. Codex swaps this for
// SignalOpsApiAdapter once the real backend is available.
const adapter: PanelDataAdapter = new FixturePanelDataAdapter();

export const usePanelAdapter = () => adapter;

const q = <T,>(key: string, fn: () => Promise<T>) =>
  useQuery({ queryKey: [key], queryFn: fn, staleTime: 30_000 });

export const useAccounts = () => q("accounts", () => adapter.listAccounts());
export const useSources = () => q("sources", () => adapter.listSources());
export const useSignals = () => q("signals", () => adapter.listSignals());
export const usePositions = () => q("positions", () => adapter.listPositions());
export const useOrders = () => q("orders", () => adapter.listOrders());
export const useDashboardKpis = () => q("kpis", () => adapter.dashboardKpis());
export const usePnlSeries = () => q("pnl", () => adapter.pnlSeries());
export const useHeatmap = () => q("heatmap", () => adapter.heatmap());
export const useRiskPolicyVersions = () => q("risk", () => adapter.riskPolicyVersions());
export const useTelegramSession = () => q("telegram", () => adapter.telegramSession());
export const useRuntimeComponents = () => q("runtime", () => adapter.runtimeComponents());
export const useProviders = () => q("providers", () => adapter.providers());
export const useInboxItems = () => q("inbox", () => adapter.inboxItems());
export const useTraces = () => q("traces", () => adapter.traces());
export const useHermesRecommendations = () => q("hermes", () => adapter.hermesRecommendations());
