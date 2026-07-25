import type {
  Account, DashboardKpis, HeatmapBucket, HermesRecommendation, InboxItem,
  Order, PnlPoint, Position, Provider, RiskPolicyVersion, RuntimeComponent,
  Signal, Source, TelegramSession, TraceRecord,
} from "../contracts";

/**
 * Boundary between UI and any real SignalOps backend. UI code MUST NOT
 * import fixture arrays directly. Implementations live in ./FixturePanelDataAdapter
 * (visual review) and ./SignalOpsApiAdapter (Codex wires the real backend).
 */
export interface PanelDataAdapter {
  readonly isConnected: boolean;
  readonly kind: "fixture" | "api";

  listAccounts(): Promise<Account[]>;
  listSources(): Promise<Source[]>;
  listSignals(): Promise<Signal[]>;
  listPositions(): Promise<Position[]>;
  listOrders(): Promise<Order[]>;
  dashboardKpis(): Promise<DashboardKpis>;
  pnlSeries(): Promise<PnlPoint[]>;
  heatmap(): Promise<HeatmapBucket[]>;
  riskPolicyVersions(): Promise<RiskPolicyVersion[]>;
  telegramSession(): Promise<TelegramSession>;
  runtimeComponents(): Promise<RuntimeComponent[]>;
  providers(): Promise<Provider[]>;
  inboxItems(): Promise<InboxItem[]>;
  traces(): Promise<TraceRecord[]>;
  hermesRecommendations(): Promise<HermesRecommendation[]>;
}
