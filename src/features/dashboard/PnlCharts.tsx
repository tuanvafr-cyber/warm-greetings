import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import type { PnlPoint } from "@/data/contracts";
import { useT } from "@/lib/i18n";

export function BalanceEquityChart({ data }: { data: PnlPoint[] }) {
  return (
    <div className="h-full min-h-[240px] w-full">

      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="eq" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} width={44} />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              borderColor: "var(--color-border)",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--color-muted-foreground)"
            strokeWidth={1.5}
            fillOpacity={0}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#eq)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PnlOverTimeChart({ data }: { data: PnlPoint[] }) {
  const t = useT();
  void t;
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} width={44} />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              borderColor: "var(--color-border)",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="pnl"
            stroke="oklch(0.72 0.15 150)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
