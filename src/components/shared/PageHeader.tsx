import type { ReactNode } from "react";

/**
 * DEPRECATED — the compact global TopBar (AppHeader) now owns the page title,
 * last-updated indicator, time range and action cluster. PageHeader remains
 * as a no-op wrapper only so unmigrated routes continue to type-check while
 * their toolbars are lifted into the TopBar via `useTopBar`.
 *
 * If a route still passes `actions`, they are surfaced inline as a compact
 * toolbar row so we never lose functionality during the migration.
 */
export function PageHeader({
  actions,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  if (!actions) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 pb-2">
      {actions}
    </div>
  );
}
