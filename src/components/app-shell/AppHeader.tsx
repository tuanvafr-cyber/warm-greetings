import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  EyeOff,
  Eye,
  Inbox,
  Menu,
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
import { usePreferences } from "@/lib/preferences";
import { controls } from "@/lib/control-registry";
import { cn } from "@/lib/utils";

// Fixture — clearly labelled. Real list arrives from Codex via account query.
const FIXTURE_ACCOUNTS = [
  { id: "acc-usc-001", label: "USC-001 · Alpha" },
  { id: "acc-usc-002", label: "USC-002 · Beta" },
  { id: "acc-usd-101", label: "USD-101 · Live" },
];

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

  const scopeLabel =
    accountScope === "all" ? t("shell.account_scope.all") : accountScope.label;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur sm:px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobileNav}
        aria-label={t("shell.expand")}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Account scope */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            data-control-id={controls.shell.accountScopeOpen}
            className="gap-2"
          >
            <span className="text-xs font-medium text-muted-foreground">{t("shell.account_scope")}:</span>
            <span className="max-w-[160px] truncate font-semibold">{scopeLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
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
            onSelect={() =>
              pinAccount(
                accountScope === "all" ? "all" : accountScope.id,
              )
            }
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

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          data-control-id={controls.shell.refresh}
          title={t("common.refresh")}
          aria-label={t("common.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          data-control-id={controls.shell.privacyToggle}
          onClick={togglePrivacy}
          title={privacyMode ? t("shell.privacy.on") : t("shell.privacy.off")}
          aria-pressed={privacyMode}
          className={cn("gap-2", privacyMode && "text-primary")}
        >
          {privacyMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="hidden sm:inline">{t("shell.privacy")}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              data-control-id={controls.shell.languageToggle}
              className="gap-2"
              aria-label={t("shell.language")}
            >
              <Languages className="h-4 w-4" />
              <span className="hidden text-xs font-semibold uppercase sm:inline">{locale}</span>
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

        <Button variant="ghost" size="icon" asChild title={t("shell.inbox")} data-control-id={controls.shell.inboxOpen}>
          <Link to="/inbox" aria-label={t("shell.inbox")}>
            <Inbox className="h-4 w-4" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-control-id={controls.shell.exportOpen} title={t("shell.export")}>
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
            <Button variant="ghost" size="icon" data-control-id={controls.shell.shareOpen} title={t("shell.share")}>
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
    </header>
  );
}
