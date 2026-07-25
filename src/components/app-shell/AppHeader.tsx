import { Link, useRouterState } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  EyeOff,
  Eye,
  Inbox,
  Menu,
  MoreHorizontal,
  RefreshCw,
  Share2,
  Download,
  Pin,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, useT } from "@/lib/i18n";
import type { TKey } from "@/lib/i18n/dictionary";
import { usePreferences } from "@/lib/preferences";
import { controls } from "@/lib/control-registry";
import { cn } from "@/lib/utils";
import { TimeRangePicker } from "@/components/shared/TimeRangePicker";
import { useTopBarState } from "@/lib/topbar";
import { LastUpdated } from "@/components/shared/LastUpdated";

// Fixture — clearly labelled. Real list arrives from Codex via account query.
const FIXTURE_ACCOUNTS = [
  { id: "acc-usc-001", label: "USC-001 · Alpha" },
  { id: "acc-usc-002", label: "USC-002 · Beta" },
  { id: "acc-usd-101", label: "USD-101 · Live" },
];

const TITLE_BY_PATH: Record<string, TKey> = {
  "/": "nav.dashboard",
  "/accounts": "nav.accounts",
  "/signals": "nav.signals",
  "/positions": "nav.positions",
  "/orders": "nav.orders",
  "/sources": "nav.sources",
  "/risk": "nav.risk",
  "/telegram": "nav.telegram",
  "/hermes": "nav.hermes",
  "/runtime": "nav.runtime",
  "/inbox": "nav.inbox",
  "/trace": "nav.trace",
};

function useRouteTitleKey(): TKey {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (TITLE_BY_PATH[pathname]) return TITLE_BY_PATH[pathname];
  const prefix = Object.keys(TITLE_BY_PATH).find(
    (p) => p !== "/" && pathname.startsWith(p),
  );
  return prefix ? TITLE_BY_PATH[prefix] : "app.name";
}

export function AppHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const t = useT();
  const { locale, setLocale } = useI18n();
  const {
    privacyMode,
    togglePrivacy,
    accountScope,
    setAccountScope,
    pinnedAccountId,
    pinAccount,
  } = usePreferences();

  const titleKey = useRouteTitleKey();
  const top = useTopBarState();
  const scopeLabel =
    accountScope === "all" ? t("shell.account_scope.all") : accountScope.label;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      {/* Row 1 — desktop is a single row; tablet/mobile splits into two rows via wrap. */}
      <div className="flex h-12 items-center gap-2 px-3 sm:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onOpenMobileNav}
          aria-label={t("shell.expand")}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Account scope — hidden on the narrowest widths where row 2 owns it */}
        <div className="hidden sm:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                data-control-id={controls.shell.accountScopeOpen}
                className="h-8 gap-1.5 px-2 text-xs font-medium"
              >
                <span className="text-[10px] uppercase text-muted-foreground">
                  {t("shell.account_scope")}
                </span>
                <span className="max-w-[140px] truncate font-semibold">{scopeLabel}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>{t("shell.account_scope")}</DropdownMenuLabel>
              <DropdownMenuItem
                data-control-id={controls.shell.accountScopeSelectAll}
                onSelect={() => setAccountScope("all")}
              >
                {accountScope === "all" ? <Check className="mr-2 h-4 w-4" /> : <span className="mr-2 w-4" />}
                {t("shell.account_scope.all")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {FIXTURE_ACCOUNTS.map((a) => {
                const selected = accountScope !== "all" && accountScope.id === a.id;
                return (
                  <DropdownMenuItem
                    key={a.id}
                    data-control-id={controls.shell.accountScopeSelectExact}
                    onSelect={() => setAccountScope({ id: a.id, label: a.label })}
                  >
                    {selected ? <Check className="mr-2 h-4 w-4" /> : <span className="mr-2 w-4" />}
                    <span className="truncate">{a.label}</span>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-control-id={controls.shell.accountScopePin}
                onSelect={() => pinAccount(accountScope === "all" ? "all" : accountScope.id)}
              >
                <Pin className="mr-2 h-4 w-4" />
                {t("shell.account_scope.pin")}
                {pinnedAccountId ? (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {pinnedAccountId === "all" ? "all" : pinnedAccountId}
                  </span>
                ) : null}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Page title */}
        <h1
          data-control-id={controls.shell.pageTitle}
          className="min-w-0 truncate text-sm font-semibold sm:text-base"
          title={t(titleKey)}
        >
          {top.title ?? t(titleKey)}
        </h1>

        <div className="ml-auto flex items-center gap-1">
          {/* Last updated + Time range (desktop) */}
          <span
            className="hidden text-[11px] text-muted-foreground lg:inline-flex"
            data-control-id={controls.shell.lastUpdated}
          >
            <LastUpdated iso={top.lastUpdatedIso ?? null} />
          </span>
          {top.showTimeRange ? <TimeRangePicker /> : null}
          {top.extraActions ? (
            <div className="hidden items-center gap-1 md:flex">{top.extraActions}</div>
          ) : null}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            data-control-id={controls.shell.refresh}
            title={t("common.refresh")}
            aria-label={t("common.refresh")}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            data-control-id={controls.shell.privacyToggle}
            onClick={togglePrivacy}
            title={privacyMode ? t("shell.privacy.on") : t("shell.privacy.off")}
            aria-pressed={privacyMode}
            aria-label={t("shell.privacy")}
            className={cn("h-8 w-8", privacyMode && "text-primary")}
          >
            {privacyMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                data-control-id={controls.shell.languageToggle}
                aria-label={t("shell.language")}
                title={t("shell.language")}
              >
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setLocale("vi")}>
                {locale === "vi" ? <Check className="mr-2 h-4 w-4" /> : <span className="mr-2 w-4" />}
                Tiếng Việt
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLocale("en")}>
                {locale === "en" ? <Check className="mr-2 h-4 w-4" /> : <span className="mr-2 w-4" />}
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" asChild className="h-8 w-8" title={t("shell.inbox")} data-control-id={controls.shell.inboxOpen}>
            <Link to="/inbox" aria-label={t("shell.inbox")}>
              <Inbox className="h-4 w-4" />
            </Link>
          </Button>

          {/* Overflow: Export + Share collapse into one menu on narrow widths */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" data-control-id={controls.shell.exportOpen} title={t("shell.export")}>
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("shell.export")}</DropdownMenuLabel>
                <DropdownMenuItem disabled>CSV</DropdownMenuItem>
                <DropdownMenuItem disabled>JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" data-control-id={controls.shell.shareOpen} title={t("shell.share")}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>{t("shell.share")}</DropdownMenuLabel>
                <DropdownMenuItem data-control-id={controls.shell.shareHideSensitive}>
                  <EyeOff className="mr-2 h-4 w-4" />
                  {t("shell.share.hide_sensitive")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden"
                data-control-id={controls.shell.overflow}
                title={t("shell.overflow")}
                aria-label={t("shell.overflow")}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-control-id={controls.shell.exportOpen}>
                <Download className="mr-2 h-4 w-4" />
                {t("shell.export")}
              </DropdownMenuItem>
              <DropdownMenuItem data-control-id={controls.shell.shareOpen}>
                <Share2 className="mr-2 h-4 w-4" />
                {t("shell.share")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Row 2 — tablet/mobile only: account scope + last-updated */}
      <div className="flex h-9 items-center gap-2 border-t border-border/60 px-3 sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              data-control-id={controls.shell.accountScopeOpen}
              className="h-7 gap-1 px-2 text-[11px]"
            >
              <span className="max-w-[120px] truncate font-semibold">{scopeLabel}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>{t("shell.account_scope")}</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => setAccountScope("all")}>
              {accountScope === "all" ? <Check className="mr-2 h-4 w-4" /> : <span className="mr-2 w-4" />}
              {t("shell.account_scope.all")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {FIXTURE_ACCOUNTS.map((a) => (
              <DropdownMenuItem
                key={a.id}
                onSelect={() => setAccountScope({ id: a.id, label: a.label })}
              >
                <span className="truncate">{a.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {top.showTimeRange ? <TimeRangePicker /> : null}
        <span className="ml-auto text-[11px] text-muted-foreground">
          <LastUpdated iso={top.lastUpdatedIso ?? null} />
        </span>
      </div>
    </header>
  );
}
