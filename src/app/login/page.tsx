import { redirect } from "next/navigation";
import Link from "next/link";
import { adminLogin, isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin — Login" };

type State = { ok: boolean; error?: string };

async function loginAction(_prev: State, formData: FormData): Promise<State> {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (!password) return { ok: false, error: "Mot de passe requis" };
  const ok = await adminLogin(password);
  if (!ok) return { ok: false, error: "Mot de passe incorrect" };
  return { ok: true };
}

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/dashboard");

  return (
    <section className="relative min-h-dvh grid place-items-center overflow-hidden bg-paper paper-grain px-5 py-16">
      {/* fond brutaliste */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-ink) 0 1px, transparent 1px 14px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-24 hidden md:block font-display uppercase text-[180px] leading-none text-ink/4 tracking-[-0.05em] select-none"
      >
        Press
        <br />
        Pass
      </div>

      <Link
        href="/"
        className="absolute top-5 left-5 md:top-8 md:left-8 text-[10px] uppercase tracking-[0.35em] text-ink/60 hover:text-brand-red transition-colors z-20"
      >
        ← Retour
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="relative border-2 border-ink bg-paper p-8 md:p-10 shadow-[10px_10px_0_0_var(--color-brand-red)]">
          <div className="tape -top-3 left-6" aria-hidden />
          <div
            className="tape -top-3 right-10"
            aria-hidden
            style={{ transform: "rotate(5deg)" }}
          />

          {/* badge cadenas */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-brand-red rule-under border-brand-red/40 inline-block">
                Accès restreint
              </p>
              <h1 className="font-display uppercase text-6xl md:text-7xl text-ink mt-4 leading-[0.86] tracking-[-0.03em]">
                Back
                <br />
                <span className="text-brand-red">Office</span>.
              </h1>
            </div>
            <span
              aria-hidden
              className="shrink-0 mt-1 grid place-items-center w-12 h-12 border-2 border-ink bg-ink text-paper"
            >
              <LockIcon className="w-5 h-5" />
            </span>
          </div>

          <p className="mt-5 text-sm text-ink/60 leading-relaxed">
            Espace rédaction. Un mot de passe partagé avec l&apos;équipe
            B&amp;O&apos;Z. Pas de comptes individuels.
          </p>

          <LoginForm action={loginAction} />

          <div className="mt-8 pt-5 border-t border-ink/15 flex items-center justify-between text-[9px] uppercase tracking-[0.35em] text-ink/40">
            <span>v1 — interne</span>
            <span>Le Bruit &amp; l&apos;Odeur</span>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.35em] text-ink/40">
          Tu n&apos;es pas censé&nbsp;e être ici&nbsp;? <Link href="/" className="underline decoration-brand-red underline-offset-4 hover:text-brand-red">Reviens à l&apos;accueil.</Link>
        </p>
      </div>
    </section>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      <rect x="4" y="11" width="16" height="10" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
