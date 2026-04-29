"use client";

import { useEffect } from "react";

/**
 * ForceDark — garantit le thème sombre sur le site public
 * (le toggle jour/nuit n'existe plus côté user, mais le thème peut
 * persister depuis une visite admin).
 */
export function ForceDark() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light");
    html.classList.add("dark");
    html.style.colorScheme = "dark";
  }, []);
  return null;
}
