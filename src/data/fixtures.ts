/**
 * Visual fixture data — clearly marked. Never treated as live machine state.
 * Consumed exclusively by FixturePanelDataAdapter.
 */
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
} from "./contracts";

export const FIXTURE_META = {
  visual_fixture_only: true as const,
  not_live_data: true as const,
  backend_required: true as const,
};

export const accounts: Account[] = [
  {
    id: "acc-usc-001",
    login: "5209 1187",
    server: "ExnessCent-Real9",
    broker: "Exness",
    displayName: "USC-001 · Alpha",
    currency: "USC",
    lifecycle: "connected",
    nativeBalance: 258_400,
    nativeEquity: 261_120,
    configuredNativeRiskAmount: 2000,
    openPositions: 3,
    lastSyncAt: new Date(Date.now() - 45_000).toISOString(),
    isPinned: true,
  },
  {
    id: "acc-usc-002",
    login: "5209 1244",
    server: "ExnessCent-Real9",
    broker: "Exness",
    displayName: "USC-002 · Beta",
    currency: "USC",
    lifecycle: "draining",
    nativeBalance: 118_050,
    nativeEquity: 117_930,
    configuredNativeRiskAmount: 1500,
    openPositions: 1,
    lastSyncAt: new Date(Date.now() - 3 * 60_000).toISOString(),
  },
  {
    id: "acc-usd-101",
    login: "77 224 118",
    server: "IC-Live-04",
    broker: "IC Markets",
    displayName: "USD-101 · Live",
    currency: "USD",
    lifecycle: "connected",
    nativeBalance: 12_480,
    nativeEquity: 12_612,
    configuredNativeRiskAmount: 100,
    openPositions: 2,
    lastSyncAt: new Date(Date.now() - 20_000).toISOString(),
  },
  {
    id: "acc-usd-104",
    login: "77 224 993",
    server: "IC-Live-04",
    broker: "IC Markets",
    displayName: "USD-104 · Diagnostic",
    currency: "USD",
    lifecycle: "input_required",
    nativeBalance: 5_020,
    nativeEquity: 5_020,
    configuredNativeRiskAmount: 50,
    openPositions: 0,
    lastSyncAt: new Date(Date.now() - 40 * 60_000).toISOString(),
  },
  {
    id: "acc-usd-off",
    login: "77 225 771",
    server: "IC-Live-02",
    broker: "IC Markets",
    displayName: "USD-002 · Standby",
    currency: "USD",
    lifecycle: "offline",
    nativeBalance: 8_940,
    nativeEquity: 8_940,
    configuredNativeRiskAmount: 75,
    openPositions: 0,
    lastSyncAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
  },
  {
    id: "acc-archived-77",
    login: "5209 0088",
    server: "ExnessCent-Real9",
    broker: "Exness",
    displayName: "USC-ARC-01 · Legacy",
    currency: "USC",
    lifecycle: "archived",
    nativeBalance: 0,
    nativeEquity: 0,
    configuredNativeRiskAmount: 1000,
    openPositions: 0,
    lastSyncAt: new Date(Date.now() - 30 * 86400_000).toISOString(),
  },
];

export const sources: Source[] = [
  mkSource({
    id: "src-goldwave",
    name: "GoldWave FX",
    tg: "@goldwave_fx",
    lifecycle: "enabled",
    parser: "gold_v3",
    parserVersion: "3.4.2",
    symbols: "XAUUSD",
    realtime: true,
    history: true,
    win: 0.62,
    orderWin: 0.58,
    net: 42_580,
    today: 1180,
    pips: 3120,
    orders: 486,
    pf: 2.3,
    avgW: 42,
    avgL: 18,
    rr: 2.3,
    dd: 3_200,
    exec: 0.93,
    techFail: 0.02,
    lat: 380,
    best: "XAUUSD",
    hour: 9,
    open: 2,
  }),
  mkSource({
    id: "src-bluepips",
    name: "BluePips VIP",
    tg: "@bluepips_vip",
    lifecycle: "enabled",
    parser: "generic_v2",
    parserVersion: "2.1.0",
    symbols: "XAUUSD, EURUSD",
    realtime: true,
    history: true,
    win: 0.51,
    orderWin: 0.49,
    net: 18_720,
    today: -220,
    pips: 1140,
    orders: 312,
    pf: 1.35,
    avgW: 30,
    avgL: 22,
    rr: 1.4,
    dd: 4_100,
    exec: 0.87,
    techFail: 0.04,
    lat: 520,
    best: "EURUSD",
    hour: 14,
    open: 1,
  }),
  mkSource({
    id: "src-hermes-b",
    name: "Hermes Alpha B",
    tg: "@hermes_alpha_b",
    lifecycle: "disabled",
    parser: "gold_v3",
    parserVersion: "3.3.1",
    symbols: "XAUUSD",
    realtime: true,
    history: false,
    win: 0.48,
    orderWin: 0.44,
    net: -1_240,
    today: 0,
    pips: -420,
    orders: 174,
    pf: 0.86,
    avgW: 21,
    avgL: 30,
    rr: 0.9,
    dd: 5_800,
    exec: 0.71,
    techFail: 0.08,
    lat: 940,
    best: "XAUUSD",
    hour: 22,
    open: 0,
  }),
  mkSource({
    id: "src-eu-flow",
    name: "EU Flow Desk",
    tg: "@eu_flow_desk",
    lifecycle: "degraded",
    parser: "eu_v1",
    parserVersion: "1.4.7",
    symbols: "EURUSD, GBPUSD",
    realtime: true,
    history: true,
    win: 0.57,
    orderWin: 0.55,
    net: 6_320,
    today: 180,
    pips: 512,
    orders: 141,
    pf: 1.62,
    avgW: 24,
    avgL: 16,
    rr: 1.7,
    dd: 1_920,
    exec: 0.79,
    techFail: 0.11,
    lat: 1120,
    best: "EURUSD",
    hour: 10,
    open: 3,
  }),
  mkSource({
    id: "src-drain",
    name: "SwiftSignals",
    tg: "@swiftsignals",
    lifecycle: "draining",
    parser: "generic_v2",
    parserVersion: "2.0.4",
    symbols: "XAUUSD",
    realtime: false,
    history: true,
    win: 0.44,
    orderWin: 0.41,
    net: -840,
    today: 0,
    pips: -220,
    orders: 88,
    pf: 0.94,
    avgW: 19,
    avgL: 21,
    rr: 0.9,
    dd: 2_100,
    exec: 0.68,
    techFail: 0.05,
    lat: 780,
    best: "XAUUSD",
    hour: 3,
    open: 4,
  }),
  mkSource({
    id: "src-arc-1",
    name: "OldOracle",
    tg: "@oldoracle",
    lifecycle: "archived",
    parser: "legacy_v1",
    parserVersion: "1.0.0",
    symbols: "XAUUSD",
    realtime: false,
    history: false,
    win: 0.39,
    orderWin: 0.37,
    net: -8_140,
    today: 0,
    pips: -1_820,
    orders: 512,
    pf: 0.62,
    avgW: 14,
    avgL: 26,
    rr: 0.5,
    dd: 12_400,
    exec: 0.55,
    techFail: 0.15,
    lat: 1_800,
    best: "XAUUSD",
    hour: 1,
    open: 0,
  }),
];

function mkSource(x: {
  id: string;
  name: string;
  tg: string;
  lifecycle: Source["lifecycle"];
  parser: string;
  parserVersion: string;
  symbols: string;
  realtime: boolean;
  history: boolean;
  win: number;
  orderWin: number;
  net: number;
  today: number;
  pips: number;
  orders: number;
  pf: number;
  avgW: number;
  avgL: number;
  rr: number;
  dd: number;
  exec: number;
  techFail: number;
  lat: number;
  best: string;
  hour: number;
  open: number;
}): Source {
  return {
    id: x.id,
    displayName: x.name,
    telegramIdentity: x.tg,
    parserProfile: x.parser,
    parserVersion: x.parserVersion,
    symbolProfile: x.symbols,
    lifecycle: x.lifecycle,
    realtime: x.realtime,
    history: x.history,
    lastSignalAt:
      x.lifecycle === "archived"
        ? null
        : new Date(Date.now() - Math.random() * 4 * 3600_000).toISOString(),
    lastCheckedAt: new Date(Date.now() - 60_000).toISOString(),
    openLifecycleCount: x.open,
    signalWinRate: x.win,
    orderWinRate: x.orderWin,
    netPnlUsd: x.net,
    todayPnlUsd: x.today,
    netPips: x.pips,
    totalOrders: x.orders,
    profitFactor: x.pf,
    avgWin: x.avgW,
    avgLoss: x.avgL,
    rr: x.rr,
    maxDrawdownUsd: x.dd,
    executionRate: x.exec,
    technicalFailureRate: x.techFail,
    avgLatencyMs: x.lat,
    bestSymbol: x.best,
    bestHour: x.hour,
  };
}

export const signals: Signal[] = Array.from({ length: 24 }).map((_, i) => {
  const statuses: Signal["status"][] = [
    "executed",
    "executed",
    "executed",
    "parsed",
    "deduped",
    "risk_blocked",
    "policy_blocked",
    "technical_failed",
    "partial",
  ];
  const status = statuses[i % statuses.length];
  const src = sources[i % sources.length];
  const symbol = i % 3 === 0 ? "XAUUSD" : i % 3 === 1 ? "EURUSD" : "GBPUSD";
  const side: "buy" | "sell" = i % 2 ? "buy" : "sell";
  return {
    id: `sig-${1000 + i}`,
    correlationId: `cor-${(200000 + i).toString(16)}`,
    sourceId: src.id,
    sourceName: src.displayName,
    symbol,
    side,
    status,
    receivedAt: new Date(Date.now() - i * 22 * 60_000).toISOString(),
    parsedEntry: symbol === "XAUUSD" ? 2380.5 + i * 0.4 : 1.084 + i * 0.0002,
    parsedSl: symbol === "XAUUSD" ? 2374.5 + i * 0.4 : 1.081 + i * 0.0002,
    parsedTp: symbol === "XAUUSD" ? 2392.5 + i * 0.4 : 1.09 + i * 0.0002,
    parserProfile: src.parserProfile,
    parserVersion: src.parserVersion,
    reasonCode:
      status === "risk_blocked"
        ? "RISK_DAILY_LIMIT"
        : status === "policy_blocked"
          ? "POLICY_SYMBOL_DISABLED"
          : status === "technical_failed"
            ? "BROKER_TIMEOUT"
            : status === "deduped"
              ? "DEDUPE_MATCH"
              : null,
    reason:
      status === "risk_blocked"
        ? "Daily loss limit reached for scope."
        : status === "policy_blocked"
          ? "Symbol disabled by risk policy."
          : status === "technical_failed"
            ? "Broker did not confirm within timeout."
            : status === "deduped"
              ? "Matches a signal accepted 42s earlier."
              : null,
    originalText: `${symbol} ${side.toUpperCase()} @${(2380.5 + i * 0.4).toFixed(2)}\nSL 2374.5 · TP 2392.5`,
    relatedOrderIds: status === "executed" || status === "partial" ? [`ord-${2000 + i}`] : [],
    destinationAccountIds: [accounts[i % 3].id],
  };
});

export const positions: Position[] = Array.from({ length: 8 }).map((_, i) => {
  const acc = accounts[i % 3];
  const src = sources[i % sources.length];
  const symbol = i % 2 === 0 ? "XAUUSD" : "EURUSD";
  const side: "buy" | "sell" = i % 2 ? "sell" : "buy";
  const entry = symbol === "XAUUSD" ? 2380 + i * 1.5 : 1.083 + i * 0.001;
  const cur = entry + (side === "buy" ? 1 : -1) * (i % 3 === 0 ? 1.2 : -0.4);
  const pips =
    symbol === "XAUUSD" ? Math.round((cur - entry) / 0.1) : Math.round((cur - entry) * 10000);
  return {
    id: `pos-${300 + i}`,
    ticket: `${71_200_000 + i}`,
    correlationId: `cor-${(200000 + i).toString(16)}`,
    accountId: acc.id,
    accountLabel: acc.displayName,
    sourceId: src.id,
    sourceName: src.displayName,
    symbol,
    side,
    entryPrice: entry,
    currentPrice: cur,
    sl: entry - (side === "buy" ? 3 : -3),
    tp: entry + (side === "buy" ? 6 : -6),
    nativeVolume: acc.currency === "USC" ? 2000 : 0.05,
    floatingPnlUsd: pips * (symbol === "XAUUSD" ? 0.12 : 0.08) * (side === "buy" ? 1 : -1),
    pips,
    status: i === 7 ? "pending" : "open",
    openedAt: new Date(Date.now() - (i + 1) * 47 * 60_000).toISOString(),
  };
});

export const orders: Order[] = Array.from({ length: 60 }).map((_, i) => {
  const acc = accounts[i % 3];
  const src = sources[i % sources.length];
  const symbol = i % 3 === 0 ? "XAUUSD" : i % 3 === 1 ? "EURUSD" : "GBPUSD";
  const side: "buy" | "sell" = i % 2 ? "sell" : "buy";
  const entry = symbol === "XAUUSD" ? 2350 + i * 0.5 : 1.08 + i * 0.001;
  const close = entry + (i % 4 === 0 ? -1.4 : i % 4 === 1 ? 2.1 : i % 4 === 2 ? 0.02 : -0.6);
  const pips =
    symbol === "XAUUSD" ? Math.round((close - entry) / 0.1) : Math.round((close - entry) * 10000);
  const pnl = pips * (symbol === "XAUUSD" ? 0.11 : 0.09) * (side === "buy" ? 1 : -1);
  const result: Order["result"] = pnl > 5 ? "win" : pnl < -5 ? "loss" : "break_even";
  return {
    id: `ord-${2000 + i}`,
    ticket: `${71_100_000 + i}`,
    correlationId: `cor-${(200000 + (i % 24)).toString(16)}`,
    accountId: acc.id,
    accountLabel: acc.displayName,
    sourceId: src.id,
    sourceName: src.displayName,
    symbol,
    side,
    openedAt: new Date(Date.now() - (i + 1) * 3 * 3600_000).toISOString(),
    closedAt: new Date(Date.now() - (i + 1) * 2.9 * 3600_000).toISOString(),
    entryPrice: entry,
    closePrice: close,
    nativeVolume: acc.currency === "USC" ? 2000 : 0.05,
    pips,
    netPnlUsd: pnl,
    result,
    status: "closed",
  };
});

export const kpis: DashboardKpis = {
  tradingPnlUsd: 4820.44,
  totalIncomeUsd: 5432.1,
  activeExposureUsd: 8_940,
  openPositions: 3,
  pendingOrders: 1,
  floatingPnlUsd: 218.4,
  marginUsedUsd: 1_120,
  marginUsagePct: 12.4, // marginUsedUsd / equityUsd, read-only reporting only
  freeMarginNative: 7_820,
  freeMarginReportingUsd: 7_820,
  eligibleSignals: 128,
  executedSignals: 112,
  blockedSignals: 9,
  technicalFailedSignals: 7,
  executionRate: 112 / 128,
};

export const pnlSeries: PnlPoint[] = Array.from({ length: 30 }).map((_, i) => {
  const balance = 12_000 + Math.sin(i / 3) * 320 + i * 40;
  const equity = balance + Math.sin(i / 2) * 90;
  return {
    t: new Date(Date.now() - (29 - i) * 86400_000).toISOString().slice(0, 10),
    pnl: (i - 5) * 42 + Math.sin(i) * 80,
    equity,
    balance,
  };
});

export const heatmap: HeatmapBucket[] = (() => {
  const buckets: HeatmapBucket[] = [];
  for (let d = 0; d < 14; d++) {
    const date = new Date(Date.now() - (13 - d) * 86400_000).toISOString().slice(0, 10);
    for (let h = 0; h < 24; h++) {
      const active = h >= 6 && h <= 22 && Math.random() > 0.55;
      if (!active) continue;
      const orderCount = 1 + Math.floor(Math.random() * 6);
      const win = Math.floor(Math.random() * orderCount);
      const loss = orderCount - win - (Math.random() > 0.8 ? 1 : 0);
      const unresolved = Math.max(0, orderCount - win - loss);
      const net = (win - loss) * (10 + Math.random() * 40);
      buckets.push({
        date,
        hour: h,
        orderCount,
        winCount: win,
        lossCount: Math.max(0, loss),
        unresolvedCount: unresolved,
        netPnlUsd: net,
        netPips: net * 0.9,
        topSource: sources[Math.floor(Math.random() * 4)].displayName,
      });
    }
  }
  return buckets;
})();

export const riskPolicyVersions: RiskPolicyVersion[] = [
  {
    version: 7,
    createdAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
    author: "operator@signalops",
    nativeRiskAmount: 2000,
    nativeCurrency: "USC",
    dailyLossLimitUsd: 120,
    drawdownLimitUsd: 400,
    marginBufferPct: 25,
    riskBudgetUsd: 260,
    notes: "Trim daily loss after Wed spike.",
  },
  {
    version: 6,
    createdAt: new Date(Date.now() - 12 * 86400_000).toISOString(),
    author: "operator@signalops",
    nativeRiskAmount: 2500,
    nativeCurrency: "USC",
    dailyLossLimitUsd: 160,
    drawdownLimitUsd: 500,
    marginBufferPct: 20,
    riskBudgetUsd: 320,
    notes: "Baseline after Aug refresh.",
  },
];

export const telegramSession: TelegramSession = {
  state: "auth_required",
  identity: { phone: "+84 •• ••• 118", username: null, displayName: null },
  lastEventAt: new Date(Date.now() - 20 * 60_000).toISOString(),
  apiIdSet: true,
  apiHashSet: true,
};

export const runtimeComponents: RuntimeComponent[] = [
  {
    id: "panel-api",
    name: "Panel API",
    kind: "panel_api",
    health: "healthy",
    version: "0.9.4",
    lastRestartAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
    lastHealthyAt: new Date(Date.now() - 30_000).toISOString(),
    detail: "Serving /api at 6ms p50.",
  },
  {
    id: "core",
    name: "Core",
    kind: "core",
    health: "healthy",
    version: "0.9.4",
    lastRestartAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
    lastHealthyAt: new Date(Date.now() - 40_000).toISOString(),
    detail: "Pipeline lag 120ms.",
  },
  {
    id: "bridge",
    name: "Bridge",
    kind: "bridge",
    health: "degraded",
    version: "0.9.2",
    lastRestartAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    lastHealthyAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    detail: "Retrying 3 outbound submits.",
  },
  {
    id: "worker",
    name: "Worker",
    kind: "worker",
    health: "healthy",
    version: "0.9.4",
    lastRestartAt: null,
    lastHealthyAt: new Date(Date.now() - 15_000).toISOString(),
    detail: "Queue depth 12.",
  },
  {
    id: "tg-a",
    name: "Telegram A",
    kind: "telegram",
    health: "input_required",
    version: "0.4.1",
    lastRestartAt: null,
    lastHealthyAt: null,
    detail: "OTP required to resume session.",
  },
  {
    id: "mt5-a",
    name: "MT5 Alpha",
    kind: "mt5",
    health: "healthy",
    version: "5.0.0",
    lastRestartAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    lastHealthyAt: new Date(Date.now() - 20_000).toISOString(),
    detail: "Connected · IC-Live-04.",
  },
  {
    id: "mt5-b",
    name: "MT5 Beta",
    kind: "mt5",
    health: "stale",
    version: "5.0.0",
    lastRestartAt: null,
    lastHealthyAt: new Date(Date.now() - 40 * 60_000).toISOString(),
    detail: "No heartbeat for 40m.",
  },
  {
    id: "db",
    name: "Database & Migrations",
    kind: "database",
    health: "healthy",
    version: "17.2",
    lastRestartAt: null,
    lastHealthyAt: new Date(Date.now() - 15_000).toISOString(),
    detail: "All migrations applied (rev 042).",
  },
];

export const providers: Provider[] = [
  {
    id: "prov-a",
    name: "Provider A",
    kind: "primary",
    state: "active",
    endpointMasked: "wss://a•••••/panel",
    addedAt: new Date(Date.now() - 40 * 86400_000).toISOString(),
    lastTestedAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
  },
  {
    id: "prov-b",
    name: "Provider B",
    kind: "secondary",
    state: "inactive",
    endpointMasked: "wss://b•••••/panel",
    addedAt: new Date(Date.now() - 20 * 86400_000).toISOString(),
    lastTestedAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
  },
  {
    id: "prov-c",
    name: "Provider C",
    kind: "diagnostic",
    state: "testing",
    endpointMasked: "wss://c•••••/panel",
    addedAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
    lastTestedAt: new Date(Date.now() - 20 * 60_000).toISOString(),
  },
  {
    id: "prov-d",
    name: "Provider D",
    kind: "archived",
    state: "archived",
    endpointMasked: "wss://d•••••/panel",
    addedAt: new Date(Date.now() - 200 * 86400_000).toISOString(),
    lastTestedAt: null,
  },
];

export const inboxItems: InboxItem[] = [
  {
    id: "in-1",
    correlationId: "cor-30a01",
    severity: "blocker",
    component: "telegram",
    kind: "telegram_auth",
    title: "Telegram OTP required",
    detail: "Enter the OTP sent to +84 •• ••• 118 to resume session.",
    createdAt: new Date(Date.now() - 25 * 60_000).toISOString(),
    state: "open",
    entityKind: "runtime",
    entityId: "tg-a",
  },
  {
    id: "in-2",
    correlationId: "cor-30a02",
    severity: "warning",
    component: "parser",
    kind: "parser_missing",
    title: "Parser profile missing for @unknown_feed",
    detail: "New source posted but no parser profile matches.",
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    state: "open",
    entityKind: "source",
    entityId: null,
  },
  {
    id: "in-3",
    correlationId: "cor-30a03",
    severity: "warning",
    component: "core",
    kind: "symbol_mapping_missing",
    title: "Symbol XAUEUR has no mapping",
    detail: "Signal skipped. Add a symbol mapping to accept it.",
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
    state: "open",
    entityKind: "signal",
    entityId: "sig-1002",
  },
  {
    id: "in-4",
    correlationId: "cor-30a04",
    severity: "critical",
    component: "bridge",
    kind: "runtime_degraded",
    title: "Bridge retrying 3 outbound submits",
    detail: "Bridge is degraded. Investigate broker connectivity.",
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    state: "open",
    entityKind: "runtime",
    entityId: "bridge",
  },
  {
    id: "in-5",
    correlationId: "cor-30a05",
    severity: "info",
    component: "core",
    kind: "reconciliation",
    title: "Reconciliation: 2 orders awaiting broker fill status",
    detail: "Pending reconciliation may take a few minutes.",
    createdAt: new Date(Date.now() - 40 * 60_000).toISOString(),
    state: "open",
    entityKind: "order",
    entityId: "ord-2003",
  },
  {
    id: "in-6",
    correlationId: "cor-30a06",
    severity: "warning",
    component: "core",
    kind: "signal_blocked",
    title: "Signal blocked by risk policy",
    detail: "Daily loss limit reached for USC-001 · Alpha.",
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    state: "open",
    entityKind: "signal",
    entityId: "sig-1005",
  },
  {
    id: "in-7",
    correlationId: "cor-30a07",
    severity: "warning",
    component: "runtime",
    kind: "provider_degraded",
    title: "Provider A latency above threshold",
    detail: "Median 620ms · threshold 400ms.",
    createdAt: new Date(Date.now() - 40 * 60_000).toISOString(),
    state: "acknowledged",
    entityKind: "provider",
    entityId: "prov-a",
  },
];

export const traces: TraceRecord[] = signals.slice(0, 6).map((s) => ({
  correlationId: s.correlationId,
  accountId: s.destinationAccountIds[0] ?? null,
  sourceId: s.sourceId,
  signalId: s.id,
  orderId: s.relatedOrderIds[0] ?? null,
  createdAt: s.receivedAt,
  steps: [
    {
      step: "telegram",
      at: s.receivedAt,
      outcome: "ok",
      component: "telegram-a",
      detail: "Message received.",
      payloadRedacted: { chat: "•••", message_id: 8817 },
    },
    {
      step: "parser",
      at: s.receivedAt,
      outcome: "ok",
      component: "parser",
      detail: `Parsed by ${s.parserProfile}@${s.parserVersion}.`,
      payloadRedacted: { symbol: s.symbol, side: s.side, entry: s.parsedEntry },
    },
    {
      step: "normalized",
      at: s.receivedAt,
      outcome: "ok",
      component: "core",
      detail: "Normalized signal.",
      payloadRedacted: {},
    },
    {
      step: "dedupe",
      at: s.receivedAt,
      outcome: s.status === "deduped" ? "blocked" : "ok",
      component: "core",
      detail: s.status === "deduped" ? "Duplicate suppressed." : "Unique.",
      payloadRedacted: {},
    },
    {
      step: "risk",
      at: s.receivedAt,
      outcome: s.status === "risk_blocked" ? "blocked" : "ok",
      component: "risk",
      detail: s.reason ?? "Risk pass.",
      payloadRedacted: {},
    },
    {
      step: "sizing",
      at: s.receivedAt,
      outcome: "ok",
      component: "sizing",
      detail: "Deterministic sizing computed.",
      payloadRedacted: { volume: "•••" },
    },
    {
      step: "gate",
      at: s.receivedAt,
      outcome: s.status === "policy_blocked" ? "blocked" : "ok",
      component: "gate",
      detail: s.status === "policy_blocked" ? "Execution gate closed." : "Gate open.",
      payloadRedacted: {},
    },
    {
      step: "broker",
      at: s.receivedAt,
      outcome:
        s.status === "technical_failed"
          ? "error"
          : s.status === "executed" || s.status === "partial"
            ? "ok"
            : "pending",
      component: "mt5-alpha",
      detail: s.status === "technical_failed" ? "Broker timeout." : "Order acknowledged.",
      payloadRedacted: {},
    },
    {
      step: "lifecycle",
      at: s.receivedAt,
      outcome: s.relatedOrderIds.length ? "ok" : "pending",
      component: "core",
      detail: "Lifecycle tracked.",
      payloadRedacted: {},
    },
    {
      step: "final",
      at: s.receivedAt,
      outcome: s.relatedOrderIds.length ? "ok" : "pending",
      component: "core",
      detail: "Final P&L recorded.",
      payloadRedacted: {},
    },
  ],
}));

export const hermesRecommendations: HermesRecommendation[] = [
  {
    id: "hr-1",
    sourceId: "src-goldwave",
    accountId: "acc-usc-001",
    kind: "activate",
    rationale: "Sustained 30d win rate 62%, PF 2.3, low drawdown.",
    confidence: 0.82,
    createdAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    state: "pending",
  },
  {
    id: "hr-2",
    sourceId: "src-hermes-b",
    accountId: "acc-usc-002",
    kind: "deactivate",
    rationale: "PF < 1 for 14d and rising technical failure rate.",
    confidence: 0.71,
    createdAt: new Date(Date.now() - 20 * 3600_000).toISOString(),
    state: "pending",
  },
  {
    id: "hr-3",
    sourceId: "src-bluepips",
    accountId: "acc-usd-101",
    kind: "size_change",
    rationale: "Volatility regime shift; reduce sizing 20%.",
    confidence: 0.64,
    createdAt: new Date(Date.now() - 40 * 3600_000).toISOString(),
    state: "reviewed",
  },
];

// ------------------------------------------------------------
// Analysis API Provider Slots
// ------------------------------------------------------------
import type {
  ProviderSlot,
  RoutingPolicy,
  PromptProfile,
  NativeCurrencyReview,
  AccountLine,
  AccountReadiness,
  InstrumentMappingRow,
  SourceAccountCell,
} from "./contracts";

export const providerSlots: ProviderSlot[] = [
  {
    slot: 1,
    label: "Analysis API Slot 1",
    role: "primary",
    assignedProviderId: "prov-a",
    state: "active",
    attempts: 0,
    maxAttempts: 5,
    lastAttemptAt: new Date(Date.now() - 45_000).toISOString(),
    lastRecoveryProbeAt: new Date(Date.now() - 60_000).toISOString(),
    recoveryProbeSeconds: 60,
    cooldownEndsAt: null,
    circuitOpenedAt: null,
    circuitResetSeconds: 120,
    lastFailoverAt: null,
    lastFailbackAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    note: "Primary slot. 60-second recovery probe active.",
  },
  {
    slot: 2,
    label: "Analysis API Slot 2",
    role: "failover",
    assignedProviderId: "prov-b",
    state: "ready",
    attempts: 0,
    maxAttempts: 5,
    lastAttemptAt: null,
    lastRecoveryProbeAt: null,
    recoveryProbeSeconds: 60,
    cooldownEndsAt: null,
    circuitOpenedAt: null,
    circuitResetSeconds: 120,
    lastFailoverAt: null,
    lastFailbackAt: null,
    note: "Standby failover. Never auto-activates.",
  },
  {
    slot: 3,
    label: "Analysis API Slot 3",
    role: "diagnostic",
    assignedProviderId: "prov-c",
    state: "cooldown",
    attempts: 3,
    maxAttempts: 5,
    lastAttemptAt: new Date(Date.now() - 30_000).toISOString(),
    lastRecoveryProbeAt: null,
    recoveryProbeSeconds: 60,
    cooldownEndsAt: new Date(Date.now() + 90_000).toISOString(),
    circuitOpenedAt: null,
    circuitResetSeconds: 120,
    lastFailoverAt: null,
    lastFailbackAt: null,
    note: "Diagnostic slot in cooldown after 3/5 retries.",
  },
];

export const routingPolicy: RoutingPolicy = {
  version: 4,
  strategy: "primary_then_failover",
  failoverAfterAttempts: 5,
  failbackWhen: "probe_ok",
  recoveryProbeSeconds: 60,
  cooldownSeconds: 30,
  circuitResetSeconds: 120,
  updatedAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  updatedBy: "operator@signalops",
};

export const promptProfiles: PromptProfile[] = [
  {
    id: "pp-1",
    name: "Gold parser v3",
    version: 3,
    state: "published",
    purpose: "Extract entry/SL/TP from gold desks.",
    updatedAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
  },
  {
    id: "pp-2",
    name: "EU flow classifier",
    version: 2,
    state: "evaluated",
    purpose: "Classify EU flow desk direction.",
    updatedAt: new Date(Date.now() - 12 * 86400_000).toISOString(),
  },
  {
    id: "pp-3",
    name: "Generic v2",
    version: 2,
    state: "draft",
    purpose: "Fallback parser for unknown formats.",
    updatedAt: new Date(Date.now() - 1 * 86400_000).toISOString(),
  },
];

export const nativeCurrencyReviews: NativeCurrencyReview[] = [
  {
    accountId: "acc-usc-001",
    configuredCurrency: "USC",
    brokerReportedCurrency: "USC",
    state: "verified",
    detectedAt: new Date(Date.now() - 60_000).toISOString(),
    note: "Broker report matches configured native currency.",
  },
  {
    accountId: "acc-usd-104",
    configuredCurrency: "USD",
    brokerReportedCurrency: "USC",
    state: "mismatch",
    detectedAt: new Date(Date.now() - 40 * 60_000).toISOString(),
    note: "Broker now reports USC — review required before further orders.",
  },
  {
    accountId: "acc-usd-off",
    configuredCurrency: "USD",
    brokerReportedCurrency: null,
    state: "input_required",
    detectedAt: null,
    note: "Broker offline; cannot confirm currency.",
  },
];

export const accountLines: AccountLine[] = accounts.map((a, i) => ({
  accountId: a.id,
  revision: 12 + i,
  effectiveState:
    a.lifecycle === "archived"
      ? "archived"
      : a.lifecycle === "draining"
        ? "draining"
        : a.lifecycle === "connected"
          ? "connected"
          : "disconnected",
  desiredState:
    a.lifecycle === "archived"
      ? "archived"
      : a.lifecycle === "draining"
        ? "disconnected"
        : "connected",
  pendingChange: a.lifecycle === "draining" ? "drain_to_disconnected" : null,
  workerOwner: a.lifecycle === "offline" ? null : `worker-${(i % 3) + 1}`,
  bridgeOwner: a.lifecycle === "offline" ? null : `bridge-${(i % 2) + 1}`,
  terminalIdentity: `${a.broker}:${a.server}:${a.login}`,
  updatedAt: a.lastSyncAt,
}));

export const accountReadiness: AccountReadiness[] = accounts.map((a) => ({
  accountId: a.id,
  ready: a.lifecycle === "connected",
  blockers:
    a.lifecycle === "input_required"
      ? [{ code: "IDENTITY_CHANGED", reason: "Broker changed reported currency." }]
      : a.lifecycle === "offline"
        ? [{ code: "TERMINAL_OFFLINE", reason: "MT5 terminal is offline." }]
        : a.lifecycle === "draining"
          ? [{ code: "DRAINING", reason: "Draining to disconnected." }]
          : [],
  updatedAt: a.lastSyncAt,
}));

export const instrumentMapping: InstrumentMappingRow[] = accounts.flatMap((a) =>
  ["XAUUSD", "EURUSD", "GBPUSD"].map((sym) => ({
    accountId: a.id,
    canonicalSymbol: sym,
    brokerSymbol: sym === "GBPUSD" && a.id === "acc-usd-104" ? null : sym,
    state: (sym === "GBPUSD" && a.id === "acc-usd-104" ? "input_required" : "mapped") as
      | "mapped"
      | "input_required",
    reason: sym === "GBPUSD" && a.id === "acc-usd-104" ? "No broker symbol resolved." : null,
  })),
);

export const sourceAccountMatrix: SourceAccountCell[] = sources.flatMap((s, si) =>
  accounts
    .filter((a) => a.lifecycle !== "archived")
    .map((a, ai) => {
      const desired = (si + ai) % 3 !== 0;
      const drained = s.lifecycle === "draining";
      const disabled = s.lifecycle === "disabled";
      return {
        sourceId: s.id,
        accountId: a.id,
        desiredEnabled: desired,
        effectiveEnabled: desired && !drained && !disabled && a.lifecycle === "connected",
        effectiveState:
          s.lifecycle === "archived"
            ? "archived"
            : drained
              ? "draining"
              : disabled
                ? "disabled"
                : "active",
        pendingChange: (si + ai) % 5 === 0 ? "enable" : "none",
        revision: 3 + ((si + ai) % 4),
        blockerReason:
          a.lifecycle === "input_required"
            ? "Account requires input."
            : disabled
              ? "Source disabled."
              : null,
        updatedAt: new Date(Date.now() - (si + ai) * 3600_000).toISOString(),
      } satisfies SourceAccountCell;
    }),
);
