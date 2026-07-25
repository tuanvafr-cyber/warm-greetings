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
  QueryScope,
  DashboardQuery,
  HeatmapQuery,
  SignalsQuery,
  OrdersQuery,
  PositionsQuery,
} from "../contracts";

/**
 * Boundary between UI and any real SignalOps backend. UI code MUST NOT
 * import fixture arrays directly. Every method takes a typed query DTO
 * so account scope, time range, filters and cursor propagate all the
 * way from the URL / preferences to the adapter — not only into the
 * cache key.
 */
export interface PanelDataAdapter {
  readonly isConnected: boolean;
  readonly kind: "fixture" | "api";

  listAccounts(q?: QueryScope): Promise<Account[]>;
  listSources(q?: QueryScope): Promise<Source[]>;
  listSignals(q?: SignalsQuery): Promise<Signal[]>;
  listPositions(q?: PositionsQuery): Promise<Position[]>;
  listOrders(q?: OrdersQuery): Promise<Order[]>;
  dashboardKpis(q?: DashboardQuery): Promise<DashboardKpis>;
  pnlSeries(q?: DashboardQuery): Promise<PnlPoint[]>;
  heatmap(q?: HeatmapQuery): Promise<HeatmapBucket[]>;
  riskPolicyVersions(q?: QueryScope): Promise<RiskPolicyVersion[]>;
  telegramSession(q?: QueryScope): Promise<TelegramSession>;
  runtimeComponents(q?: QueryScope): Promise<RuntimeComponent[]>;
  providers(q?: QueryScope): Promise<Provider[]>;
  inboxItems(q?: QueryScope): Promise<InboxItem[]>;
  traces(q?: QueryScope): Promise<TraceRecord[]>;
  hermesRecommendations(q?: QueryScope): Promise<HermesRecommendation[]>;

  providerSlots(q?: QueryScope): Promise<ProviderSlot[]>;
  routingPolicy(q?: QueryScope): Promise<RoutingPolicy>;
  promptProfiles(q?: QueryScope): Promise<PromptProfile[]>;
  nativeCurrencyReviews(q?: QueryScope): Promise<NativeCurrencyReview[]>;
  accountLines(q?: QueryScope): Promise<AccountLine[]>;
  accountReadiness(q?: QueryScope): Promise<AccountReadiness[]>;
  instrumentMapping(q?: QueryScope): Promise<InstrumentMappingRow[]>;
  sourceAccountMatrix(q?: QueryScope): Promise<SourceAccountCell[]>;
}
