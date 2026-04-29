/**
 * ThemeScript — injecté dans <head> avant hydration pour éviter les flashs.
 * Priorité : localStorage > préférence système > dark (par défaut).
 */
const SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var mql = window.matchMedia('(prefers-color-scheme: light)');
    var theme = stored || (mql.matches ? 'light' : 'dark');
    var html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    html.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
