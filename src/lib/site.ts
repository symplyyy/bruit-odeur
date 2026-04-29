/**
 * Domaine public du site, configurable via NEXT_PUBLIC_SITE_URL.
 * Format attendu : "https://lebruitetlodeur.fr" (avec protocole, sans slash final).
 */
const RAW = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://lebruitetlodeur.fr";

export const SITE_URL = RAW.replace(/\/+$/, "");

/** Domaine seul, sans protocole, pour affichage (ex: "lebruitetlodeur.fr"). */
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

/** Construit une URL de partage à partir d'un chemin. */
export function siteUrl(path: string = ""): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p === "/" ? "" : p}`;
}

/** Variante affichage (sans protocole) — pour stories, posts, etc. */
export function siteDisplay(path: string = ""): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_DOMAIN}${p === "/" ? "" : p}`;
}
