"use client";

import {
  Bar,
  BarChart,
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

type Row = { name: string; top: number; hot: number };

const config: ChartConfig = {
  top: { label: "Votes Top", color: "var(--chart-1)" },
  hot: { label: "Votes Hot", color: "var(--chart-2)" },
};

export function VotersLeaderboardChart({ data }: { data: Row[] }) {
  return (
    <div className="space-y-3">
      <ChartLegend config={config} className="justify-end" />
      <ChartContainer
        config={config}
        className="w-full"
        // hauteur dynamique : ~34 px par ligne pour rester lisible
      >
        <ResponsiveContainer
          width="100%"
          height={Math.max(180, data.length * 34 + 24)}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            barSize={14}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="2 4"
              stroke="var(--chart-grid)"
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              width={96}
              tick={{ fill: "var(--c-text-2)" }}
              tickFormatter={(v: string) =>
                v.length > 14 ? `${v.slice(0, 13)}…` : v
              }
            />
            <Tooltip
              cursor={{ fill: "var(--c-hover)" }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="top" stackId="v" fill="var(--chart-1)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="hot" stackId="v" fill="var(--chart-2)" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
