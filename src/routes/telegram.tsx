import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTopBar } from "@/lib/topbar";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState } from "@/components/shared/StateViews";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { BackendRequiredDialog } from "@/components/shared/BackendRequiredDialog";
import { Sensitive, TimeAgo } from "@/components/shared/MoneyText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTelegramSession } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import type { TelegramState } from "@/data/contracts";
import { KeyRound, Inbox, ListTree } from "lucide-react";

export const Route = createFileRoute("/telegram")({
  head: () => ({
    meta: [
      { title: "Telegram — SignalOps Panel" },
      { name: "description", content: "Telegram session, authentication and identity." },
      { property: "og:title", content: "Telegram — SignalOps Panel" },
      { property: "og:description", content: "Telegram session, authentication and identity." },
    ],
  }),
  component: TelegramPage,
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

function TelegramPage() {
  const t = useT();
  const q = useTelegramSession();
  const [otp, setOtp] = useState("");
  const [twofa, setTwofa] = useState("");
  const [apiId, setApiId] = useState("");
  const [apiHash, setApiHash] = useState("");

  const s = q.data;
  useTopBar({
    title: t("telegram.title"),
    lastUpdatedIso: new Date().toISOString(),
    extraActions: s ? <StatusBadge tone={stateToTone[s.state]} /> : null,
  });
  if (q.isPending || !s)
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title={t("telegram.title")} description={t("route.header.telegram")} />
        <LoadingState />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("telegram.title")}
        description={t("route.header.telegram")}
        actions={<StatusBadge tone={stateToTone[s.state]} />}
      />
      <FixtureBanner />

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

          <Alert>
            <AlertTitle>{t("backend.title")}</AlertTitle>
            <AlertDescription>
              Message-sending test is disabled by product policy. Panel Next only ever performs
              read-only Telegram verification.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
