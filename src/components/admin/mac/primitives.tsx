"use client";

import { cn } from "@/lib/utils";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { forwardRef } from "react";

/* ------------------------------------------------------------------ */
/*  Surfaces                                                           */
/* ------------------------------------------------------------------ */

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn("ui-surface rounded-[10px]", className)}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */

type BtnVariant = "default" | "primary" | "accent" | "danger" | "ghost";
type MacBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: "sm" | "md";
  icon?: ReactNode;
};

export const MacButton = forwardRef<HTMLButtonElement, MacBtnProps>(
  function MacButton(
    { className, variant = "default", size = "md", icon, children, type, ...rest },
    ref,
  ) {
    const variants: Record<BtnVariant, string> = {
      default: "",
      primary: "ui-btn-primary",
      accent: "ui-btn-accent",
      danger: "ui-btn-danger",
      ghost: "ui-btn-ghost",
    };
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "ui-btn",
          variants[variant],
          size === "sm" && "ui-btn-sm",
          className,
        )}
        {...rest}
      >
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </button>
    );
  },
);

type IconBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip?: string;
  active?: boolean;
  size?: "sm" | "md";
};

export const IconButton = forwardRef<HTMLButtonElement, IconBtnProps>(
  function IconButton(
    { className, tooltip, active, children, type, size = "md", ...rest },
    ref,
  ) {
    const sz = size === "sm" ? "w-7 h-7" : "w-8 h-8";
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        title={tooltip}
        aria-label={tooltip}
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] ui-focus transition-colors",
          sz,
          active
            ? "bg-[color:var(--c-text)] text-white"
            : "text-[color:var(--c-text-2)] hover:bg-[color:var(--c-hover)] hover:text-[color:var(--c-text)]",
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

/* ------------------------------------------------------------------ */
/*  Segmented control                                                  */
/* ------------------------------------------------------------------ */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  className,
  fullWidth,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode; icon?: ReactNode }[];
  size?: "sm" | "md";
  className?: string;
  /** Répartit les segments sur toute la largeur (utile panneau latéral étroit). */
  fullWidth?: boolean;
}) {
  const h = size === "sm" ? "h-7" : "h-8";
  const text = size === "sm" ? "text-[11.5px]" : "text-[12.5px]";
  return (
    <div
      className={cn(
        "inline-flex items-center p-[2px] rounded-[7px] bg-[color:var(--c-surface-3)]",
        fullWidth && "w-full",
        h,
        className,
      )}
      role="tablist"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center justify-center gap-1 px-2 sm:gap-1.5 sm:px-3 h-full rounded-[5px] font-medium transition-all ui-focus min-w-0",
              fullWidth && "flex-1",
              text,
              active
                ? "bg-[color:var(--c-surface)] text-[color:var(--c-text)] shadow-[0_1px_2px_rgba(0,0,0,0.18)] border border-[color:var(--c-border)]"
                : "text-[color:var(--c-text-2)] hover:text-[color:var(--c-text)]",
            )}
          >
            {opt.icon}
            <span className={cn(fullWidth && "truncate")}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inputs                                                             */
/* ------------------------------------------------------------------ */

export const MacInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function MacInput({ className, ...rest }, ref) {
  return <input ref={ref} className={cn("ui-input", className)} {...rest} />;
});

export const MacTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function MacTextarea({ className, ...rest }, ref) {
  return (
    <textarea ref={ref} className={cn("ui-input", className)} {...rest} />
  );
});

export function MacField({
  label,
  hint,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label && <span className="ui-label">{label}</span>}
      {children}
      {hint && (
        <span className="text-[11.5px] text-[color:var(--c-text-3)]">
          {hint}
        </span>
      )}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Badge                                                              */
/* ------------------------------------------------------------------ */

export function Badge({
  tone = "neutral",
  children,
  className,
  icon,
}: {
  tone?:
    | "neutral"
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "violet";
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral:
      "bg-[color:var(--c-surface-3)] text-[color:var(--c-text-2)] border-[color:var(--c-border)]",
    accent:
      "bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent)] border-[color:var(--c-accent-soft)]",
    success:
      "bg-[color:var(--c-success-soft)] text-[color:var(--c-success)] border-[color:var(--c-success-soft)]",
    warning:
      "bg-[color:var(--c-warning-soft)] text-[color:var(--c-warning)] border-[color:var(--c-warning-soft)]",
    danger:
      "bg-[color:var(--c-danger-soft)] text-[color:var(--c-danger)] border-[color:var(--c-danger-soft)]",
    violet:
      "bg-[color:var(--c-violet-soft)] text-[color:var(--c-violet)] border-[color:var(--c-violet-soft)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 h-[20px] px-[7px] rounded-full text-[11px] font-medium border",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Kbd                                                                */
/* ------------------------------------------------------------------ */

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-[4px] bg-[color:var(--c-surface)] border border-[color:var(--c-border)] text-[10.5px] font-medium text-[color:var(--c-text-2)]"
      style={{ fontFamily: "var(--f-mono)" }}
    >
      {children}
    </kbd>
  );
}

/* ------------------------------------------------------------------ */
/*  Sparkline (SVG léger, pas de dep)                                  */
/* ------------------------------------------------------------------ */

export function Sparkline({
  values,
  width = 120,
  height = 32,
  color = "var(--c-text)",
  className,
  fill = true,
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  className?: string;
}) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = width / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const area = `${d} L${width},${height} L0,${height} Z`;
  const gid = `sg-${Math.round(values.reduce((a, b) => a + b, 0))}-${values.length}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="none"
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} />
        </>
      )}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Ring (progress)                                                    */
/* ------------------------------------------------------------------ */

export function Ring({
  value,
  size = 40,
  strokeWidth = 3,
  color = "var(--c-accent)",
  trackColor = "rgba(0,0,0,0.08)",
  label,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(1, Math.max(0, value)));
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 600ms var(--ease)" }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 grid place-items-center text-[10px] font-semibold">
          {label}
        </div>
      )}
    </div>
  );
}
