import type { PanelDataAdapter } from "./PanelDataAdapter";
import type {
  Account, DashboardKpis, HeatmapBucket, HermesRecommendation, InboxItem,
  Order, PnlPoint, Position, Provider, RiskPolicyVersion, RuntimeComponent,
  Signal, Source, TelegramSession, TraceRecord,
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

  listAccounts(): Promise<Account[]> { return this.nc("listAccounts"); }
  listSources(): Promise<Source[]> { return this.nc("listSources"); }
  listSignals(): Promise<Signal[]> { return this.nc("listSignals"); }
  listPositions(): Promise<Position[]> { return this.nc("listPositions"); }
  listOrders(): Promise<Order[]> { return this.nc("listOrders"); }
  dashboardKpis(): Promise<DashboardKpis> { return this.nc("dashboardKpis"); }
  pnlSeries(): Promise<PnlPoint[]> { return this.nc("pnlSeries"); }
  heatmap(): Promise<HeatmapBucket[]> { return this.nc("heatmap"); }
  riskPolicyVersions(): Promise<RiskPolicyVersion[]> { return this.nc("riskPolicyVersions"); }
  telegramSession(): Promise<TelegramSession> { return this.nc("telegramSession"); }
  runtimeComponents(): Promise<RuntimeComponent[]> { return this.nc("runtimeComponents"); }
  providers(): Promise<Provider[]> { return this.nc("providers"); }
  inboxItems(): Promise<InboxItem[]> { return this.nc("inboxItems"); }
  traces(): Promise<TraceRecord[]> { return this.nc("traces"); }
  hermesRecommendations(): Promise<HermesRecommendation[]> { return this.nc("hermesRecommendations"); }
}
