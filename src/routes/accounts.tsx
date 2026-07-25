import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pin, Plus, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar, useLastUpdatedFromQueries } from "@/lib/topbar";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { MoneyUsd, NativeAmount, Sensitive, TimeAgo } from "@/components/shared/MoneyText";
import { BackendRequiredDialog } from "@/components/shared/BackendRequiredDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccounts, useNativeCurrencyReviews } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import type { Account, NativeCurrencyReview } from "@/data/contracts";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — SignalOps Panel" },
      {
        name: "description",
        content: "Active and archived accounts across brokers and currencies.",
      },
      { property: "og:title", content: "Accounts — SignalOps Panel" },
      {
        property: "og:description",
        content: "Manage active and archived accounts across brokers.",
      },
    ],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const t = useT();
  const [search, setSearch] = useState("");
  const q = useAccounts();
  useTopBar({ title: t("nav.accounts"), lastUpdatedIso: useLastUpdatedFromQueries(q) });

  const active = (q.data ?? []).filter((a) => a.lifecycle !== "archived");
  const archived = (q.data ?? []).filter((a) => a.lifecycle === "archived");
  const filter = (list: Account[]) =>
    list.filter(
      (a) =>
        !search ||
        a.displayName.toLowerCase().includes(search.toLowerCase()) ||
        a.login.includes(search) ||
        a.broker.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("nav.accounts")}
        description={t("route.header.accounts")}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              data-control-id={controls.accounts.refresh}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t("common.refresh")}
            </Button>
            <AddAccountWizard />
          </>
        }
      />
      <FixtureBanner />

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" data-control-id={controls.accounts.tabActive}>
            {t("accounts.tab.active")}
            <span className="ml-2 rounded-md bg-muted px-1.5 text-xs text-muted-foreground">
              {active.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="archive" data-control-id={controls.accounts.tabArchive}>
            {t("accounts.tab.archive")}
            <span className="ml-2 rounded-md bg-muted px-1.5 text-xs text-muted-foreground">
              {archived.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-3">
          <Input
            data-control-id={controls.accounts.search}
            placeholder={t("common.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <TabsContent value="active" className="mt-4">
          {q.isPending ? <LoadingState /> : <AccountGrid list={filter(active)} isArchive={false} />}
        </TabsContent>
        <TabsContent value="archive" className="mt-4">
          {q.isPending ? (
            <LoadingState />
          ) : filter(archived).length === 0 ? (
            <EmptyState />
          ) : (
            <AccountGrid list={filter(archived)} isArchive />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function lifecycleToTone(l: Account["lifecycle"]): StatusTone {
  return l === "connected"
    ? "healthy"
    : l === "offline"
      ? "unavailable"
      : l === "input_required"
        ? "input_required"
        : l === "draining"
          ? "draining"
          : "archived";
}

function AccountGrid({ list, isArchive }: { list: Account[]; isArchive: boolean }) {
  const t = useT();
  const reviewsQ = useNativeCurrencyReviews();
  const reviews = reviewsQ.data ?? [];
  const reviewFor = (id: string): NativeCurrencyReview | undefined =>
    reviews.find((r) => r.accountId === id);
  if (list.length === 0) return <EmptyState />;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {list.map((a) => {
        const rev = reviewFor(a.id);
        return (
          <Card key={a.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  {a.isPinned ? <Pin className="h-3.5 w-3.5 text-primary" /> : null}
                  <span className="truncate font-semibold">{a.displayName}</span>
                </div>
                <StatusBadge tone={lifecycleToTone(a.lifecycle)} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>{t("accounts.col.login")}</div>
                <div className="text-right">
                  <Sensitive value={a.login} />
                </div>
                <div>{t("accounts.col.server")}</div>
                <div className="text-right">
                  <Sensitive value={a.server} />
                </div>
                <div>{t("accounts.col.broker")}</div>
                <div className="text-right">{a.broker}</div>
                <div>{t("accounts.native_balance")}</div>
                <div className="text-right">
                  <NativeAmount amount={a.nativeBalance} currency={a.currency} />
                </div>
                <div>{t("accounts.native_equity")}</div>
                <div className="text-right">
                  <NativeAmount amount={a.nativeEquity} currency={a.currency} />
                </div>
                <div>{t("accounts.reporting_equivalent")}</div>
                <div className="text-right">
                  <MoneyUsd value={a.currency === "USC" ? a.nativeEquity / 100 : a.nativeEquity} />
                </div>
                <div>{t("accounts.native_risk")}</div>
                <div className="text-right">
                  <NativeAmount amount={a.configuredNativeRiskAmount} currency={a.currency} />
                </div>
                <div>{t("accounts.native_currency")}</div>
                <div className="text-right">
                  {a.currency}
                  {rev && (
                    <span
                      className={`ml-1 rounded px-1 text-[10px] ${
                        rev.state === "verified"
                          ? "bg-success/20 text-success"
                          : rev.state === "mismatch"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-info/20 text-info"
                      }`}
                    >
                      {t(`acccy.state.${rev.state}` as import("@/lib/i18n/dictionary").TKey)}
                    </span>
                  )}
                </div>
                <div>{t("accounts.col.last_sync")}</div>
                <div className="text-right">
                  <TimeAgo iso={a.lastSyncAt} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2">
                {!isArchive && (
                  <>
                    <BackendRequiredDialog
                      controlId={controls.accounts.verify}
                      trigger={
                        <Button size="sm" variant="outline">
                          {t("accounts.verify")}
                        </Button>
                      }
                      title={t("accounts.verify")}
                      description={t("backend.desc")}
                      payloadPreview={{ intent: "account.verify", id: a.id }}
                    />
                    <BackendRequiredDialog
                      controlId={controls.accounts.edit}
                      trigger={
                        <Button size="sm" variant="ghost">
                          {t("common.edit")}
                        </Button>
                      }
                      title={t("common.edit")}
                      description={t("backend.desc")}
                      payloadPreview={{ intent: "account.edit", id: a.id }}
                    />
                    <BackendRequiredDialog
                      controlId={controls.accounts.pin}
                      trigger={
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Pin className="h-3.5 w-3.5" />
                          {t("accounts.pin")}
                        </Button>
                      }
                      title={t("accounts.pin")}
                      description={t("backend.desc")}
                      payloadPreview={{ intent: "account.pin", id: a.id }}
                    />
                    <BackendRequiredDialog
                      controlId={controls.accounts.archive}
                      trigger={
                        <Button size="sm" variant="ghost">
                          {t("common.archive")}
                        </Button>
                      }
                      title={t("common.archive")}
                      description={t("backend.desc")}
                      payloadPreview={{ intent: "account.archive", id: a.id }}
                    />
                    <LifecycleActions account={a} />
                    <BackendRequiredDialog
                      controlId={controls.accounts.nativeCurrencyReview}
                      trigger={
                        <Button
                          size="sm"
                          variant={rev?.state === "mismatch" ? "destructive" : "ghost"}
                        >
                          {t("accounts.native_currency.review")}
                        </Button>
                      }
                      title={t("acccy.title")}
                      description={t("acccy.warn_no_convert")}
                      payloadPreview={{
                        intent: "account.native_currency.review",
                        id: a.id,
                        configured: a.currency,
                        broker_reported: rev?.brokerReportedCurrency ?? null,
                      }}
                    >
                      <div className="grid gap-2 py-2 text-sm">
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>{t("acccy.configured")}</div>
                          <div className="text-right font-mono">{a.currency}</div>
                          <div>{t("acccy.reported")}</div>
                          <div className="text-right font-mono">
                            {rev?.brokerReportedCurrency ?? "—"}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{rev?.note}</p>
                      </div>
                    </BackendRequiredDialog>

                  </>
                )}
                {isArchive && (
                  <>
                    <BackendRequiredDialog
                      controlId={controls.accounts.restore}
                      trigger={
                        <Button size="sm" variant="outline">
                          {t("common.restore")}
                        </Button>
                      }
                      title={t("common.restore")}
                      description={t("backend.desc")}
                      payloadPreview={{ intent: "account.restore", id: a.id }}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ---------------- Add-account wizard ----------------

type WizardStep = "detect" | "select" | "preview" | "confirm" | "provisioning" | "ready";

function AddAccountWizard() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>("detect");
  const [terminals, setTerminals] = useState<
    { id: string; login: string; server: string; broker: string }[]
  >([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);

  function reset() {
    setStep("detect");
    setTerminals([]);
    setSelected(null);
    setDetecting(false);
  }

  function runDetect() {
    setDetecting(true);
    setTimeout(() => {
      setTerminals([
        { id: "t1", login: "500123456", server: "ICMarkets-Live02", broker: "IC Markets" },
        { id: "t2", login: "900444210", server: "Exness-Real14", broker: "Exness" },
      ]);
      setDetecting(false);
      setStep("select");
    }, 600);
  }

  const chosen = terminals.find((x) => x.id === selected);

  return (
    <>
      <Button
        size="sm"
        className="gap-1.5"
        data-control-id={controls.accounts.add}
        onClick={() => {
          reset();
          setOpen(true);
        }}
      >
        <Plus className="h-3.5 w-3.5" />
        {t("accounts.add")}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-border bg-background p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">{t("accounts.add")}</h2>
              <span className="text-xs text-muted-foreground">
                {t(`accounts.wizard.step.${step}` as import("@/lib/i18n/dictionary").TKey)}
              </span>
            </div>

            {step === "detect" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{t("accounts.wizard.detect_desc")}</p>
                <Button
                  size="sm"
                  onClick={runDetect}
                  disabled={detecting}
                  data-control-id={controls.accounts.addWizardDetect}
                >
                  {detecting ? t("common.loading") : t("accounts.wizard.run_detect")}
                </Button>
              </div>
            )}

            {step === "select" && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{t("accounts.wizard.select_desc")}</p>
                {terminals.map((tm) => (
                  <button
                    key={tm.id}
                    className={`w-full rounded border p-2 text-left text-sm ${selected === tm.id ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => setSelected(tm.id)}
                    data-control-id={controls.accounts.addWizardSelect}
                  >
                    <div className="font-mono">{tm.login}</div>
                    <div className="text-xs text-muted-foreground">
                      {tm.broker} · {tm.server}
                    </div>
                  </button>
                ))}
                <div className="flex justify-end gap-2 pt-1">
                  <Button size="sm" variant="ghost" onClick={() => setStep("detect")}>
                    {t("common.back")}
                  </Button>
                  <Button size="sm" disabled={!selected} onClick={() => setStep("preview")}>
                    {t("common.next")}
                  </Button>
                </div>
              </div>
            )}

            {step === "preview" && chosen && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{t("accounts.wizard.preview_desc")}</p>
                <pre className="max-h-52 overflow-auto rounded bg-muted p-2 font-mono text-xs">
                  {JSON.stringify(
                    {
                      intent: "account.add.preview",
                      terminal: chosen,
                      derived: { currency: "USD", lifecycle: "READY_PAUSED" },
                    },
                    null,
                    2,
                  )}
                </pre>
                <div className="flex justify-end gap-2 pt-1">
                  <Button size="sm" variant="ghost" onClick={() => setStep("select")}>
                    {t("common.back")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setStep("confirm")}
                    data-control-id={controls.accounts.addWizardPreview}
                  >
                    {t("common.next")}
                  </Button>
                </div>
              </div>
            )}

            {step === "confirm" && chosen && (
              <div className="space-y-2">
                <p className="text-sm">{t("accounts.wizard.confirm_desc")}</p>
                <div className="rounded border border-dashed border-border p-2 text-xs">
                  <div>
                    <Label className="text-xs">{t("accounts.col.login")}</Label> {chosen.login}
                  </div>
                  <div>
                    <Label className="text-xs">{t("accounts.col.broker")}</Label> {chosen.broker}
                  </div>
                </div>
                <div className="rounded-md border border-warning/40 bg-warning/10 p-2 text-xs">
                  <p className="font-medium">{t("accounts.wizard.backend_required_title")}</p>
                  <p className="text-muted-foreground">
                    {t("accounts.wizard.backend_required_desc")}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                    {t("backend.will_submit")}
                  </p>
                  <pre className="max-h-32 overflow-auto rounded bg-muted p-2 font-mono text-[11px]">
                    {JSON.stringify(
                      {
                        intent: "account.add.apply",
                        terminal: chosen,
                        target_lifecycle: "READY_PAUSED",
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button size="sm" variant="ghost" onClick={() => setStep("preview")}>
                    {t("common.back")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setOpen(false)}
                    data-control-id={controls.accounts.addWizardApply}
                  >
                    {t("accounts.wizard.ack")}
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

// ---------------- Lifecycle action cluster ----------------

function LifecycleActions({ account }: { account: Account }) {
  const t = useT();
  const actions: {
    id: string;
    label: string;
    controlId: string;
    intent: string;
    tone?: "destructive";
  }[] = [
    {
      id: "resume",
      label: t("accounts.lifecycle.resume"),
      controlId: controls.accounts.resume,
      intent: "account.resume",
    },
    {
      id: "activate",
      label: t("accounts.lifecycle.activate"),
      controlId: controls.accounts.activate,
      intent: "account.activate",
    },
    {
      id: "pause",
      label: t("accounts.lifecycle.pause"),
      controlId: controls.accounts.pause,
      intent: "account.pause",
    },
    {
      id: "drain",
      label: t("accounts.lifecycle.drain_then_pause"),
      controlId: controls.accounts.drainThenPause,
      intent: "account.drain_then_pause",
    },
    {
      id: "reconcile",
      label: t("accounts.lifecycle.reconcile"),
      controlId: controls.accounts.reconcile,
      intent: "account.reconcile",
    },
    {
      id: "verifyId",
      label: t("accounts.lifecycle.verify_identity"),
      controlId: controls.accounts.verifyIdentity,
      intent: "account.verify_identity",
    },
  ];
  return (
    <>
      {actions.map((a) => (
        <BackendRequiredDialog
          key={a.id}
          controlId={a.controlId}
          trigger={
            <Button size="sm" variant="ghost">
              {a.label}
            </Button>
          }
          title={a.label}
          description={t("backend.desc")}
          payloadPreview={{ intent: a.intent, id: account.id }}
        />
      ))}
    </>
  );
}
