import { useEffect, useState } from "react";
import { useI18n, useT } from "@/lib/i18n";

/**
 * Human-friendly "last updated" indicator. Shows "Just updated" for < 5s,
 * then relative time. Never shows the misleading "Updated 0s ago" phrasing.
 */
export function LastUpdated({ iso }: { iso: string | null }) {
  const t = useT();
  const { locale } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!iso) return;
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, [iso]);

  if (!iso) return <span>—</span>;

  const diffSec = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  const prefix = `${t("shell.last_updated")} · `;

  if (diffSec < 5)
    return (
      <span>
        {prefix}
        {t("shell.just_updated")}
      </span>
    );
  if (diffSec < 60) {
    const key = "shell.updated_seconds_ago" as const;
    return (
      <span>
        {prefix}
        {format(t(key), diffSec)}
      </span>
    );
  }
  const min = Math.round(diffSec / 60);
  if (min < 60) {
    return (
      <span>
        {prefix}
        {format(t("shell.updated_minutes_ago"), min)}
      </span>
    );
  }
  const hr = Math.round(min / 60);
  if (hr < 48) {
    return (
      <span>
        {prefix}
        {format(t("shell.updated_hours_ago"), hr)}
      </span>
    );
  }
  const day = Math.round(hr / 24);
  return (
    <span>
      {prefix}
      {format(t("shell.updated_days_ago"), day)}
    </span>
  );

  function format(tpl: string, n: number) {
    // locale kept in scope so the closure re-runs when Intl-dependent code needs it.
    void locale;
    return tpl.replace("{n}", String(n));
  }
}
