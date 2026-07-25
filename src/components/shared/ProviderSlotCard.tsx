import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { TimeAgo } from "@/components/shared/MoneyText";
import { BackendRequiredDialog } from "@/components/shared/BackendRequiredDialog";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import type { ProviderSlot } from "@/data/contracts";

/**
 * Analysis API Slot card. NEVER performs a real provider call and NEVER
 * fakes a successful switch — every action opens a truthful "backend
 * required" dialog.
 */
function slotTone(s: ProviderSlot["state"]): StatusTone {
  return s === "active" || s === "ready" ? "healthy"
    : s === "probing" ? "input_required"
    : s === "cooldown" ? "input_required"
    : s === "circuit_open" ? "blocked"
    : s === "degraded" ? "degraded"
    : s === "failed" ? "unavailable"
    : "archived";
}

export function ProviderSlotCard({ slot }: { slot: ProviderSlot }) {
  const t = useT();
  const roleKey = `slot.role.${slot.role}` as const;
  const stateKey = `slot.state.${slot.state}` as const;
  return (
    <Card data-slot-id={slot.slot}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-sm">
          <span className="min-w-0 truncate">
            {slot.label}
            <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
              {t(roleKey)}
            </span>
          </span>
          <div className="flex items-center gap-1.5">
            <StatusBadge tone={slotTone(slot.state)} />
            <span className="text-[11px] text-muted-foreground">{t(stateKey)}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <p className="text-xs text-muted-foreground">{slot.note}</p>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <div>{t("slot.assigned")}</div>
          <div className="text-right">{slot.assignedProviderId ?? "—"}</div>
          <div>{t("slot.attempts")}</div>
          <div className="text-right tabular-nums">{slot.attempts} / {slot.maxAttempts}</div>
          <div>{t("slot.last_attempt")}</div>
          <div className="text-right"><TimeAgo iso={slot.lastAttemptAt} /></div>
          {slot.slot === 1 && (
            <>
              <div>{t("slot.recovery_probe")}</div>
              <div className="text-right">{slot.recoveryProbeSeconds}s · <TimeAgo iso={slot.lastRecoveryProbeAt} /></div>
            </>
          )}
          <div>{t("slot.cooldown")}</div>
          <div className="text-right">{slot.cooldownEndsAt ? <TimeAgo iso={slot.cooldownEndsAt} /> : "—"}</div>
          <div>{t("slot.circuit")}</div>
          <div className="text-right">{slot.circuitOpenedAt ? t("slot.state.circuit_open") : "—"}</div>

          <div>{t("slot.last_failover")}</div>
          <div className="text-right"><TimeAgo iso={slot.lastFailoverAt} /></div>
          <div>{t("slot.last_failback")}</div>
          <div className="text-right"><TimeAgo iso={slot.lastFailbackAt} /></div>
        </div>
        <div className="flex flex-wrap gap-1.5 border-t border-border pt-2">
          <BackendRequiredDialog
            controlId={controls.analysisProviders.assignSlot}
            trigger={<Button size="sm" variant="outline">{t("slot.assign")}</Button>}
            title={t("slot.assign")}
            payloadPreview={{ intent: "analysis_providers.assign_slot", slot: slot.slot }}
          />
          <BackendRequiredDialog
            controlId={controls.analysisProviders.test}
            trigger={<Button size="sm" variant="ghost">{t("provider.test")}</Button>}
            title={t("provider.test")}
            payloadPreview={{ intent: "analysis_providers.test", slot: slot.slot }}
          />
          <BackendRequiredDialog
            controlId={controls.analysisProviders.enable}
            trigger={<Button size="sm">{t("common.enable")}</Button>}
            title={t("common.enable")}
            description={t("slot.no_fake_switch")}
            payloadPreview={{ intent: "analysis_providers.enable", slot: slot.slot }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function RoutingPolicyPanel({
  policy,
}: {
  policy: {
    version: number;
    strategy: string;
    failoverAfterAttempts: number;
    failbackWhen: string;
    recoveryProbeSeconds: number;
    cooldownSeconds: number;
    circuitResetSeconds: number;
    updatedAt: string;
    updatedBy: string;
  };
}) {
  const t = useT();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          {t("routing.title")}{" "}
          <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">v{policy.version}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <div>{t("routing.strategy")}</div>
          <div className="text-right">{t(`routing.strategy.${policy.strategy}`)}</div>
          <div>{t("routing.failover_after")}</div>
          <div className="text-right tabular-nums">{policy.failoverAfterAttempts} / 5</div>
          <div>{t("routing.failback_when")}</div>
          <div className="text-right">{t(`routing.failback.${policy.failbackWhen}`)}</div>
          <div>{t("routing.recovery_probe")}</div>
          <div className="text-right tabular-nums">{policy.recoveryProbeSeconds}s</div>
          <div>{t("routing.cooldown")}</div>
          <div className="text-right tabular-nums">{policy.cooldownSeconds}s</div>
          <div>{t("routing.circuit_reset")}</div>
          <div className="text-right tabular-nums">{policy.circuitResetSeconds}s</div>
          <div>{t("routing.updated_by")}</div>
          <div className="text-right">{policy.updatedBy} · <TimeAgo iso={policy.updatedAt} /></div>
        </div>
        <div className="flex flex-wrap gap-1.5 border-t border-border pt-2">
          <BackendRequiredDialog
            controlId={controls.analysisProviders.routingPolicy}
            trigger={<Button size="sm" variant="outline">{t("routing.edit")}</Button>}
            title={t("routing.edit")}
            payloadPreview={{ intent: "analysis_providers.routing_policy" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
