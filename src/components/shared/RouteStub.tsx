import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { NotConnectedState } from "./StateViews";
import type { TKey } from "@/lib/i18n/dictionary";
import { useT } from "@/lib/i18n";

/**
 * Route stubs render page chrome + a clearly labelled "not connected" state.
 * They are NEVER "Coming soon" — the UI is ready, adapter wiring is what's
 * pending. Every route file uses this until its rich content lands in Phase 2+.
 */
export function RouteStub({
  titleKey,
  descriptionKey,
  actions,
  children,
}: {
  titleKey: TKey;
  descriptionKey?: TKey;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const t = useT();
  return (
    <div className="flex flex-col">
      <PageHeader
        title={t(titleKey)}
        description={descriptionKey ? t(descriptionKey) : undefined}
        actions={actions}
      />
      {children ?? <NotConnectedState />}
    </div>
  );
}
