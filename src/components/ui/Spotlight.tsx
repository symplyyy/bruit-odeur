import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "red" | "red-soft" | "chalk";
  size?: number;
  style?: CSSProperties;
};

/**
 * Halo radial diffus, utilisé pour "allumer" une section (hero, carte, etc.).
 * À placer dans un conteneur `relative overflow-hidden`.
 */
export function Spotlight({
  className,
  variant = "red",
  size = 900,
  style,
}: Props) {
  const cls =
    variant === "red-soft"
      ? "spotlight spotlight-soft"
      : variant === "chalk"
        ? "spotlight spotlight-chalk"
        : "spotlight";
  return (
    <div
      aria-hidden
      className={cn(cls, className)}
      style={{ width: size, height: size, ...style }}
    />
  );
}
