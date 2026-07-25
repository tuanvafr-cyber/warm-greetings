import type {
  Account,
  DashboardKpis,
  HeatmapBucket,
  HermesRecommendation,
  InboxItem,
  Order,
  PnlPoint,
  Position,
  Provider,
  RiskPolicyVersion,
  RuntimeComponent,
  Signal,
  Source,
  TelegramSession,
  TraceRecord,
  ProviderSlot,
  RoutingPolicy,
  PromptProfile,
  NativeCurrencyReview,
  AccountLine,
  AccountReadiness,
  InstrumentMappingRow,
  SourceAccountCell,
} from "../contracts";

/**
 * Boundary between UI and any real SignalOps backend. UI code MUST NOT
 * import fixture arrays directly.
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

  // New surfaces
  providerSlots(): Promise<ProviderSlot[]>;
  routingPolicy(): Promise<RoutingPolicy>;
  promptProfiles(): Promise<PromptProfile[]>;
  nativeCurrencyReviews(): Promise<NativeCurrencyReview[]>;
  accountLines(): Promise<AccountLine[]>;
  accountReadiness(): Promise<AccountReadiness[]>;
  instrumentMapping(): Promise<InstrumentMappingRow[]>;
  sourceAccountMatrix(): Promise<SourceAccountCell[]>;
}
