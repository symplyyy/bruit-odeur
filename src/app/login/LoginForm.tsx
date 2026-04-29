"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

type State = { ok: boolean; error?: string };

export function LoginForm({
  action,
}: {
  action: (prev: State, fd: FormData) => Promise<State>;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<State, FormData>(action, {
    ok: false,
  });

  useEffect(() => {
    if (state.ok) {
      router.replace("/admin/dashboard");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-3">
      <label className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-ink/60">
          Mot de passe
        </span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          disabled={pending || state.ok}
          className="h-12 px-4 bg-transparent border-2 border-ink text-ink placeholder:text-ink/30 focus:border-brand-red outline-none font-display tracking-wide disabled:opacity-50"
        />
      </label>
      {state.error && (
        <p className="text-xs uppercase tracking-widest text-brand-red">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending || state.ok}
        className="mt-4 h-12 bg-ink text-paper font-display uppercase tracking-[0.2em] text-sm hover:bg-brand-red transition-colors disabled:opacity-60 disabled:hover:bg-ink"
      >
        {state.ok ? "Connecté →" : pending ? "Vérification…" : "Entrer →"}
      </button>
    </form>
  );
}
