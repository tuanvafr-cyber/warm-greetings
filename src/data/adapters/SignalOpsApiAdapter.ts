import type { PanelDataAdapter } from "./PanelDataAdapter";
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
 * Explicit boundary for a real SignalOps backend adapter. This class
 * intentionally does NOT claim to be connected. Codex wires the actual
 * HTTP/WS transport here. Every method rejects until wired.
 */
export class SignalOpsApiAdapter implements PanelDataAdapter {
  readonly isConnected = false;
  readonly kind = "api" as const;

  private nc<T>(name: string): Promise<T> {
    return Promise.reject(
      new Error(
        `SignalOpsApiAdapter.${name}() is not connected. ` +
          `Codex must wire the real SignalOps backend adapter before this method can be called.`,
      ),
    );
  }

  listAccounts(_q?: QueryScope): Promise<Account[]> {
    void _q;
    return this.nc("listAccounts");
  }
  listSources(_q?: QueryScope): Promise<Source[]> {
    void _q;
    return this.nc("listSources");
  }
  listSignals(_q?: SignalsQuery): Promise<Signal[]> {
    void _q;
    return this.nc("listSignals");
  }
  listPositions(_q?: PositionsQuery): Promise<Position[]> {
    void _q;
    return this.nc("listPositions");
  }
  listOrders(_q?: OrdersQuery): Promise<Order[]> {
    void _q;
    return this.nc("listOrders");
  }
  dashboardKpis(_q?: DashboardQuery): Promise<DashboardKpis> {
    void _q;
    return this.nc("dashboardKpis");
  }
  pnlSeries(_q?: DashboardQuery): Promise<PnlPoint[]> {
    void _q;
    return this.nc("pnlSeries");
  }
  heatmap(_q?: HeatmapQuery): Promise<HeatmapBucket[]> {
    void _q;
    return this.nc("heatmap");
  }
  riskPolicyVersions(_q?: QueryScope): Promise<RiskPolicyVersion[]> {
    void _q;
    return this.nc("riskPolicyVersions");
  }
  telegramSession(_q?: QueryScope): Promise<TelegramSession> {
    void _q;
    return this.nc("telegramSession");
  }
  runtimeComponents(_q?: QueryScope): Promise<RuntimeComponent[]> {
    void _q;
    return this.nc("runtimeComponents");
  }
  providers(_q?: QueryScope): Promise<Provider[]> {
    void _q;
    return this.nc("providers");
  }
  inboxItems(_q?: QueryScope): Promise<InboxItem[]> {
    void _q;
    return this.nc("inboxItems");
  }
  traces(_q?: QueryScope): Promise<TraceRecord[]> {
    void _q;
    return this.nc("traces");
  }
  hermesRecommendations(_q?: QueryScope): Promise<HermesRecommendation[]> {
    void _q;
    return this.nc("hermesRecommendations");
  }
  providerSlots(_q?: QueryScope): Promise<ProviderSlot[]> {
    void _q;
    return this.nc("providerSlots");
  }
  routingPolicy(_q?: QueryScope): Promise<RoutingPolicy> {
    void _q;
    return this.nc("routingPolicy");
  }
  promptProfiles(_q?: QueryScope): Promise<PromptProfile[]> {
    void _q;
    return this.nc("promptProfiles");
  }
  nativeCurrencyReviews(_q?: QueryScope): Promise<NativeCurrencyReview[]> {
    void _q;
    return this.nc("nativeCurrencyReviews");
  }
  accountLines(_q?: QueryScope): Promise<AccountLine[]> {
    void _q;
    return this.nc("accountLines");
  }
  accountReadiness(_q?: QueryScope): Promise<AccountReadiness[]> {
    void _q;
    return this.nc("accountReadiness");
  }
  instrumentMapping(_q?: QueryScope): Promise<InstrumentMappingRow[]> {
    void _q;
    return this.nc("instrumentMapping");
  }
  sourceAccountMatrix(_q?: QueryScope): Promise<SourceAccountCell[]> {
    void _q;
    return this.nc("sourceAccountMatrix");
  }
}
