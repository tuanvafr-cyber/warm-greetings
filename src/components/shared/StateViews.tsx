import type { ReactNode } from "react";
import { AlertCircle, CircleDashed, Inbox, PlugZap, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function BaseState({
  icon,
  title,
  desc,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  desc?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/50 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="text-muted-foreground">{icon}</div>
      <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
      {desc ? <p className="mt-1 max-w-md text-sm text-muted-foreground">{desc}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label }: { label?: string }) {
  const t = useT();
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <p className="sr-only">{label ?? t("state.loading")}</p>
    </div>
  );
}

export function EmptyState({ title, desc }: { title?: string; desc?: string }) {
  const t = useT();
  return (
    <BaseState
      icon={<Inbox className="h-8 w-8" />}
      title={title ?? t("state.empty.title")}
      desc={desc ?? t("state.empty.desc")}
    />
  );
}

export function NotConnectedState({
  title,
  desc,
  action,
}: {
  title?: string;
  desc?: string;
  action?: ReactNode;
}) {
  const t = useT();
  return (
    <BaseState
      icon={<PlugZap className="h-8 w-8" />}
      title={title ?? t("state.not_connected.title")}
      desc={desc ?? t("state.not_connected.desc")}
      action={action}
    />
  );
}

export function BlockedState({ title, desc }: { title?: string; desc?: string }) {
  const t = useT();
  return (
    <BaseState
      icon={<ShieldAlert className="h-8 w-8 text-destructive" />}
      title={title ?? t("state.blocked.title")}
      desc={desc ?? t("state.blocked.desc")}
    />
  );
}

export function ErrorState({
  title,
  desc,
  onRetry,
}: {
  title?: string;
  desc?: string;
  onRetry?: () => void;
}) {
  const t = useT();
  return (
    <BaseState
      icon={<AlertCircle className="h-8 w-8 text-destructive" />}
      title={title ?? t("state.error.title")}
      desc={desc ?? t("state.error.desc")}
      action={
        onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        ) : undefined
      }
    />
  );
}

export function UnavailableState({ title, desc }: { title?: string; desc?: string }) {
  const t = useT();
  return (
    <BaseState
      icon={<CircleDashed className="h-8 w-8" />}
      title={title ?? t("state.unavailable.title")}
      desc={desc ?? t("state.unavailable.desc")}
    />
  );
}

export function FixtureNotice() {
  const t = useT();
  return (
    <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
      {t("fixture.notice")}
    </div>
  );
}
