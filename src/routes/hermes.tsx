import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar, useLastUpdatedFromQueries } from "@/lib/topbar";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { BackendRequiredDialog } from "@/components/shared/BackendRequiredDialog";
import { MoneyUsd, Pct, TimeAgo } from "@/components/shared/MoneyText";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useHermesRecommendations,
  useSources,
  useRiskPolicyVersions,
  useTraces,
} from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";

export const Route = createFileRoute("/hermes")({
  head: () => ({
    meta: [
      { title: "Hermes — SignalOps Panel" },
      { name: "description", content: "Intelligence, learning and recommendations." },
      { property: "og:title", content: "Hermes — SignalOps Panel" },
      { property: "og:description", content: "Intelligence, learning and recommendations." },
    ],
  }),
  component: HermesPage,
});

function HermesPage() {
  const t = useT();
  const recs = useHermesRecommendations();
  const sources = useSources();
  const risk = useRiskPolicyVersions();
  const traces = useTraces();
  useTopBar({
    title: t("nav.hermes"),
    lastUpdatedIso: useLastUpdatedFromQueries(recs, sources, risk, traces),
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("nav.hermes")} description={t("route.header.hermes")} />
      <FixtureBanner />

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview" data-control-id={controls.hermes.tabOverview}>
            {t("hermes.tab.overview")}
          </TabsTrigger>
          <TabsTrigger value="accounts" data-control-id={controls.hermes.tabAccounts}>
            {t("hermes.tab.accounts")}
          </TabsTrigger>
          <TabsTrigger value="sources" data-control-id={controls.hermes.tabSources}>
            {t("hermes.tab.sources")}
          </TabsTrigger>
          <TabsTrigger value="decisions" data-control-id={controls.hermes.tabDecisions}>
            {t("hermes.tab.decisions")}
          </TabsTrigger>
          <TabsTrigger value="learning" data-control-id={controls.hermes.tabLearning}>
            {t("hermes.tab.learning")}
          </TabsTrigger>
          <TabsTrigger value="policies" data-control-id={controls.hermes.tabPolicies}>
            {t("hermes.tab.policies")}
          </TabsTrigger>
          <TabsTrigger
            value="prompts"
            data-control-id={controls.hermes.tabPrompts ?? "hermes.tab.prompts"}
          >
            {t("hermes.tab.prompts")}
          </TabsTrigger>
          <TabsTrigger value="trace" data-control-id={controls.hermes.tabTrace}>
            {t("hermes.tab.trace")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t("hermes.overview.pending")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {(recs.data ?? []).filter((r) => r.state === "pending").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t("hermes.overview.live_sources")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {(sources.data ?? []).filter((s) => s.lifecycle !== "archived").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t("hermes.overview.archived")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {(sources.data ?? []).filter((s) => s.lifecycle === "archived").length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="mt-4">
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              {t("hermes.accounts.note")}
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="sources" className="mt-4">
          {sources.isPending ? (
            <LoadingState />
          ) : (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2">Source</th>
                      <th className="px-2 py-2">Win</th>
                      <th className="px-2 py-2 text-right">Net P&L</th>
                      <th className="px-2 py-2 text-right">PF</th>
                      <th className="px-2 py-2 text-right">DD</th>
                      <th className="px-2 py-2">State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sources.data ?? []).map((s) => (
                      <tr key={s.id} className="border-b border-border/60 last:border-none">
                        <td className="px-4 py-2 font-medium">{s.displayName}</td>
                        <td className="px-2 py-2">
                          <Pct value={s.signalWinRate} />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <MoneyUsd value={s.netPnlUsd} colorize />
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">
                          {s.profitFactor.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 text-right">
                          <MoneyUsd value={-s.maxDrawdownUsd} />
                        </td>
                        <td className="px-2 py-2">
                          <StatusBadge
                            tone={
                              s.lifecycle === "archived"
                                ? "archived"
                                : s.lifecycle === "enabled"
                                  ? "healthy"
                                  : s.lifecycle === "degraded"
                                    ? "degraded"
                                    : "stale"
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="decisions" className="mt-4">
          {recs.isPending ? (
            <LoadingState />
          ) : (recs.data ?? []).length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {(recs.data ?? []).map((r) => (
                <Card key={r.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span className="uppercase">{r.kind}</span>
                      <StatusBadge
                        tone={
                          r.state === "pending"
                            ? "input_required"
                            : r.state === "reviewed"
                              ? "healthy"
                              : "archived"
                        }
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="text-xs text-muted-foreground">
                      {r.sourceId} → {r.accountId}
                    </div>
                    <p>{r.rationale}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {t("hermes.recommendation.confidence")}: <Pct value={r.confidence} />
                      </span>
                      <TimeAgo iso={r.createdAt} />
                    </div>
                    <div className="border-t border-border pt-2">
                      <BackendRequiredDialog
                        controlId={controls.hermes.recommendationOpen}
                        trigger={
                          <Button size="sm" variant="outline">
                            Open recommendation
                          </Button>
                        }
                        title="Open recommendation"
                        payloadPreview={{ intent: "hermes.recommendation.open", id: r.id }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="learning" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Learning datasets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-xs text-muted-foreground">
                Archived / sealed historical datasets are displayed separately from live sources.
              </p>
              <ul className="list-disc pl-4 text-sm">
                <li>Sealed dataset · gold_v3 · 90d window · 12.4k signals</li>
                <li>Sealed dataset · eu_v1 · 60d window · 3.1k signals</li>
                <li>Sealed dataset · legacy_v1 · archived reference</li>
              </ul>
              <Button size="sm" variant="ghost" data-control-id={controls.hermes.datasetOpen}>
                Open dataset
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          {risk.isPending ? (
            <LoadingState />
          ) : (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2">Version</th>
                      <th className="px-2 py-2">Author</th>
                      <th className="px-2 py-2 text-right">Daily loss</th>
                      <th className="px-2 py-2 text-right">Budget</th>
                      <th className="px-4 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(risk.data ?? []).map((v) => (
                      <tr key={v.version} className="border-b border-border/60 last:border-none">
                        <td className="px-4 py-2 font-medium">v{v.version}</td>
                        <td className="px-2 py-2 text-xs text-muted-foreground">{v.author}</td>
                        <td className="px-2 py-2 text-right">
                          <MoneyUsd value={v.dailyLossLimitUsd} />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <MoneyUsd value={v.riskBudgetUsd} />
                        </td>
                        <td className="px-4 py-2 text-xs">{v.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trace" className="mt-4">
          {traces.isPending ? (
            <LoadingState />
          ) : (traces.data ?? []).length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {(traces.data ?? []).slice(0, 4).map((tr) => (
                <Card key={tr.correlationId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono">{tr.correlationId}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    {tr.steps.length} steps · <TimeAgo iso={tr.createdAt} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prompts" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t("hermes.prompts.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-xs text-muted-foreground">
                {t("hermes.prompts.problem_type")}: parse, classify, extract, dedupe, adjudicate.
              </p>
              <div className="flex flex-wrap gap-2">
                <BackendRequiredDialog
                  controlId="hermes.prompts.add"
                  trigger={<Button size="sm">{t("hermes.prompts.add")}</Button>}
                  title={t("hermes.prompts.add")}
                  payloadPreview={{ intent: "hermes.prompts.add" }}
                />
                <BackendRequiredDialog
                  controlId="hermes.prompts.duplicate"
                  trigger={
                    <Button size="sm" variant="outline">
                      {t("hermes.prompts.duplicate")}
                    </Button>
                  }
                  title={t("hermes.prompts.duplicate")}
                  payloadPreview={{ intent: "hermes.prompts.duplicate" }}
                />
                <BackendRequiredDialog
                  controlId="hermes.prompts.evaluate"
                  trigger={
                    <Button size="sm" variant="outline">
                      {t("hermes.prompts.evaluate")}
                    </Button>
                  }
                  title={t("hermes.prompts.evaluate")}
                  payloadPreview={{ intent: "hermes.prompts.evaluate" }}
                />
                <BackendRequiredDialog
                  controlId="hermes.prompts.compare"
                  trigger={
                    <Button size="sm" variant="ghost">
                      {t("hermes.prompts.compare")}
                    </Button>
                  }
                  title={t("hermes.prompts.compare")}
                  payloadPreview={{ intent: "hermes.prompts.compare" }}
                />
                <BackendRequiredDialog
                  controlId="hermes.prompts.publish"
                  trigger={
                    <Button size="sm" variant="ghost">
                      {t("hermes.prompts.publish")}
                    </Button>
                  }
                  title={t("hermes.prompts.publish")}
                  payloadPreview={{ intent: "hermes.prompts.publish" }}
                />
                <BackendRequiredDialog
                  controlId="hermes.prompts.export"
                  trigger={
                    <Button size="sm" variant="ghost">
                      {t("hermes.prompts.export")}
                    </Button>
                  }
                  title={t("hermes.prompts.export")}
                  payloadPreview={{ intent: "hermes.prompts.export" }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
