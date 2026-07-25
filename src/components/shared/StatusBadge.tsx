import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

export type StatusTone =
  | "healthy"
  | "degraded"
  | "input_required"
  | "blocked"
  | "stale"
  | "unavailable"
  | "not_connected"
  | "active"
  | "disabled"
  | "draining"
  | "archived"
  | "frozen";

const toneClass: Record<StatusTone, string> = {
  healthy: "bg-success/15 text-success border-success/30",
  active: "bg-success/15 text-success border-success/30",
  degraded: "bg-warning/15 text-warning-foreground border-warning/40",
  input_required: "bg-info/15 text-info border-info/30",
  blocked: "bg-destructive/15 text-destructive border-destructive/30",
  stale: "bg-muted text-muted-foreground border-border",
  unavailable: "bg-muted text-muted-foreground border-border",
  not_connected: "bg-muted text-muted-foreground border-border",
  disabled: "bg-muted text-muted-foreground border-border",
  draining: "bg-warning/15 text-warning-foreground border-warning/40",
  archived: "bg-muted text-muted-foreground border-border",
  frozen: "bg-muted text-muted-foreground border-border",
};

const labelKey: Record<StatusTone, TKey> = {
  healthy: "status.healthy",
  degraded: "status.degraded",
  input_required: "status.input_required",
  blocked: "status.blocked",
  stale: "status.stale",
  unavailable: "status.unavailable",
  not_connected: "status.not_connected",
  active: "source.active",
  disabled: "source.disabled",
  draining: "source.draining",
  archived: "source.archived",
  frozen: "source.frozen",
};

export function StatusBadge({ tone, className }: { tone: StatusTone; className?: string }) {
  const t = useT();
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", toneClass[tone], className)}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {t(labelKey[tone])}
    </Badge>
  );
}
