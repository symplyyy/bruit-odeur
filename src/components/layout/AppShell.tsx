import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * AppShell — conteneur atmosphérique sombre pour tout le site public.
 * Empile : base ink > grille technique fade-out > grain de film > contenu.
 * Les spotlights spécifiques (hero, etc.) sont rendus plus haut dans l'arbre.
 */
export function AppShell({ children }: Props) {
  return (
    <div className="relative min-h-dvh flex flex-col bg-ink text-chalk noise">
      {/* Grille technique globale, fade vers les bords */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-grid bg-grid-fade opacity-60"
      />
      {/* Vignette bas de page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink via-ink/60 to-transparent"
      />
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
