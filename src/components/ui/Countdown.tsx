"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/utils";

type Props = {
  target: Date | string;
  onComplete?: () => void;
  className?: string;
};

export function Countdown({ target, onComplete, className }: Props) {
  const targetMs = typeof target === "string" ? new Date(target).getTime() : target.getTime();
  const [remaining, setRemaining] = useState<number>(() => targetMs - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const next = targetMs - Date.now();
      setRemaining(next);
      if (next <= 0) {
        clearInterval(id);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs, onComplete]);

  return (
    <time
      dateTime={new Date(targetMs).toISOString()}
      className={className}
      suppressHydrationWarning
    >
      {formatCountdown(remaining)}
    </time>
  );
}
