import type { PanelDataAdapter } from "./PanelDataAdapter";

/**
 * Explicit boundary for a real SignalOps backend adapter. This class
 * intentionally does NOT claim to be connected. Codex wires the actual
 * HTTP/WS transport here. Every method throws until wired — callers should
 * never construct this adapter in Panel Next without wiring.
 */
export class SignalOpsApiAdapter implements PanelDataAdapter {
  readonly isConnected = false;
  readonly kind = "api" as const;

  private notConnected(name: string): never {
    throw new Error(
      `SignalOpsApiAdapter.${name}() is not connected. ` +
        `Codex must wire the real SignalOps backend adapter before this method can be called.`,
    );
  }

  async listAccounts() { this.notConnected("listAccounts"); }
  async listSources() { this.notConnected("listSources"); }
  async listSignals() { this.notConnected("listSignals"); }
  async listPositions() { this.notConnected("listPositions"); }
  async listOrders() { this.notConnected("listOrders"); }
  async dashboardKpis() { this.notConnected("dashboardKpis"); }
  async pnlSeries() { this.notConnected("pnlSeries"); }
  async heatmap() { this.notConnected("heatmap"); }
  async riskPolicyVersions() { this.notConnected("riskPolicyVersions"); }
  async telegramSession() { this.notConnected("telegramSession"); }
  async runtimeComponents() { this.notConnected("runtimeComponents"); }
  async providers() { this.notConnected("providers"); }
  async inboxItems() { this.notConnected("inboxItems"); }
  async traces() { this.notConnected("traces"); }
  async hermesRecommendations() { this.notConnected("hermesRecommendations"); }
}
