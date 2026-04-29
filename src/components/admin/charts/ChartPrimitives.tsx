"use client";

/**
 * ChartPrimitives — wrapper inspiré de shadcn/ui pour Recharts.
 * Tous les styles utilisent les tokens `--chart-*` / `--c-*` définis dans
 * admin.css, donc les graphiques suivent automatiquement le thème jour/nuit.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label: React.ReactNode;
    color?: string;
  }
>;

const ChartContext = React.createContext<ChartConfig | null>(null);

function useChartConfig() {
  const ctx = React.useContext(ChartContext);
  return ctx;
}

export function ChartContainer({
  config,
  className,
  children,
}: {
  config: ChartConfig;
  className?: string;
  children: React.ReactElement;
}) {
  return (
    <ChartContext.Provider value={config}>
      <div
        className={cn(
          "relative w-full text-[12px] [&_.recharts-cartesian-grid_line]:stroke-[color:var(--chart-grid)] [&_.recharts-cartesian-axis_line]:stroke-[color:var(--chart-grid)] [&_.recharts-cartesian-axis-tick_text]:fill-[color:var(--chart-axis)] [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-text]:fill-[color:var(--c-text-2)]",
          className,
        )}
        style={
          Object.fromEntries(
            Object.entries(config)
              .filter(([, v]) => v.color)
              .map(([k, v]) => [`--color-${k}`, v.color!]),
          ) as React.CSSProperties
        }
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

/* ---- Tooltip ---- */

type TooltipPayload = {
  name?: string;
  value?: number | string;
  dataKey?: string;
  color?: string;
  payload?: Record<string, unknown>;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  indicator = "dot",
  hideLabel,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: React.ReactNode;
  labelFormatter?: (v: React.ReactNode) => React.ReactNode;
  valueFormatter?: (v: number | string, name?: string) => React.ReactNode;
  indicator?: "dot" | "line";
  hideLabel?: boolean;
}) {
  const config = useChartConfig();
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="min-w-[140px] rounded-[8px] border shadow-md overflow-hidden"
      style={{
        background: "var(--chart-tooltip-bg)",
        borderColor: "var(--chart-tooltip-border)",
        color: "var(--chart-tooltip-text)",
      }}
    >
      {!hideLabel && label !== undefined && (
        <div
          className="px-3 pt-2 pb-1 text-[11px] font-medium"
          style={{ color: "var(--c-text-3)" }}
        >
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <ul className="px-3 pb-2 pt-1 space-y-1">
        {payload.map((item, i) => {
          const key = item.dataKey ?? item.name ?? `i-${i}`;
          const color = item.color ?? config?.[key]?.color ?? "var(--c-text)";
          const label = config?.[key]?.label ?? item.name ?? key;
          return (
            <li
              key={`${key}-${i}`}
              className="flex items-center gap-2 text-[12px]"
            >
              {indicator === "dot" ? (
                <span
                  aria-hidden
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ background: color }}
                />
              ) : (
                <span
                  aria-hidden
                  className="inline-block w-3 h-[2px] shrink-0"
                  style={{ background: color }}
                />
              )}
              <span className="flex-1 truncate" style={{ color: "var(--c-text-2)" }}>
                {label}
              </span>
              <span className="font-semibold tabular-nums">
                {valueFormatter && item.value !== undefined
                  ? valueFormatter(item.value, key)
                  : item.value}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---- Legend ---- */

export function ChartLegend({
  config,
  className,
}: {
  config: ChartConfig;
  className?: string;
}) {
  const entries = Object.entries(config).filter(([, v]) => v.color);
  if (entries.length === 0) return null;
  return (
    <ul className={cn("flex items-center flex-wrap gap-4", className)}>
      {entries.map(([key, cfg]) => (
        <li
          key={key}
          className="inline-flex items-center gap-1.5 text-[11px]"
          style={{ color: "var(--c-text-3)" }}
        >
          <span
            aria-hidden
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: cfg.color }}
          />
          {cfg.label}
        </li>
      ))}
    </ul>
  );
}
