"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { usePseudoStore } from "@/lib/pseudo-store";

type Props = {
  title?: string;
  subtitle?: string;
};

export function PseudoGate({
  title = "Choisis ton pseudo",
  subtitle = "Un pseudo, stocké dans ton navigateur. Pas de compte.",
}: Props) {
  const setPseudo = usePseudoStore((s) => s.setPseudo);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setError("Au moins 2 caractères");
      return;
    }
    setPseudo(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 grid place-items-center p-5"
    >
      <div className="absolute inset-0 bg-void/85 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md surface-glass p-8 md:p-10 overflow-hidden"
      >
        <div
          aria-hidden
          className="spotlight spotlight-soft absolute -top-40 -right-40"
          style={{ width: 520, height: 520 }}
        />

        <p className="eyebrow text-brand-red relative">Identité</p>
        <h2 className="relative font-display uppercase text-4xl md:text-5xl text-chalk mt-3 tracking-[-0.03em]">
          {title}
        </h2>
        <p className="relative mt-3 text-sm text-fade">{subtitle}</p>

        <form onSubmit={submit} className="relative mt-7 flex flex-col gap-3">
          <div className="group hairline bg-chalk/5 focus-within:border-brand-red/70 transition-colors">
            <div className="flex items-center h-12">
              <span className="px-4 eyebrow text-dim">@</span>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                placeholder="ton pseudo"
                maxLength={24}
                className="flex-1 h-full bg-transparent text-chalk placeholder:text-dim outline-none pr-4"
                autoFocus
              />
            </div>
          </div>
          {error && (
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="group relative h-12 bg-brand-red text-white uppercase tracking-[0.22em] text-xs hover:bg-brand-red-hot transition-colors overflow-hidden"
          >
            <span className="relative z-10">C&apos;est parti →</span>
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] bg-[length:200%_100%] animate-[shimmer_1.2s_linear_infinite]"
            />
          </button>

          <p className="text-[10px] uppercase tracking-[0.24em] text-dim text-center mt-1">
            Un pseudo · un vote · pas de compte
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
