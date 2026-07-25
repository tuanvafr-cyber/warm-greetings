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

export const NAV: NavGroup[] = [
  {
    labelKey: "nav.primary",
    items: [
      { to: "/", labelKey: "nav.dashboard", icon: Gauge },
      { to: "/accounts", labelKey: "nav.accounts", icon: Boxes },
      { to: "/signals", labelKey: "nav.signals", icon: Radio },
      { to: "/positions", labelKey: "nav.positions", icon: Activity },
      { to: "/orders", labelKey: "nav.orders", icon: History },
    ],
  },
  {
    labelKey: "nav.operations",
    items: [
      { to: "/sources", labelKey: "nav.sources", icon: ListTree },
      { to: "/risk", labelKey: "nav.risk", icon: ShieldCheck },
      { to: "/telegram", labelKey: "nav.telegram", icon: Send },
    ],
  },
  {
    labelKey: "nav.intelligence",
    items: [{ to: "/hermes", labelKey: "nav.hermes", icon: Sparkles }],
  },
  {
    labelKey: "nav.system",
    items: [
      { to: "/runtime", labelKey: "nav.runtime", icon: LineChart },
      { to: "/inbox", labelKey: "nav.inbox", icon: Inbox },
      { to: "/trace", labelKey: "nav.trace", icon: Compass },
    ],
  },
];
