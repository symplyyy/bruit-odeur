import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  items: ReactNode[];
  className?: string;
  slow?: boolean;
  separator?: ReactNode;
};

/**
 * Ticker horizontal infini. Double le contenu pour que la boucle CSS soit sans couture.
 */
export function MarqueeTicker({
  items,
  className,
  slow,
  separator = (
    <span aria-hidden className="mx-5 md:mx-8 text-brand-red">
      ●
    </span>
  ),
}: Props) {
  const track = (
    <span className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap">{it}</span>
          {separator}
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden hairline-t hairline-b bg-chalk/5",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max",
          slow ? "animate-marquee-slow" : "animate-marquee",
        )}
      >
        {track}
        {track}
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent"
      />
    </div>
  );
}
