"use client";

import { useTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "public" | "admin";

/**
 * ThemeToggle — bouton jour/nuit avec deux styles :
 * - "public" : se fond dans la TopBar du site (chip parallélogramme)
 * - "admin"  : se fond dans la sidebar back-office (style linear/vercel)
 */
export function ThemeToggle({
  variant = "public",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Passer en mode jour" : "Passer en mode nuit";

  if (variant === "admin") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        className={cn(
          "flex items-center gap-2 h-8 w-full px-2 rounded-[7px] text-[12px] text-[color:var(--c-text-2)] hover:bg-[color:var(--c-hover)] hover:text-[color:var(--c-text)] transition-colors",
          className,
        )}
      >
        <Icon size={13} strokeWidth={1.75} />
        <span className="flex-1 text-left">
          {isDark ? "Mode jour" : "Mode nuit"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "relative isolate inline-flex items-center justify-center w-9 h-9 transition-colors hover:text-[color:var(--color-chalk)]",
        className,
      )}
      style={{ color: "var(--color-mist)" }}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: "var(--surface-lift)",
          border: "1px solid var(--line-strong)",
          transform: "skewX(-12deg)",
        }}
      />
      <Icon size={15} strokeWidth={1.75} />
    </button>
  );
}
