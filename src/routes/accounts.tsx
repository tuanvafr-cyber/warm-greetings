import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pin, Plus, RefreshCw, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar } from "@/lib/topbar";
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
import { useAccounts } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import type { Account } from "@/data/contracts";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — SignalOps Panel" },
      { name: "description", content: "Active and archived accounts across brokers and currencies." },
      { property: "og:title", content: "Accounts — SignalOps Panel" },
      { property: "og:description", content: "Manage active and archived accounts across brokers." },
    ],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const t = useT();
  const [search, setSearch] = useState("");
  const q = useAccounts();

  const active = (q.data ?? []).filter((a) => a.lifecycle !== "archived");
  const archived = (q.data ?? []).filter((a) => a.lifecycle === "archived");
  const filter = (list: Account[]) =>
    list.filter((a) =>
      !search || a.displayName.toLowerCase().includes(search.toLowerCase()) ||
      a.login.includes(search) || a.broker.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("nav.accounts")}
        description={t("route.header.accounts")}
        actions={
          <>
            <Button variant="outline" size="sm" data-control-id={controls.accounts.refresh} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />{t("common.refresh")}
            </Button>
            <BackendRequiredDialog
              controlId={controls.accounts.add}
              trigger={<Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />{t("accounts.add")}</Button>}
              title={t("accounts.add")}
              description={t("backend.desc")}
              payloadPreview={{ intent: "account.add", login: "", server: "", broker: "" }}
            >
              <div className="grid gap-3 py-2 sm:grid-cols-2">
                <div><Label>Login</Label><Input placeholder="500 123 456" /></div>
                <div><Label>Server</Label><Input placeholder="Broker-Live-01" /></div>
                <div><Label>Broker</Label><Input placeholder="Exness / IC Markets" /></div>
                <div><Label>Currency</Label><Input placeholder="USD or USC" /></div>
              </div>
            </BackendRequiredDialog>
          </>
        }
      />
      <FixtureBanner />

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" data-control-id={controls.accounts.tabActive}>
            {t("accounts.tab.active")}
            <span className="ml-2 rounded-md bg-muted px-1.5 text-xs text-muted-foreground">{active.length}</span>
          </TabsTrigger>
          <TabsTrigger value="archive" data-control-id={controls.accounts.tabArchive}>
            {t("accounts.tab.archive")}
            <span className="ml-2 rounded-md bg-muted px-1.5 text-xs text-muted-foreground">{archived.length}</span>
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
          {q.isPending ? <LoadingState /> : (
            <AccountGrid list={filter(active)} isArchive={false} />
          )}
        </TabsContent>
        <TabsContent value="archive" className="mt-4">
          {q.isPending ? <LoadingState /> : (
            filter(archived).length === 0 ? <EmptyState /> : <AccountGrid list={filter(archived)} isArchive />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function lifecycleToTone(l: Account["lifecycle"]): StatusTone {
  return l === "connected" ? "healthy"
    : l === "offline" ? "unavailable"
    : l === "input_required" ? "input_required"
    : l === "draining" ? "draining" : "archived";
}

function AccountGrid({ list, isArchive }: { list: Account[]; isArchive: boolean }) {
  const t = useT();
  if (list.length === 0) return <EmptyState />;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {list.map((a) => (
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
              <div>Login</div><div className="text-right"><Sensitive value={a.login} /></div>
              <div>Server</div><div className="text-right"><Sensitive value={a.server} /></div>
              <div>Broker</div><div className="text-right">{a.broker}</div>
              <div>{t("accounts.native_balance")}</div>
              <div className="text-right"><NativeAmount amount={a.nativeBalance} currency={a.currency} /></div>
              <div>{t("accounts.native_equity")}</div>
              <div className="text-right"><NativeAmount amount={a.nativeEquity} currency={a.currency} /></div>
              <div>{t("accounts.reporting_equivalent")}</div>
              <div className="text-right"><MoneyUsd value={a.currency === "USC" ? a.nativeEquity / 100 : a.nativeEquity} /></div>
              <div>{t("accounts.native_risk")}</div>
              <div className="text-right"><NativeAmount amount={a.configuredNativeRiskAmount} currency={a.currency} /></div>
              <div>Last sync</div><div className="text-right"><TimeAgo iso={a.lastSyncAt} /></div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2">
              {!isArchive && (
                <>
                  <BackendRequiredDialog
                    controlId={controls.accounts.verify}
                    trigger={<Button size="sm" variant="outline">{t("accounts.verify")}</Button>}
                    title={t("accounts.verify")}
                    description={t("backend.desc")}
                    payloadPreview={{ intent: "account.verify", id: a.id }}
                  />
                  <BackendRequiredDialog
                    controlId={controls.accounts.edit}
                    trigger={<Button size="sm" variant="ghost">{t("common.edit")}</Button>}
                    title={t("common.edit")}
                    description={t("backend.desc")}
                    payloadPreview={{ intent: "account.edit", id: a.id }}
                  />
                  <BackendRequiredDialog
                    controlId={controls.accounts.pin}
                    trigger={<Button size="sm" variant="ghost" className="gap-1"><Pin className="h-3.5 w-3.5" />{t("accounts.pin")}</Button>}
                    title={t("accounts.pin")}
                    description={t("backend.desc")}
                    payloadPreview={{ intent: "account.pin", id: a.id }}
                  />
                  <BackendRequiredDialog
                    controlId={controls.accounts.archive}
                    trigger={<Button size="sm" variant="ghost">{t("common.archive")}</Button>}
                    title={t("common.archive")}
                    description={t("backend.desc")}
                    payloadPreview={{ intent: "account.archive", id: a.id }}
                  />
                  <Button asChild size="sm" variant="ghost" className="ml-auto gap-1"
                    data-control-id={controls.accounts.activationOpen}>
                    <Link to="/hermes"><ShieldCheck className="h-3.5 w-3.5" />{t("accounts.hermes_activation")}</Link>
                  </Button>
                </>
              )}
              {isArchive && (
                <>
                  <BackendRequiredDialog
                    controlId={controls.accounts.restore}
                    trigger={<Button size="sm" variant="outline">{t("common.restore")}</Button>}
                    title={t("common.restore")}
                    description={t("backend.desc")}
                    payloadPreview={{ intent: "account.restore", id: a.id }}
                  />
                  <BackendRequiredDialog
                    controlId={controls.accounts.deletePermanent}
                    trigger={<Button size="sm" variant="destructive">{t("common.delete_permanent")}</Button>}
                    title={t("common.delete_permanent")}
                    description={t("backend.desc")}
                    payloadPreview={{ intent: "account.delete_permanent", id: a.id }}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
