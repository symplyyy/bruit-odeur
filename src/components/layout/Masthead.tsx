"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePseudoStore } from "@/lib/pseudo-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/hot-take", label: "Hot Take" },
  { href: "/top-semaine", label: "Top" },
  { href: "/archives", label: "Archives" },
] as const;

export function Masthead() {
  const pathname = usePathname();
  const pseudo = usePseudoStore((s) => s.pseudo);
  const hydrated = usePseudoStore((s) => s.hydrated);
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    );
  }, []);

  return (
    <header className="relative border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex items-center justify-between py-3 text-[10px] uppercase tracking-[0.35em] text-ink/70 border-b border-ink/25">
          <span>Vol. 01 — Fanzine hebdo</span>
          <span className="hidden sm:inline">
            Paris · Banlieue · Rap français
          </span>
          <span>
            {hydrated && pseudo ? (
              <Link
                href={`/pseudo/${encodeURIComponent(pseudo)}`}
                className="underline decoration-brand-red underline-offset-4 hover:text-brand-red"
              >
                @{pseudo}
              </Link>
            ) : (
              <span className="text-ink/50">Lecteur anonyme</span>
            )}
          </span>
        </div>

        <div className="flex items-end justify-between gap-6 pt-5 pb-3">
          <Link href="/" className="group flex items-end gap-3">
            <span className="inline-block w-3 h-3 bg-brand-red translate-y-[-4px]" />
            <span className="font-display uppercase leading-[0.82] text-ink text-[44px] md:text-[88px] tracking-[-0.03em] group-hover:text-brand-red transition-colors">
              Le Bruit
              <br />
              <span className="pl-8 md:pl-16">&amp; l&apos;Odeur</span>
            </span>
          </Link>
          <div className="hidden md:flex flex-col items-end text-right gap-1">
            <span className="stamp text-brand-red text-[11px]">
              Édition hebdo
            </span>
            <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-ink/60 max-w-[18ch]">
              Le média qui vote, crie, partage.
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-between py-3 border-t border-ink/40">
          <ul className="flex gap-8 text-[11px] uppercase tracking-[0.3em]">
            <li>
              <Link
                href="/"
                className={cn(
                  "transition-colors",
                  pathname === "/"
                    ? "text-brand-red"
                    : "text-ink hover:text-brand-red",
                )}
              >
                Une
              </Link>
            </li>
            {NAV.map((t) => {
              const active = pathname.startsWith(t.href);
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className={cn(
                      "transition-colors",
                      active
                        ? "text-brand-red"
                        : "text-ink hover:text-brand-red",
                    )}
                  >
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p
            className="text-[10px] uppercase tracking-[0.35em] text-ink/50"
            suppressHydrationWarning
          >
            {today ?? " "}
          </p>
        </nav>
      </div>
      <div className="halftone-band opacity-40" />
    </header>
  );
}
