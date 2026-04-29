import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  bordered?: boolean;
  glass?: boolean;
};

/**
 * Carte sombre — par défaut surface "glass" avec hairline.
 */
export function Card({
  className,
  children,
  bordered = true,
  glass = true,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={cn(
        glass ? "surface-glass" : "bg-chalk/5",
        bordered && !glass && "hairline",
        "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
