import type { PanelDataAdapter } from "./PanelDataAdapter";
import type {
  QueryScope,
  DashboardQuery,
  HeatmapQuery,
  SignalsQuery,
  OrdersQuery,
  PositionsQuery,
} from "../contracts";
import * as fx from "../fixtures";

/**
 * Supplies visual fixture data. isConnected is FALSE — the UI must never
 * claim a real backend is connected. Every method accepts the same typed
 * query DTO the real API adapter will accept, so switching adapters does
 * not change any call site. The fixture adapter ignores filter/scope
 * fields and always returns the full fixture set (clearly labelled).
 */
export class FixturePanelDataAdapter implements PanelDataAdapter {
  readonly isConnected = false;
  readonly kind = "fixture" as const;

  async listAccounts(_q?: QueryScope) {
    void _q;
    return [...fx.accounts];
  }
  async listSources(_q?: QueryScope) {
    void _q;
    return [...fx.sources];
  }
  async listSignals(_q?: SignalsQuery) {
    void _q;
    return [...fx.signals];
  }
  async listPositions(_q?: PositionsQuery) {
    void _q;
    return [...fx.positions];
  }
  async listOrders(_q?: OrdersQuery) {
    void _q;
    return [...fx.orders];
  }
  async dashboardKpis(_q?: DashboardQuery) {
    void _q;
    return { ...fx.kpis };
  }
  async pnlSeries(_q?: DashboardQuery) {
    void _q;
    return [...fx.pnlSeries];
  }
  async heatmap(_q?: HeatmapQuery) {
    void _q;
    return [...fx.heatmap];
  }
  async riskPolicyVersions(_q?: QueryScope) {
    void _q;
    return [...fx.riskPolicyVersions];
  }
  async telegramSession(_q?: QueryScope) {
    void _q;
    return { ...fx.telegramSession };
  }
  async runtimeComponents(_q?: QueryScope) {
    void _q;
    return [...fx.runtimeComponents];
  }
  async providers(_q?: QueryScope) {
    void _q;
    return [...fx.providers];
  }
  async inboxItems(_q?: QueryScope) {
    void _q;
    return [...fx.inboxItems];
  }
  async traces(_q?: QueryScope) {
    void _q;
    return [...fx.traces];
  }
  async hermesRecommendations(_q?: QueryScope) {
    void _q;
    return [...fx.hermesRecommendations];
  }
  async providerSlots(_q?: QueryScope) {
    void _q;
    return fx.providerSlots.map((s) => ({ ...s }));
  }
  async routingPolicy(_q?: QueryScope) {
    void _q;
    return { ...fx.routingPolicy };
  }
  async promptProfiles(_q?: QueryScope) {
    void _q;
    return [...fx.promptProfiles];
  }
  async nativeCurrencyReviews(_q?: QueryScope) {
    void _q;
    return [...fx.nativeCurrencyReviews];
  }
  async accountLines(_q?: QueryScope) {
    void _q;
    return [...fx.accountLines];
  }
  async accountReadiness(_q?: QueryScope) {
    void _q;
    return [...fx.accountReadiness];
  }
  async instrumentMapping(_q?: QueryScope) {
    void _q;
    return [...fx.instrumentMapping];
  }
  async sourceAccountMatrix(_q?: QueryScope) {
    void _q;
    return [...fx.sourceAccountMatrix];
  }
}
