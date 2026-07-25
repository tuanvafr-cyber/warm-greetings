import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar, useLastUpdatedFromQueries } from "@/lib/topbar";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState, EmptyState } from "@/components/shared/StateViews";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { BackendRequiredDialog } from "@/components/shared/BackendRequiredDialog";
import { Sensitive, TimeAgo } from "@/components/shared/MoneyText";
import { ProviderSlotCard, RoutingPolicyPanel } from "@/components/shared/ProviderSlotCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  useTelegramSession,
  useProviders,
  useProviderSlots,
  useRoutingPolicy,
  usePromptProfiles,
} from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import type { TelegramState, ProviderSlot, PromptProfile } from "@/data/contracts";
import { KeyRound, Inbox, ListTree, Sparkles } from "lucide-react";

export const Route = createFileRoute("/telegram")({
  head: () => ({
    meta: [
      { title: "Telegram & AI — SignalOps Panel" },
      {
        name: "description",
        content: "Telegram sessions, sources, AI providers, routing profile and prompt library.",
      },
      { property: "og:title", content: "Telegram & AI — SignalOps Panel" },
      {
        property: "og:description",
        content: "Sessions, sources, AI providers, routing and prompts.",
      },
    ],
  }),
  component: TelegramAiPage,
});

const stateToTone: Record<TelegramState, StatusTone> = {
  config_missing: "input_required",
  api_id_missing: "input_required",
  api_hash_missing: "input_required",
  auth_required: "input_required",
  code_sent: "input_required",
  otp_required: "input_required",
  invalid_otp: "blocked",
  twofa_required: "input_required",
  ready: "healthy",
  degraded: "degraded",
  disconnected: "unavailable",
  revoked: "blocked",
};

function TelegramAiPage() {
  const t = useT();
  const session = useTelegramSession();
  const providers = useProviders();
  const slots = useProviderSlots();
  const policy = useRoutingPolicy();
  const prompts = usePromptProfiles();

  useTopBar({
    title: t("telegram_ai.title"),
    lastUpdatedIso: useLastUpdatedFromQueries(session, providers, slots, policy, prompts),
    extraActions: session.data ? <StatusBadge tone={stateToTone[session.data.state]} /> : null,
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("telegram_ai.title")} description={t("telegram_ai.header.desc")} />
      <FixtureBanner />

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions" data-control-id={controls.telegramAi.tabSessions}>
            {t("telegram_ai.tab.sessions")}
          </TabsTrigger>
          <TabsTrigger value="sources" data-control-id={controls.telegramAi.tabSources}>
            {t("telegram_ai.tab.sources")}
          </TabsTrigger>
          <TabsTrigger value="providers" data-control-id={controls.telegramAi.tabProviders}>
            {t("telegram_ai.tab.providers")}
          </TabsTrigger>
          <TabsTrigger value="routing" data-control-id={controls.telegramAi.tabRouting}>
            {t("telegram_ai.tab.routing")}
          </TabsTrigger>
          <TabsTrigger value="prompts" data-control-id={controls.telegramAi.tabPrompts}>
            {t("telegram_ai.tab.prompts")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-4">
          <SessionsTab />
        </TabsContent>

        <TabsContent value="sources" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-3 pt-4 text-sm">
              <p className="text-muted-foreground">
                {t("telegram_ai.tab.sources")} — {t("sources.instruments.desc")}
              </p>
              <div>
                <Button asChild size="sm" variant="outline" className="gap-2">
                  <Link to="/sources">
                    <ListTree className="h-4 w-4" />
                    {t("telegram.open_sources")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="mt-4">
          {providers.isPending || slots.isPending ? (
            <LoadingState />
          ) : (
            <ProvidersTab slotList={slots.data ?? []} />
          )}
        </TabsContent>

        <TabsContent value="routing" className="mt-4">
          {policy.isPending || !policy.data ? (
            <LoadingState />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <RoutingPolicyPanel policy={policy.data} />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{t("telegram_ai.tab.routing")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{t("telegram_ai.routing.order")}</p>
                  <ol className="list-decimal space-y-1 pl-5">
                    <li>{t("telegram_ai.routing.slot.primary")}</li>
                    <li>{t("telegram_ai.routing.slot.secondary")}</li>
                    <li>{t("telegram_ai.routing.slot.tertiary")}</li>
                  </ol>
                  <Alert>
                    <AlertTitle>{t("backend.title")}</AlertTitle>
                    <AlertDescription>{t("telegram_ai.routing.no_backend")}</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="prompts" className="mt-4">
          {prompts.isPending ? <LoadingState /> : <PromptsTab list={prompts.data ?? []} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SessionsTab() {
  const t = useT();
  const q = useTelegramSession();
  const [otp, setOtp] = useState("");
  const [twofa, setTwofa] = useState("");
  const [apiId, setApiId] = useState("");
  const [apiHash, setApiHash] = useState("");
  const s = q.data;
  if (q.isPending || !s) return <LoadingState />;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <KeyRound className="h-4 w-4" />
            {t(`telegram.state.${s.state}` as never)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>{t("telegram.api_id")}</Label>
              <Input
                value={apiId}
                onChange={(e) => setApiId(e.target.value)}
                placeholder={s.apiIdSet ? "•••• configured" : "Set API ID"}
                data-control-id={controls.telegram.apiIdEdit}
              />
            </div>
            <div>
              <Label>{t("telegram.api_hash")}</Label>
              <Input
                value={apiHash}
                onChange={(e) => setApiHash(e.target.value)}
                placeholder={s.apiHashSet ? "•••• configured" : "Set API Hash"}
                type="password"
                data-control-id={controls.telegram.apiHashEdit}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <BackendRequiredDialog
              controlId={controls.telegram.configSave}
              trigger={<Button size="sm">{t("telegram.save_config")}</Button>}
              title={t("telegram.save_config")}
              payloadPreview={{
                intent: "telegram.config",
                api_id: apiId ? "•••" : "unchanged",
                api_hash: apiHash ? "•••" : "unchanged",
              }}
            />
            <BackendRequiredDialog
              controlId={controls.telegram.sendCode}
              trigger={
                <Button size="sm" variant="outline">
                  {t("telegram.send_code")}
                </Button>
              }
              title={t("telegram.send_code")}
              payloadPreview={{ intent: "telegram.send_code" }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>{t("telegram.otp")}</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputMode="numeric"
                maxLength={6}
              />
            </div>
            <div>
              <Label>{t("telegram.twofa")}</Label>
              <Input value={twofa} onChange={(e) => setTwofa(e.target.value)} type="password" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <BackendRequiredDialog
              controlId={controls.telegram.otpSubmit}
              trigger={<Button size="sm">{t("telegram.otp.submit")}</Button>}
              title={t("telegram.otp.submit")}
              payloadPreview={{ intent: "telegram.otp", otp: otp ? "•••" : "" }}
            />
            <BackendRequiredDialog
              controlId={controls.telegram.twoFaSubmit}
              trigger={
                <Button size="sm" variant="outline">
                  {t("telegram.twofa.submit")}
                </Button>
              }
              title={t("telegram.twofa.submit")}
              payloadPreview={{ intent: "telegram.2fa", password: twofa ? "•••" : "" }}
            />
            <BackendRequiredDialog
              controlId={controls.telegram.authCancel}
              trigger={
                <Button size="sm" variant="ghost">
                  {t("telegram.cancel")}
                </Button>
              }
              title={t("telegram.cancel")}
              payloadPreview={{ intent: "telegram.cancel" }}
            />
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            <BackendRequiredDialog
              controlId={controls.telegram.testReadonly}
              trigger={
                <Button size="sm" variant="outline">
                  {t("telegram.test")}
                </Button>
              }
              title={t("telegram.test")}
              payloadPreview={{ intent: "telegram.test_readonly" }}
            />
            <BackendRequiredDialog
              controlId={controls.telegram.reconnect}
              trigger={
                <Button size="sm" variant="ghost">
                  {t("telegram.reconnect")}
                </Button>
              }
              title={t("telegram.reconnect")}
              payloadPreview={{ intent: "telegram.reconnect" }}
            />
            <BackendRequiredDialog
              controlId={controls.telegram.revoke}
              trigger={
                <Button size="sm" variant="destructive">
                  {t("telegram.revoke")}
                </Button>
              }
              title={t("telegram.revoke")}
              payloadPreview={{ intent: "telegram.revoke" }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm" data-control-id={controls.telegram.identityOpen}>
              {t("telegram.identity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-1">
              <span className="text-xs text-muted-foreground">Phone</span>
              <Sensitive value={s.identity.phone ?? "—"} />
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-1">
              <span className="text-xs text-muted-foreground">Username</span>
              <span>{s.identity.username ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Last event</span>
              <TimeAgo iso={s.lastEventAt} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-2 pt-4">
            <Button
              asChild
              variant="outline"
              size="sm"
              data-control-id={controls.telegram.sourcesOpen}
              className="justify-start gap-2"
            >
              <Link to="/sources">
                <ListTree className="h-4 w-4" />
                {t("telegram.open_sources")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              data-control-id={controls.telegram.inboxOpen}
              className="justify-start gap-2"
            >
              <Link to="/inbox">
                <Inbox className="h-4 w-4" />
                {t("telegram.open_inbox")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProvidersTab({ slotList }: { slotList: ProviderSlot[] }) {
  const t = useT();
  if (slotList.length === 0) return <EmptyState />;
  // Ordered array Primary → Secondary → Tertiary
  const ordered = [...slotList].sort((a, b) => a.slot - b.slot);
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{t("telegram_ai.routing.order")}</p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ordered.map((s) => (
          <ProviderSlotCard key={s.slot} slot={s} />
        ))}
      </div>
    </div>
  );
}

function PromptsTab({ list }: { list: PromptProfile[] }) {
  const t = useT();
  const [selectedId, setSelectedId] = useState<string | null>(list[0]?.id ?? null);
  const selected = list.find((p) => p.id === selectedId) ?? null;

  if (list.length === 0) return <EmptyState />;

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t("hermes.prompts.title")}
            </span>
            <BackendRequiredDialog
              controlId={controls.prompts.newProfile}
              trigger={
                <Button size="sm" variant="ghost">
                  +
                </Button>
              }
              title={t("telegram_ai.prompts.new")}
              payloadPreview={{ intent: "prompt.new_profile" }}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <p className="mb-2 px-2 text-xs text-muted-foreground">{t("telegram_ai.prompts.desc")}</p>
          <ul className="space-y-1">
            {list.map((p) => (
              <li key={p.id}>
                <button
                  data-control-id={controls.prompts.selectProfile}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                    selectedId === p.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{p.name}</span>
                    <Badge variant="outline" className="text-[10px]">
                      v{p.version}
                    </Badge>
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">{p.purpose}</div>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {selected ? (
        <PromptDetail profile={selected} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <EmptyState />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PromptDetail({ profile }: { profile: PromptProfile }) {
  const t = useT();
  const [testInput, setTestInput] = useState('{"symbol":"XAUUSD","side":"buy"}');
  const structuredPreview = JSON.stringify(
    {
      profile: profile.name,
      version: profile.version,
      task_type: profile.purpose,
      decision: "hold",
      confidence: 0.42,
      rationale: "Fixture preview — no live provider call.",
    },
    null,
    2,
  );
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="min-w-0">
            <div className="truncate font-semibold">{profile.name}</div>
            <div className="text-xs text-muted-foreground">
              {t("telegram_ai.prompts.active_version")}: v{profile.version} · {profile.state}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <BackendRequiredDialog
              controlId={controls.prompts.activate}
              trigger={<Button size="sm">{t("telegram_ai.prompts.activate")}</Button>}
              title={t("telegram_ai.prompts.activate")}
              payloadPreview={{
                intent: "prompt.activate",
                id: profile.id,
                version: profile.version,
              }}
            />
            <BackendRequiredDialog
              controlId={controls.prompts.rollback}
              trigger={
                <Button size="sm" variant="outline">
                  {t("telegram_ai.prompts.rollback")}
                </Button>
              }
              title={t("telegram_ai.prompts.rollback")}
              payloadPreview={{ intent: "prompt.rollback", id: profile.id }}
            />
            <BackendRequiredDialog
              controlId={controls.prompts.duplicate}
              trigger={
                <Button size="sm" variant="ghost">
                  {t("telegram_ai.prompts.duplicate")}
                </Button>
              }
              title={t("telegram_ai.prompts.duplicate")}
              payloadPreview={{ intent: "prompt.duplicate", id: profile.id }}
            />
            <BackendRequiredDialog
              controlId={controls.prompts.archive}
              trigger={
                <Button size="sm" variant="ghost">
                  {t("telegram_ai.prompts.archive")}
                </Button>
              }
              title={t("telegram_ai.prompts.archive")}
              payloadPreview={{ intent: "prompt.archive", id: profile.id }}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <PromptMeta label={t("telegram_ai.prompts.task_type")} value={profile.purpose} />
          <PromptMeta
            label={t("telegram_ai.prompts.source_scope")}
            value={t("state.capability_unavailable")}
          />
          <PromptMeta
            label={t("telegram_ai.prompts.provider_scope")}
            value="Primary → Secondary → Tertiary"
          />
          <PromptMeta
            label={t("telegram_ai.prompts.input_schema")}
            value="{ signal, account, context }"
          />
          <PromptMeta
            label={t("telegram_ai.prompts.output_schema")}
            value="{ decision, confidence, rationale }"
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-1">
            <Label>{t("telegram_ai.prompts.test_input")}</Label>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full min-h-[140px] rounded-md border border-input bg-background p-2 font-mono text-xs"
            />
            <BackendRequiredDialog
              controlId={controls.prompts.runTest}
              trigger={<Button size="sm">{t("hermes.prompts.evaluate")}</Button>}
              title={t("hermes.prompts.evaluate")}
              payloadPreview={{ intent: "prompt.run_test", id: profile.id, test_input: testInput }}
            />
          </div>
          <div className="space-y-1">
            <Label>{t("telegram_ai.prompts.test_output")}</Label>
            <pre className="min-h-[140px] overflow-auto rounded-md border border-border bg-muted p-2 font-mono text-xs">
              {structuredPreview}
            </pre>
            <p className="text-[11px] text-muted-foreground">{t("cmd.fixture_result")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs">
          <span className="text-muted-foreground">{t("telegram_ai.prompts.audit")}</span>
          <BackendRequiredDialog
            controlId={controls.prompts.openAudit}
            trigger={
              <Button size="sm" variant="ghost">
                {t("telegram_ai.prompts.audit")}
              </Button>
            }
            title={t("telegram_ai.prompts.audit")}
            payloadPreview={{ intent: "prompt.audit", id: profile.id }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PromptMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-xs">{value}</div>
    </div>
  );
}
