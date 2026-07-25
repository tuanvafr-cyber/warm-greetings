import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { NAV } from "./navigation";
import { useT } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { controls } from "@/lib/control-registry";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebar } = usePreferences();
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <aside
      data-collapsed={sidebarCollapsed}
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        sidebarCollapsed ? "w-[68px]" : "w-[264px]",
      )}
      aria-label="Primary"
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border px-3",
          sidebarCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!sidebarCollapsed ? (
          <Link to="/" className="flex items-center gap-2">
            <BrandMark />
            <span className="text-sm font-semibold tracking-tight">SignalOps</span>
          </Link>
        ) : (
          <Link to="/" aria-label="SignalOps">
            <BrandMark />
          </Link>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          data-control-id={controls.shell.sidebarToggle}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            sidebarCollapsed && "hidden",
          )}
          aria-label={t("shell.collapse")}
          title={t("shell.collapse")}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      {sidebarCollapsed ? (
        <button
          type="button"
          onClick={toggleSidebar}
          data-control-id={controls.shell.sidebarToggle}
          className="mx-auto mt-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label={t("shell.expand")}
          title={t("shell.expand")}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      ) : null}

      <nav className="flex-1 overflow-y-auto py-3">
        <TooltipProvider delayDuration={100}>
          {NAV.map((group) => (
            <div key={group.labelKey} className="px-2 pb-4">
              {!sidebarCollapsed ? (
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {t(group.labelKey)}
                </p>
              ) : (
                <div className="mx-2 mb-1 border-t border-sidebar-border" />
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);
                  const link = (
                    <Link
                      to={item.to}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        sidebarCollapsed && "justify-center",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{t(item.labelKey)}</span>}
                    </Link>
                  );
                  if (!sidebarCollapsed) {
                    return <li key={item.to}>{link}</li>;
                  }
                  return (
                    <li key={item.to}>
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}

function BrandMark() {
  return (
    <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 17l4-4 3 3 5-7 6 8" />
      </svg>
    </div>
  );
}
