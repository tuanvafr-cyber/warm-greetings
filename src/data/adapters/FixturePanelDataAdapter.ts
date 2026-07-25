import type { PanelDataAdapter } from "./PanelDataAdapter";
import * as fx from "../fixtures";

/**
 * Supplies visual fixture data. isConnected is FALSE — the UI must never
 * claim a real backend is connected. Fixture arrays are returned by value
 * so components cannot mutate the source of truth.
 */
export class FixturePanelDataAdapter implements PanelDataAdapter {
  readonly isConnected = false;
  readonly kind = "fixture" as const;

  async listAccounts() { return [...fx.accounts]; }
  async listSources() { return [...fx.sources]; }
  async listSignals() { return [...fx.signals]; }
  async listPositions() { return [...fx.positions]; }
  async listOrders() { return [...fx.orders]; }
  async dashboardKpis() { return { ...fx.kpis }; }
  async pnlSeries() { return [...fx.pnlSeries]; }
  async heatmap() { return [...fx.heatmap]; }
  async riskPolicyVersions() { return [...fx.riskPolicyVersions]; }
  async telegramSession() { return { ...fx.telegramSession }; }
  async runtimeComponents() { return [...fx.runtimeComponents]; }
  async providers() { return [...fx.providers]; }
  async inboxItems() { return [...fx.inboxItems]; }
  async traces() { return [...fx.traces]; }
  async hermesRecommendations() { return [...fx.hermesRecommendations]; }
}
