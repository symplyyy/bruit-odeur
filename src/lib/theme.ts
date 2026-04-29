"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const KEY = "theme";

function getSnapshot(): Theme {
  const html = document.documentElement;
  return html.classList.contains("light") ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(t: Theme) {
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(t);
  html.style.colorScheme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {}
}

function subscribe(listener: () => void) {
  const html = document.documentElement;
  const observer = new MutationObserver(listener);
  observer.observe(html, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("storage", listener);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", listener);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
  }, []);

  return { theme, toggle, setTheme };
}
