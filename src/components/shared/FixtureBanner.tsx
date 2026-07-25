import { useT } from "@/lib/i18n";
import { AlertCircle } from "lucide-react";

/**
 * Subtle fixture banner — placed once per page that renders fixture data.
 * NEVER masqueraded as live operational state.
 */
export function FixtureBanner() {
  const t = useT();
  return (
    <div
      role="note"
      aria-label="fixture-notice"
      className="flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-1.5 text-[11px] font-medium text-warning-foreground"
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{t("fixture.notice")}</span>
    </div>
  );
}
