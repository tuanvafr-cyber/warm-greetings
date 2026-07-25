/**
 * SignalOps Panel — frontend data contracts.
 * UI components depend on these types via the PanelDataAdapter boundary,
 * NEVER on fixture arrays directly.
 */

export type Currency = "USD" | "USC";

export type AccountLifecycle =
  | "connected"
  | "offline"
  | "input_required"
  | "draining"
  | "archived";

export type Account = {
  id: string;
  login: string;
  server: string;
  broker: string;
  displayName: string;
  currency: Currency;
  lifecycle: AccountLifecycle;
  nativeBalance: number;
  nativeEquity: number;
  configuredNativeRiskAmount: number;
  openPositions: number;
  lastSyncAt: string; // ISO
  isPinned?: boolean;
};

export type SourceLifecycle =
  | "enabled"
  | "disabled"
  | "draining"
  | "archived"
  | "degraded";

export type Source = {
  id: string;
  displayName: string;
  telegramIdentity: string;
  parserProfile: string;
  parserVersion: string;
  symbolProfile: string;
  lifecycle: SourceLifecycle;
  realtime: boolean;
  history: boolean;
  lastSignalAt: string | null;
  lastCheckedAt: string;
  openLifecycleCount: number;
  // Perf
  signalWinRate: number;
  orderWinRate: number;
  netPnlUsd: number;
  todayPnlUsd: number;
  netPips: number;
  totalOrders: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  rr: number;
  maxDrawdownUsd: number;
  executionRate: number;
  technicalFailureRate: number;
  avgLatencyMs: number;
  bestSymbol: string;
  bestHour: number;
};

export type SignalStatus =
  | "parsed"
  | "deduped"
  | "risk_blocked"
  | "policy_blocked"
  | "executed"
  | "partial"
  | "technical_failed";

export type Signal = {
  id: string;
  correlationId: string;
  sourceId: string;
  sourceName: string;
  symbol: string;
  side: "buy" | "sell";
  status: SignalStatus;
  receivedAt: string;
  parsedEntry: number | null;
  parsedSl: number | null;
  parsedTp: number | null;
  parserProfile: string;
  parserVersion: string;
  reasonCode: string | null;
  reason: string | null;
  originalText: string;
  relatedOrderIds: string[];
  destinationAccountIds: string[];
};

export type Position = {
  id: string;
  ticket: string;
  correlationId: string;
  accountId: string;
  accountLabel: string;
  sourceId: string;
  sourceName: string;
  symbol: string;
  side: "buy" | "sell";
  entryPrice: number;
  currentPrice: number;
  sl: number | null;
  tp: number | null;
  nativeVolume: number;
  floatingPnlUsd: number;
  pips: number;
  status: "open" | "pending";
  openedAt: string;
};

export type OrderResult = "win" | "loss" | "break_even" | "pending";
export type OrderStatus = "closed" | "canceled" | "expired" | "rejected" | "pending";

export type Order = {
  id: string;
  ticket: string;
  correlationId: string;
  accountId: string;
  accountLabel: string;
  sourceId: string;
  sourceName: string;
  symbol: string;
  side: "buy" | "sell";
  openedAt: string;
  closedAt: string;
  entryPrice: number;
  closePrice: number;
  nativeVolume: number;
  pips: number;
  netPnlUsd: number;
  result: OrderResult;
  status: OrderStatus;
};

export type HeatmapBucket = {
  date: string; // YYYY-MM-DD
  hour: number; // 0..23
  orderCount: number;
  winCount: number;
  lossCount: number;
  unresolvedCount: number;
  netPnlUsd: number;
  netPips: number;
  topSource: string | null;
};

export type PnlPoint = { t: string; pnl: number; equity: number; balance: number };

export type DashboardKpis = {
  tradingPnlUsd: number;
  totalIncomeUsd: number;
  activeExposureUsd: number;
  openPositions: number;
  pendingOrders: number;
  floatingPnlUsd: number;
  marginUsedUsd: number;
  eligibleSignals: number;
  executedSignals: number;
  blockedSignals: number;
  technicalFailedSignals: number;
  executionRate: number;
};

export type RiskPolicyVersion = {
  version: number;
  createdAt: string;
  author: string;
  nativeRiskAmount: number;
  nativeCurrency: Currency;
  dailyLossLimitUsd: number;
  drawdownLimitUsd: number;
  marginBufferPct: number;
  riskBudgetUsd: number;
  notes: string;
};

export type TelegramState =
  | "config_missing"
  | "api_id_missing"
  | "api_hash_missing"
  | "auth_required"
  | "code_sent"
  | "otp_required"
  | "invalid_otp"
  | "twofa_required"
  | "ready"
  | "degraded"
  | "disconnected"
  | "revoked";

export type TelegramSession = {
  state: TelegramState;
  identity: {
    phone: string | null;
    username: string | null;
    displayName: string | null;
  };
  lastEventAt: string | null;
  apiIdSet: boolean;
  apiHashSet: boolean;
};

export type ComponentHealth =
  | "healthy"
  | "degraded"
  | "input_required"
  | "blocked"
  | "stale"
  | "unavailable";

export type RuntimeComponent = {
  id: string;
  name: string;
  kind: "panel_api" | "core" | "bridge" | "worker" | "telegram" | "mt5" | "database";
  health: ComponentHealth;
  version: string;
  lastRestartAt: string | null;
  lastHealthyAt: string | null;
  detail: string;
};

export type ProviderState =
  | "inactive"
  | "testing"
  | "ready"
  | "active"
  | "degraded"
  | "archived";

export type Provider = {
  id: string;
  name: string;
  kind: string;
  state: ProviderState;
  endpointMasked: string;
  addedAt: string;
  lastTestedAt: string | null;
};

export type InboxSeverity = "info" | "warning" | "blocker" | "critical";

export type InboxItem = {
  id: string;
  correlationId: string;
  severity: InboxSeverity;
  component: string;
  kind:
    | "telegram_auth"
    | "source_identity"
    | "parser_missing"
    | "symbol_mapping_missing"
    | "account_identity_changed"
    | "runtime_degraded"
    | "migration_failure"
    | "broker_unknown"
    | "reconciliation"
    | "signal_blocked"
    | "update_rollback"
    | "provider_degraded";
  title: string;
  detail: string;
  createdAt: string;
  state: "open" | "acknowledged";
  entityKind: "signal" | "order" | "account" | "source" | "runtime" | "provider" | null;
  entityId: string | null;
};

export type TraceStep = {
  step:
    | "telegram"
    | "parser"
    | "normalized"
    | "dedupe"
    | "risk"
    | "sizing"
    | "gate"
    | "broker"
    | "lifecycle"
    | "final";
  at: string;
  outcome: "ok" | "blocked" | "error" | "pending";
  component: string;
  detail: string;
  payloadRedacted: Record<string, unknown>;
};

export type TraceRecord = {
  correlationId: string;
  accountId: string | null;
  sourceId: string | null;
  signalId: string | null;
  orderId: string | null;
  createdAt: string;
  steps: TraceStep[];
};

export type HermesRecommendation = {
  id: string;
  sourceId: string;
  accountId: string;
  kind: "activate" | "deactivate" | "size_change" | "policy";
  rationale: string;
  confidence: number;
  createdAt: string;
  state: "pending" | "reviewed" | "archived";
};
