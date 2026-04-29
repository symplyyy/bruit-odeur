"use client";

import Link from "next/link";
import { usePseudoStore } from "@/lib/pseudo-store";
import { Logo } from "@/components/ui/Logo";

/**
 * TopBar — ultra minimale. Un logo et un pseudo.
 */
export function TopBar() {
  const pseudo = usePseudoStore((s) => s.pseudo);
  const hydrated = usePseudoStore((s) => s.hydrated);

  return (
    <header className="sticky top-0 z-40">
      <div
        className="mx-auto max-w-5xl px-4 md:px-8 flex items-center justify-between gap-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
      >
        <Link href="/" aria-label="Accueil" className="flex items-center">
          <Logo variant="light" priority className="h-7 md:h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-2">
          {hydrated && pseudo ? (
            <Link
              href={`/pseudo/${encodeURIComponent(pseudo)}`}
              className="chip hover:text-chalk transition-colors"
              aria-label={`Profil ${pseudo}`}
            >
              @{pseudo}
            </Link>
          ) : (
            <span className="eyebrow text-dim">Invité</span>
          )}
        </div>
      </div>
    </header>
  );
}
