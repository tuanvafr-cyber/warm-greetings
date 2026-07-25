import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar } from "@/lib/topbar";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { TimeAgo, Sensitive } from "@/components/shared/MoneyText";
import { BackendRequiredDialog } from "@/components/shared/BackendRequiredDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useRuntimeComponents,
  useProviders,
  useProviderSlots,
  useRoutingPolicy,
} from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import type { ComponentHealth, ProviderState } from "@/data/contracts";
import { ProviderSlotCard, RoutingPolicyPanel } from "@/components/shared/ProviderSlotCard";
import { Plus, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/runtime")({
  head: () => ({
    meta: [
      { title: "Runtime — SignalOps Panel" },
      { name: "description", content: "Components, providers, updates and logs." },
      { property: "og:title", content: "Runtime — SignalOps Panel" },
      { property: "og:description", content: "Components, providers, updates and logs." },
    ],
  }),
  component: RuntimePage,
});

function healthTone(h: ComponentHealth): StatusTone {
  return h === "healthy"
    ? "healthy"
    : h === "degraded"
      ? "degraded"
      : h === "input_required"
        ? "input_required"
        : h === "blocked"
          ? "blocked"
          : h === "stale"
            ? "stale"
            : "unavailable";
}
function providerTone(s: ProviderState): StatusTone {
  return s === "active"
    ? "healthy"
    : s === "ready"
      ? "healthy"
      : s === "testing"
        ? "input_required"
        : s === "degraded"
          ? "degraded"
          : s === "archived"
            ? "archived"
            : "unavailable";
}

function RuntimePage() {
  const t = useT();
  useTopBar({ title: t("nav.runtime"), lastUpdatedIso: new Date().toISOString() });
  const runtime = useRuntimeComponents();
  const providers = useProviders();
  const slots = useProviderSlots();
  const policy = useRoutingPolicy();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("nav.runtime")}
        description={t("route.header.runtime")}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              data-control-id={controls.runtime.refresh}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t("common.refresh")}
            </Button>
            <BackendRequiredDialog
              controlId={controls.runtime.selfTest}
              trigger={<Button size="sm">{t("runtime.self_test")}</Button>}
              title={t("runtime.self_test")}
              payloadPreview={{ intent: "runtime.self_test" }}
            />
          </>
        }
      />
      <FixtureBanner />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" data-control-id={controls.runtime.tabOverview}>
            {t("runtime.tab.overview")}
          </TabsTrigger>
          <TabsTrigger value="components" data-control-id={controls.runtime.tabComponents}>
            {t("runtime.tab.components")}
          </TabsTrigger>
          <TabsTrigger value="slots">{t("runtime.tab.slots")}</TabsTrigger>
          <TabsTrigger value="providers" data-control-id={controls.runtime.tabProviders}>
            {t("runtime.tab.providers")}
          </TabsTrigger>
          <TabsTrigger value="versions" data-control-id={controls.runtime.tabVersions}>
            {t("runtime.tab.versions")}
          </TabsTrigger>
          <TabsTrigger value="logs" data-control-id={controls.runtime.tabLogs}>
            {t("runtime.tab.logs")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slots" className="mt-4">
          <div className="mb-3">
            <h2 className="text-sm font-semibold">{t("runtime.slots.title")}</h2>
            <p className="text-xs text-muted-foreground">{t("runtime.slots.desc")}</p>
          </div>
          {slots.isPending || policy.isPending ? (
            <LoadingState />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {(slots.data ?? []).map((s) => (
                <ProviderSlotCard key={s.slot} slot={s} />
              ))}
              {policy.data ? <RoutingPolicyPanel policy={policy.data} /> : null}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overview" className="mt-4">
          {runtime.isPending ? (
            <LoadingState />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {(runtime.data ?? []).map((c) => (
                <Card key={c.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>{c.name}</span>
                      <StatusBadge tone={healthTone(c.health)} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <div className="text-xs text-muted-foreground">{c.detail}</div>
                    <div className="grid grid-cols-2 gap-x-2 text-xs text-muted-foreground">
                      <div>{t("runtime.version")}</div>
                      <div className="text-right">{c.version}</div>
                      <div>{t("runtime.last_restart")}</div>
                      <div className="text-right">
                        <TimeAgo iso={c.lastRestartAt} />
                      </div>
                      <div>{t("runtime.last_healthy")}</div>
                      <div className="text-right">
                        <TimeAgo iso={c.lastHealthyAt} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 border-t border-border pt-2">
                      <BackendRequiredDialog
                        controlId={controls.runtime.componentRestart}
                        trigger={
                          <Button size="sm" variant="outline">
                            {t("runtime.restart")}
                          </Button>
                        }
                        title={t("runtime.restart")}
                        payloadPreview={{ intent: "runtime.restart", id: c.id }}
                      />
                      <Button size="sm" variant="ghost" data-control-id={controls.runtime.logsOpen}>
                        Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="components" className="mt-4">
          {runtime.isPending ? (
            <LoadingState />
          ) : (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2">Component</th>
                      <th className="px-2 py-2">Kind</th>
                      <th className="px-2 py-2">{t("col.status")}</th>
                      <th className="px-2 py-2">Version</th>
                      <th className="px-2 py-2">{t("runtime.last_healthy")}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {(runtime.data ?? []).map((c) => (
                      <tr key={c.id} className="border-b border-border/60 last:border-none">
                        <td className="px-4 py-2 font-medium">{c.name}</td>
                        <td className="px-2 py-2 text-xs text-muted-foreground">{c.kind}</td>
                        <td className="px-2 py-2">
                          <StatusBadge tone={healthTone(c.health)} />
                        </td>
                        <td className="px-2 py-2 tabular-nums">{c.version}</td>
                        <td className="px-2 py-2">
                          <TimeAgo iso={c.lastHealthyAt} />
                        </td>
                        <td className="pr-3">
                          <BackendRequiredDialog
                            controlId={controls.runtime.componentRestart}
                            trigger={
                              <Button size="sm" variant="ghost">
                                {t("runtime.restart")}
                              </Button>
                            }
                            title={t("runtime.restart")}
                            payloadPreview={{ intent: "runtime.restart", id: c.id }}
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

        <TabsContent value="providers" className="mt-4">
          <Alert className="mb-3">
            <AlertTitle>Provider policy</AlertTitle>
            <AlertDescription>{t("provider.note_inactive_default")}</AlertDescription>
          </Alert>
          <div className="mb-3">
            <BackendRequiredDialog
              controlId={controls.providers.add}
              trigger={
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  {t("provider.add")}
                </Button>
              }
              title={t("provider.add")}
              description={t("provider.note_inactive_default")}
              payloadPreview={{ intent: "provider.add", state: "inactive" }}
            />
          </div>
          {providers.isPending ? (
            <LoadingState />
          ) : (providers.data ?? []).length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {(providers.data ?? []).map((p) => (
                <Card key={p.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span>{p.name}</span>
                      <StatusBadge tone={providerTone(p.state)} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-x-2 text-xs text-muted-foreground">
                      <div>Kind</div>
                      <div className="text-right">{p.kind}</div>
                      <div>Endpoint</div>
                      <div className="text-right">
                        <Sensitive value={p.endpointMasked} />
                      </div>
                      <div>Last tested</div>
                      <div className="text-right">
                        <TimeAgo iso={p.lastTestedAt} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 border-t border-border pt-2">
                      <BackendRequiredDialog
                        controlId={controls.providers.test}
                        trigger={
                          <Button size="sm" variant="outline">
                            {t("provider.test")}
                          </Button>
                        }
                        title={t("provider.test")}
                        payloadPreview={{ intent: "provider.test", id: p.id }}
                      />
                      <BackendRequiredDialog
                        controlId={controls.providers.edit}
                        trigger={
                          <Button size="sm" variant="ghost">
                            {t("common.edit")}
                          </Button>
                        }
                        title={t("common.edit")}
                        payloadPreview={{ intent: "provider.edit", id: p.id }}
                      />
                      <BackendRequiredDialog
                        controlId={controls.providers.switchPreview}
                        trigger={
                          <Button size="sm" variant="ghost">
                            {t("provider.switch_preview")}
                          </Button>
                        }
                        title={t("provider.switch_preview")}
                        payloadPreview={{ intent: "provider.switch_preview", id: p.id }}
                      />
                      {p.state === "active" ? (
                        <BackendRequiredDialog
                          controlId={controls.providers.deactivate}
                          trigger={
                            <Button size="sm" variant="outline">
                              {t("provider.deactivate")}
                            </Button>
                          }
                          title={t("provider.deactivate")}
                          payloadPreview={{ intent: "provider.deactivate", id: p.id }}
                        />
                      ) : p.state === "archived" ? (
                        <>
                          <BackendRequiredDialog
                            controlId={controls.providers.restore}
                            trigger={
                              <Button size="sm" variant="outline">
                                {t("common.restore")}
                              </Button>
                            }
                            title={t("common.restore")}
                            payloadPreview={{ intent: "provider.restore", id: p.id }}
                          />
                          <BackendRequiredDialog
                            controlId={controls.providers.deletePermanent}
                            trigger={
                              <Button size="sm" variant="destructive">
                                {t("common.delete_permanent")}
                              </Button>
                            }
                            title={t("common.delete_permanent")}
                            payloadPreview={{ intent: "provider.delete_permanent", id: p.id }}
                          />
                        </>
                      ) : (
                        <BackendRequiredDialog
                          controlId={controls.providers.activate}
                          trigger={<Button size="sm">{t("provider.activate")}</Button>}
                          title={t("provider.activate")}
                          payloadPreview={{
                            intent: "provider.activate",
                            id: p.id,
                            warn: "Provider B never auto-activates",
                          }}
                        />
                      )}
                      <BackendRequiredDialog
                        controlId={controls.providers.archive}
                        trigger={
                          <Button size="sm" variant="ghost">
                            {t("common.archive")}
                          </Button>
                        }
                        title={t("common.archive")}
                        payloadPreview={{ intent: "provider.archive", id: p.id }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="versions" className="mt-4">
          <div className="flex flex-wrap gap-2">
            <BackendRequiredDialog
              controlId={controls.runtime.updateOpen}
              trigger={<Button size="sm">{t("runtime.update")}</Button>}
              title={t("runtime.update")}
              payloadPreview={{ intent: "runtime.update" }}
            />
            <BackendRequiredDialog
              controlId={controls.runtime.rollbackOpen}
              trigger={
                <Button size="sm" variant="outline">
                  {t("runtime.rollback")}
                </Button>
              }
              title={t("runtime.rollback")}
              payloadPreview={{ intent: "runtime.rollback" }}
            />
          </div>
          <div className="mt-3">
            <EmptyState />
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <EmptyState />
        </TabsContent>
      </Tabs>
    </div>
  );
}
