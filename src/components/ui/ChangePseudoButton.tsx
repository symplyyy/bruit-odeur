"use client";

import { useRouter } from "next/navigation";
import { usePseudoStore } from "@/lib/pseudo-store";
import { slugify } from "@/lib/utils";

export function ChangePseudoButton({
  slug,
  className,
  variant = "outline",
  label = "Changer de pseudo",
}: {
  slug: string;
  className?: string;
  variant?: "outline" | "solid";
  label?: string;
}) {
  const router = useRouter();
  const pseudo = usePseudoStore((s) => s.pseudo);
  const hydrated = usePseudoStore((s) => s.hydrated);
  const clear = usePseudoStore((s) => s.clear);

  if (!hydrated) return null;

  // Affiché seulement si c'est bien le profil de l'utilisateur courant
  if (!pseudo || slugify(pseudo) !== slug) return null;

  const base =
    "inline-flex items-center gap-2 h-10 px-4 text-[11px] uppercase tracking-[0.25em] transition-colors";
  const styles =
    variant === "solid"
      ? "bg-brand-red text-white hover:bg-ink"
      : "border-2 border-chalk/30 text-chalk hover:border-brand-red hover:text-brand-red";

  return (
    <button
      type="button"
      onClick={() => {
        clear();
        router.push("/");
      }}
      className={`${base} ${styles} ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="w-3.5 h-3.5"
      >
        <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
        <path d="M21 4v4h-4" />
        <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
        <path d="M3 20v-4h4" />
      </svg>
      {label}
    </button>
  );
}
