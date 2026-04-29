"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
  type ChartConfig,
} from "./ChartPrimitives";

type Point = { date: string; top: number; hot: number };

const config: ChartConfig = {
  top: { label: "Top de la semaine", color: "var(--chart-1)" },
  hot: { label: "Hot Take", color: "var(--chart-2)" },
};

function shortDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export function EngagementChart({ data }: { data: Point[] }) {
  return (
    <div className="space-y-3">
      <ChartLegend config={config} className="justify-end" />
      <ChartContainer config={config} className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-hot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 4"
              stroke="var(--chart-grid)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={shortDate}
              tickLine={false}
              axisLine={false}
              fontSize={11}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={11}
              width={30}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ stroke: "var(--chart-grid)", strokeDasharray: "2 3" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(v) => shortDate(String(v))}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="top"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#grad-top)"
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="hot"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#grad-hot)"
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
