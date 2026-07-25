import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FixtureBanner } from "@/components/shared/FixtureBanner";
import { LoadingState } from "@/components/shared/StateViews";
import { MoneyUsd, NativeAmount } from "@/components/shared/MoneyText";
import { BackendRequiredDialog } from "@/components/shared/BackendRequiredDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRiskPolicyVersions, useAccounts } from "@/data/hooks";
import { useT } from "@/lib/i18n";
import { useTopBar } from "@/lib/topbar";
import { controls } from "@/lib/control-registry";
import { Download, Info } from "lucide-react";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Risk Management — SignalOps Panel" },
      {
        name: "description",
        content: "Effective risk policy, drafts, previews and version history.",
      },
      { property: "og:title", content: "Risk Management — SignalOps Panel" },
      { property: "og:description", content: "Effective risk policy and version history." },
    ],
  }),
  component: RiskPage,
});

function RiskPage() {
  const t = useT();
  const q = useRiskPolicyVersions();
  const accountsQ = useAccounts();
  const effective = q.data?.[0];
  const [scope, setScope] = useState("all");
  const [draft, setDraft] = useState<{
    risk: number;
    loss: number;
    dd: number;
    budget: number;
    notes: string;
  }>({
    risk: 2000,
    loss: 120,
    dd: 400,
    budget: 260,
    notes: "",
  });

  useTopBar({
    title: t("nav.risk"),
    lastUpdatedIso: new Date().toISOString(),
    extraActions: (
      <Button
        size="sm"
        variant="outline"
        data-control-id={controls.risk.export}
        className="h-8 gap-1.5"
      >
        <Download className="h-3.5 w-3.5" />
        {t("risk.export")}
      </Button>
    ),
  });

  return (
    <div className="flex flex-col gap-4">
      <FixtureBanner />

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          {t("risk.margin_context.title")}: {t("risk.margin_context.desc")}
        </AlertDescription>
      </Alert>

      {q.isPending ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t("risk.effective")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label={t("risk.version")} value={`v${effective?.version}`} />
              <Row
                label={t("risk.native_amount")}
                value={
                  <NativeAmount
                    amount={effective?.nativeRiskAmount ?? 0}
                    currency={effective?.nativeCurrency ?? "USC"}
                  />
                }
              />
              <Row
                label={t("risk.daily_loss")}
                value={<MoneyUsd value={effective?.dailyLossLimitUsd ?? 0} />}
              />
              <Row
                label={t("risk.drawdown")}
                value={<MoneyUsd value={effective?.drawdownLimitUsd ?? 0} />}
              />
              <Row label={t("risk.margin_buffer")} value={`${effective?.marginBufferPct}%`} />
              <Row
                label={t("risk.budget")}
                value={<MoneyUsd value={effective?.riskBudgetUsd ?? 0} />}
              />
              <div className="pt-2 text-xs text-muted-foreground">{effective?.notes}</div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t("risk.edit_draft")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Account scope</Label>
                <select
                  className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  data-control-id={controls.risk.accountScope}
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                >
                  <option value="all">All accounts</option>
                  {(accountsQ.data ?? []).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.displayName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <NumField
                  label={t("risk.native_amount")}
                  v={draft.risk}
                  onChange={(v) => setDraft({ ...draft, risk: v })}
                />
                <NumField
                  label={t("risk.daily_loss")}
                  v={draft.loss}
                  onChange={(v) => setDraft({ ...draft, loss: v })}
                />
                <NumField
                  label={t("risk.drawdown")}
                  v={draft.dd}
                  onChange={(v) => setDraft({ ...draft, dd: v })}
                />
                <NumField
                  label={t("risk.budget")}
                  v={draft.budget}
                  onChange={(v) => setDraft({ ...draft, budget: v })}
                />
              </div>
              <div>
                <Label>{t("risk.notes")}</Label>
                <Input
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                />
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                <BackendRequiredDialog
                  controlId={controls.risk.previewImpact}
                  trigger={
                    <Button size="sm" variant="outline">
                      {t("risk.preview_impact")}
                    </Button>
                  }
                  title={t("risk.preview_impact")}
                  payloadPreview={{ intent: "risk.preview", scope, draft }}
                />
                <BackendRequiredDialog
                  controlId={controls.risk.compareVersions}
                  trigger={
                    <Button size="sm" variant="ghost">
                      {t("risk.compare_versions")}
                    </Button>
                  }
                  title={t("risk.compare_versions")}
                  payloadPreview={{
                    intent: "risk.compare",
                    from: effective?.version,
                    to: (effective?.version ?? 0) - 1,
                  }}
                />
                <BackendRequiredDialog
                  controlId={controls.risk.apply}
                  trigger={<Button size="sm">{t("risk.apply")}</Button>}
                  title={t("risk.apply")}
                  description={t("backend.desc")}
                  payloadPreview={{ intent: "risk.apply", scope, draft }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">History</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2">Version</th>
                    <th className="px-2 py-2">Author</th>
                    <th className="px-2 py-2">{t("risk.native_amount")}</th>
                    <th className="px-2 py-2 text-right">{t("risk.daily_loss")}</th>
                    <th className="px-2 py-2 text-right">{t("risk.drawdown")}</th>
                    <th className="px-2 py-2 text-right">{t("risk.margin_buffer")}</th>
                    <th className="px-2 py-2 text-right">{t("risk.budget")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {(q.data ?? []).map((v) => (
                    <tr key={v.version} className="border-b border-border/60 last:border-none">
                      <td className="px-4 py-2 font-medium">v{v.version}</td>
                      <td className="px-2 py-2 text-xs text-muted-foreground">{v.author}</td>
                      <td className="px-2 py-2">
                        <NativeAmount amount={v.nativeRiskAmount} currency={v.nativeCurrency} />
                      </td>
                      <td className="px-2 py-2 text-right">
                        <MoneyUsd value={v.dailyLossLimitUsd} />
                      </td>
                      <td className="px-2 py-2 text-right">
                        <MoneyUsd value={v.drawdownLimitUsd} />
                      </td>
                      <td className="px-2 py-2 text-right">{v.marginBufferPct}%</td>
                      <td className="px-2 py-2 text-right">
                        <MoneyUsd value={v.riskBudgetUsd} />
                      </td>
                      <td className="pr-3">
                        <BackendRequiredDialog
                          controlId={controls.risk.restoreVersion}
                          trigger={
                            <Button size="sm" variant="ghost">
                              {t("risk.restore")}
                            </Button>
                          }
                          title={t("risk.restore")}
                          payloadPreview={{ intent: "risk.restore", version: v.version }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
function NumField({
  label,
  v,
  onChange,
}: {
  label: string;
  v: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type="number" value={v} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
