import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  tone?: "default" | "red" | "live";
  size?: "sm" | "lg";
  className?: string;
};

/**
 * Badge "tag" — parallélogramme incliné -12° (signature DA).
 * Le fond est porté par `::before` dans globals.css. Le contenu reste droit.
 * `tone="live"` utilise la même forme rouge avec une pulsation subtile du halo.
 */
export function Badge({
  children,
  tone = "default",
  size = "sm",
  className,
}: Props) {
  const base = size === "lg" ? "slant" : "chip";
  const variant =
    tone === "red" || tone === "live"
      ? size === "lg"
        ? "slant-red"
        : "chip-red"
      : "";
  const pulse =
    tone === "live" ? (size === "lg" ? "slant-pulse" : "chip-pulse") : "";

  return (
    <span className={cn(base, variant, pulse, className)}>{children}</span>
  );
}
