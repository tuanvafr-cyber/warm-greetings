import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Upload, Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar, useLastUpdatedFromQueries } from "@/lib/topbar";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { MoneyUsd, Pct, TimeAgo } from "@/components/shared/MoneyText";
import { BackendRequiredDialog } from "@/components/shared/BackendRequiredDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSources, useAccounts, useSourceAccountMatrix } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import type { Source, SourceLifecycle, SourceAccountCell, Account } from "@/data/contracts";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Signal Sources — SignalOps Panel" },
      { name: "description", content: "Active, performance and archived signal sources." },
      { property: "og:title", content: "Signal Sources — SignalOps Panel" },
      {
        property: "og:description",
        content: "Manage signal sources: Active, Performance, Archive.",
      },
    ],
  }),
  component: SourcesPage,
});

function tone(l: SourceLifecycle): StatusTone {
  return l === "enabled"
    ? "active"
    : l === "disabled"
      ? "disabled"
      : l === "draining"
        ? "draining"
        : l === "degraded"
          ? "degraded"
          : "archived";
}

function SourcesPage() {
  const t = useT();
  useTopBar({ title: t("nav.sources"), lastUpdatedIso: useLastUpdatedFromQueries(q) });
  const [search, setSearch] = useState("");
  const q = useSources();
  const filter = (list: Source[]) =>
    list.filter(
      (s) =>
        !search ||
        s.displayName.toLowerCase().includes(search.toLowerCase()) ||
        s.telegramIdentity.toLowerCase().includes(search.toLowerCase()),
    );

  const active = filter((q.data ?? []).filter((s) => s.lifecycle !== "archived"));
  const archive = filter((q.data ?? []).filter((s) => s.lifecycle === "archived"));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("nav.sources")}
        description={t("route.header.sources")}
        actions={
          <>
            <BackendRequiredDialog
              controlId={controls.sources.import}
              trigger={
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Upload className="h-3.5 w-3.5" />
                  {t("sources.import")}
                </Button>
              }
              title={t("sources.import")}
              description={t("backend.desc")}
              payloadPreview={{ intent: "source.import" }}
            />
            <BackendRequiredDialog
              controlId={controls.sources.add}
              trigger={
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  {t("sources.add")}
                </Button>
              }
              title={t("sources.add")}
              description={t("backend.desc")}
              payloadPreview={{ intent: "source.add", telegram_identity: "" }}
            >
              <div className="grid gap-2 py-2">
                <Input placeholder="@telegram_identity" />
                <Input placeholder="Parser profile (e.g. gold_v3)" />
                <Input placeholder="Symbols (e.g. XAUUSD, EURUSD)" />
              </div>
            </BackendRequiredDialog>
          </>
        }
      />
      <FixtureBanner />

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" data-control-id={controls.sources.tabActive}>
            {t("sources.tab.active")}
          </TabsTrigger>
          <TabsTrigger value="perf" data-control-id={controls.sources.tabPerformance}>
            {t("sources.tab.performance")}
          </TabsTrigger>
          <TabsTrigger value="matrix" data-control-id={controls.sources.tabMatrix}>
            {t("sources.tab.matrix")}
          </TabsTrigger>
          <TabsTrigger value="archive" data-control-id={controls.sources.tabArchive}>
            {t("sources.tab.archive")}
          </TabsTrigger>
        </TabsList>

        <div className="mt-3">
          <Input
            data-control-id={controls.sources.search}
            placeholder={t("common.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <TabsContent value="active" className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">{t("sources.disabled_note")}</p>
          {q.isPending ? (
            <LoadingState />
          ) : active.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {active.map((s) => (
                <ActiveCard key={s.id} s={s} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="perf" className="mt-4">
          {q.isPending ? (
            <LoadingState />
          ) : (
            <PerformanceTable sources={(q.data ?? []).filter((s) => s.lifecycle !== "archived")} />
          )}
        </TabsContent>

        <TabsContent value="matrix" className="mt-4">
          <SourceAccountMatrixView />
        </TabsContent>

        <TabsContent value="archive" className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">{t("sources.archived_note")}</p>
          {q.isPending ? (
            <LoadingState />
          ) : archive.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {archive.map((s) => (
                <ArchiveCard key={s.id} s={s} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ActiveCard({ s }: { s: Source }) {
  const t = useT();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start justify-between text-sm">
          <div className="min-w-0">
            <div className="truncate font-semibold">{s.displayName}</div>
            <div className="truncate text-xs text-muted-foreground">{s.telegramIdentity}</div>
          </div>
          <StatusBadge tone={tone(s.lifecycle)} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <div>{t("sources.parser")}</div>
          <div className="text-right">
            {s.parserProfile}@{s.parserVersion}
          </div>
          <div>{t("sources.symbols")}</div>
          <div className="text-right">{s.symbolProfile}</div>
          <div>Realtime · History</div>
          <div className="text-right">
            {s.realtime ? "✓" : "—"} · {s.history ? "✓" : "—"}
          </div>
          <div>{t("sources.last_signal")}</div>
          <div className="text-right">
            <TimeAgo iso={s.lastSignalAt} />
          </div>
          <div>Open lifecycle</div>
          <div className="text-right tabular-nums">{s.openLifecycleCount}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2">
          <div className="flex items-center gap-2">
            <Switch checked={s.lifecycle === "enabled"} data-control-id={controls.sources.toggle} />
            <span className="text-xs text-muted-foreground">
              {s.lifecycle === "enabled" ? t("common.disable") : t("common.enable")}
            </span>
          </div>
          <div className="ml-auto flex flex-wrap gap-1.5">
            <BackendRequiredDialog
              controlId={controls.sources.verify}
              trigger={
                <Button size="sm" variant="outline">
                  {t("common.verify")}
                </Button>
              }
              title={t("common.verify")}
              payloadPreview={{ intent: "source.verify", id: s.id }}
            />
            <BackendRequiredDialog
              controlId={controls.sources.edit}
              trigger={
                <Button size="sm" variant="ghost">
                  {t("common.edit")}
                </Button>
              }
              title={t("common.edit")}
              payloadPreview={{ intent: "source.edit", id: s.id }}
            />
            <BackendRequiredDialog
              controlId={controls.sources.archive}
              trigger={
                <Button size="sm" variant="ghost">
                  {t("common.archive")}
                </Button>
              }
              title={t("common.archive")}
              payloadPreview={{ intent: "source.archive", id: s.id }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ArchiveCard({ s }: { s: Source }) {
  const t = useT();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start justify-between text-sm">
          <div className="min-w-0">
            <div className="truncate font-semibold">{s.displayName}</div>
            <div className="truncate text-xs text-muted-foreground">{s.telegramIdentity}</div>
          </div>
          <StatusBadge tone="frozen" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-xs text-muted-foreground">{t("sources.archived_note")}</div>
        <div className="flex flex-wrap gap-1.5 border-t border-border pt-2">
          <BackendRequiredDialog
            controlId={controls.sources.restore}
            trigger={
              <Button size="sm" variant="outline">
                {t("common.restore")}
              </Button>
            }
            title={t("common.restore")}
            payloadPreview={{ intent: "source.restore", id: s.id }}
          />
          <Button
            size="sm"
            variant="ghost"
            data-control-id={controls.sources.export}
            className="gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            {t("common.export")}
          </Button>
          <BackendRequiredDialog
            controlId={controls.sources.deletePermanent}
            trigger={
              <Button size="sm" variant="destructive">
                {t("common.delete_permanent")}
              </Button>
            }
            title={t("common.delete_permanent")}
            payloadPreview={{ intent: "source.delete_permanent", id: s.id }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceTable({ sources }: { sources: Source[] }) {
  const t = useT();
  if (sources.length === 0) return <EmptyState />;
  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">{t("col.source")}</th>
              <th className="px-2 py-2 font-medium">{t("dashboard.win_rate")}</th>
              <th className="px-2 py-2 text-right font-medium">{t("dashboard.net_pnl")}</th>
              <th className="px-2 py-2 text-right font-medium">PF</th>
              <th className="px-2 py-2 text-right font-medium">RR</th>
              <th className="px-2 py-2 text-right font-medium">Max DD</th>
              <th className="px-2 py-2 text-right font-medium">Exec %</th>
              <th className="px-2 py-2 text-right font-medium">Tech fail %</th>
              <th className="px-2 py-2 text-right font-medium">Latency</th>
              <th className="px-2 py-2 font-medium">Best</th>
              <th className="px-2 py-2 text-right font-medium">{t("dashboard.total_orders")}</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id} className="border-b border-border/60 last:border-none">
                <td className="px-4 py-2 font-medium">{s.displayName}</td>
                <td className="px-2 py-2">
                  <Pct value={s.signalWinRate} />
                </td>
                <td className="px-2 py-2 text-right">
                  <MoneyUsd value={s.netPnlUsd} colorize />
                </td>
                <td className="px-2 py-2 text-right tabular-nums">{s.profitFactor.toFixed(2)}</td>
                <td className="px-2 py-2 text-right tabular-nums">{s.rr.toFixed(1)}</td>
                <td className="px-2 py-2 text-right">
                  <MoneyUsd value={-s.maxDrawdownUsd} />
                </td>
                <td className="px-2 py-2 text-right">
                  <Pct value={s.executionRate} />
                </td>
                <td className="px-2 py-2 text-right">
                  <Pct value={s.technicalFailureRate} />
                </td>
                <td className="px-2 py-2 text-right tabular-nums">{s.avgLatencyMs}ms</td>
                <td className="px-2 py-2">
                  {s.bestSymbol} · {String(s.bestHour).padStart(2, "0")}h
                </td>
                <td className="px-2 py-2 text-right tabular-nums">{s.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function SourceAccountMatrixView() {
  const t = useT();
  const cells = useSourceAccountMatrix();
  const srcQ = useSources();
  const accQ = useAccounts();

  if (cells.isPending || srcQ.isPending || accQ.isPending) return <LoadingState />;
  const rows: SourceAccountCell[] = cells.data ?? [];
  if (rows.length === 0) return <EmptyState />;
  const sources: Source[] = (srcQ.data ?? []).filter((s: Source) => s.lifecycle !== "archived");
  const accounts: Account[] = (accQ.data ?? []).filter((a: Account) => a.lifecycle !== "archived");

  const cellFor = (sid: string, aid: string) =>
    rows.find((c) => c.sourceId === sid && c.accountId === aid);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{t("matrix.canonical_note")}</p>
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2">{t("matrix.col.source")}</th>
                {accounts.map((a) => (
                  <th key={a.id} className="px-2 py-2 text-center font-medium">
                    <div className="truncate">{a.displayName}</div>
                    <div className="text-[10px] text-muted-foreground">{a.currency}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.id} className="border-b border-border/60 last:border-none">
                  <td className="px-3 py-2 font-medium">
                    <div className="truncate">{s.displayName}</div>
                    <div className="text-[10px] text-muted-foreground">{s.telegramIdentity}</div>
                  </td>
                  {accounts.map((a) => {
                    const c = cellFor(s.id, a.id);
                    if (!c)
                      return (
                        <td key={a.id} className="px-2 py-2 text-center text-muted-foreground">
                          —
                        </td>
                      );
                    const tone = c.blockerReason
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : c.effectiveEnabled
                        ? "border-success/40 bg-success/10 text-success"
                        : c.effectiveState === "draining"
                          ? "border-warning/40 bg-warning/10 text-warning-foreground"
                          : "border-border bg-muted text-muted-foreground";
                    const label = c.effectiveEnabled
                      ? t("matrix.legend.active")
                      : c.effectiveState === "draining"
                        ? t("matrix.legend.draining")
                        : c.effectiveState === "archived"
                          ? t("matrix.legend.archived")
                          : t("matrix.legend.disabled");
                    return (
                      <td key={a.id} className="px-2 py-1.5 text-center">
                        <BackendRequiredDialog
                          controlId={controls.sources.accountMatrixOpen}
                          trigger={
                            <button
                              className={`w-full rounded-md border px-2 py-1 text-[11px] ${tone}`}
                              title={c.blockerReason ?? undefined}
                            >
                              {label}
                              {c.pendingChange !== "none" && (
                                <span className="ml-1 rounded bg-info/20 px-1 text-[9px] text-info">
                                  {t("matrix.legend.pending")}
                                </span>
                              )}
                            </button>
                          }
                          title={`${s.displayName} × ${a.displayName}`}
                          description={c.blockerReason ?? t("sources.matrix.desc")}
                          payloadPreview={{
                            intent: c.effectiveEnabled
                              ? "source_account.disable"
                              : "source_account.enable",
                            source_id: s.id,
                            account_id: a.id,
                            revision: c.revision,
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
