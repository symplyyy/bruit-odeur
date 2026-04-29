/**
 * Déclinaisons du logo B&O'Z.
 * Les fichiers sont servis depuis `public/logo/<theme>-<tone>.svg`.
 */

export type LogoTheme = "default" | "sport" | "mode" | "autre";
export type LogoTone = "light" | "black";

export const LOGO_THEMES: { value: LogoTheme; label: string }[] = [
  { value: "default", label: "Principal" },
  { value: "sport", label: "Sport" },
  { value: "mode", label: "Mode" },
  { value: "autre", label: "Autre" },
];

export function logoUrl(theme: LogoTheme = "default", tone: LogoTone = "light"): string {
  return `/logo/${theme}-${tone}.svg`;
}
