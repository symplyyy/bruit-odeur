"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "./ChartPrimitives";

type Slice = { name: string; value: number; key: "top" | "hot" };

const config: ChartConfig = {
  top: { label: "Top de la semaine", color: "var(--chart-1)" },
  hot: { label: "Hot Take", color: "var(--chart-2)" },
};

export function VotesBreakdownChart({ data }: { data: Slice[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className="grid grid-cols-[150px_1fr] gap-5 items-center">
      <ChartContainer config={config} className="w-[150px]">
        <ResponsiveContainer width={150} height={150}>
          <PieChart>
            <Tooltip
              content={
                <ChartTooltipContent
                  valueFormatter={(v) =>
                    total > 0 ? `${v} · ${Math.round((Number(v) / total) * 100)}%` : String(v)
                  }
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={68}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((slice) => (
                <Cell
                  key={slice.key}
                  fill={`var(--chart-${slice.key === "top" ? "1" : "2"})`}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ul className="min-w-0 space-y-2.5">
        {data.map((slice) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <li key={slice.key} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-[12px]">
                <span className="inline-flex items-center gap-1.5 text-[color:var(--c-text-2)] min-w-0">
                  <span
                    aria-hidden
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background:
                        slice.key === "top"
                          ? "var(--chart-1)"
                          : "var(--chart-2)",
                    }}
                  />
                  <span className="truncate">{slice.name}</span>
                </span>
                <span className="font-semibold tabular-nums shrink-0">
                  {slice.value}
                </span>
              </div>
              <div className="h-1 w-full bg-[color:var(--c-surface-3)] overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background:
                      slice.key === "top"
                        ? "var(--chart-1)"
                        : "var(--chart-2)",
                  }}
                />
              </div>
              <div className="text-[11px] text-[color:var(--c-text-3)] text-right tabular-nums">
                {pct}%
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
