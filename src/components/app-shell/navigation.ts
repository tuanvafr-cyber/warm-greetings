import {
  Activity,
  Boxes,
  Compass,
  Gauge,
  History,
  Inbox,
  LineChart,
  ListTree,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { TKey } from "@/lib/i18n/dictionary";

export type NavItem = {
  to: string;
  labelKey: TKey;
  icon: LucideIcon;
};

export type NavGroup = {
  labelKey: TKey;
  items: NavItem[];
};

/**
 * SignalOps IA — final grouping (Daily / Configuration / System).
 * See CONTINUE_AND_COMPLETE_THE_EXISTING_FRONTEND_WAVE — decision final.
 */
export const NAV: NavGroup[] = [
  {
    labelKey: "nav.group.daily",
    items: [
      { to: "/", labelKey: "nav.dashboard", icon: Gauge },
      { to: "/inbox", labelKey: "nav.inbox", icon: Inbox },
      { to: "/accounts", labelKey: "nav.accounts", icon: Boxes },
      { to: "/signals", labelKey: "nav.signals", icon: Radio },
      { to: "/positions", labelKey: "nav.positions", icon: Activity },
      { to: "/orders", labelKey: "nav.orders", icon: History },
    ],
  },
  {
    labelKey: "nav.group.configuration",
    items: [
      { to: "/sources", labelKey: "nav.sources", icon: ListTree },
      { to: "/risk", labelKey: "nav.risk", icon: ShieldCheck },
      { to: "/telegram", labelKey: "nav.telegram_ai", icon: Send },
      { to: "/hermes", labelKey: "nav.hermes", icon: Sparkles },
    ],
  },
  {
    labelKey: "nav.group.system",
    items: [
      { to: "/runtime", labelKey: "nav.runtime", icon: LineChart },
      { to: "/trace", labelKey: "nav.trace_audit", icon: Compass },
    ],
  },
];
