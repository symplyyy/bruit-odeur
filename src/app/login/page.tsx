import { redirect } from "next/navigation";
import { adminLogin, isAdmin } from "@/lib/auth";

export const metadata = { title: "Admin — Login" };

export default async function LoginPage(props: PageProps<"/login">) {
  if (await isAdmin()) redirect("/admin/dashboard");
  const sp = await props.searchParams;
  const errored = sp?.error === "1";

  async function login(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "");
    const ok = await adminLogin(password);
    if (!ok) redirect("/login?error=1");
    redirect("/admin/dashboard");
  }

  return (
    <section className="min-h-dvh grid place-items-center px-5 bg-paper paper-grain">
      <div className="relative z-10 w-full max-w-md border-2 border-ink bg-paper p-8 md:p-10 shadow-[8px_8px_0_0_var(--color-brand-red)]">
        <div className="tape -top-3 left-6" aria-hidden />
        <div className="tape -top-3 right-10" aria-hidden style={{ transform: "rotate(5deg)" }} />

        <p className="text-[10px] uppercase tracking-[0.35em] text-brand-red rule-under border-brand-red/40 inline-block">
          Accès restreint
        </p>
        <h1 className="font-display uppercase text-6xl md:text-7xl text-ink mt-4 leading-[0.86] tracking-[-0.03em]">
          Back
          <br />
          <span className="text-brand-red">Office</span>.
        </h1>
        <p className="mt-4 text-sm text-ink/60">
          Rédaction uniquement. Mot de passe partagé avec l&apos;équipe.
        </p>

        <form action={login} className="mt-8 flex flex-col gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink/60">
              Mot de passe
            </span>
            <input
              name="password"
              type="password"
              required
              autoFocus
              className="h-12 px-4 bg-transparent border-2 border-ink text-ink placeholder:text-ink/30 focus:border-brand-red outline-none font-display tracking-wide"
            />
          </label>
          {errored && (
            <p className="text-xs uppercase tracking-widest text-brand-red">
              Mot de passe incorrect
            </p>
          )}
          <button
            type="submit"
            className="mt-4 h-12 bg-ink text-paper font-display uppercase tracking-[0.2em] text-sm hover:bg-brand-red transition-colors"
          >
            Entrer →
          </button>
        </form>
      </div>
    </section>
  );
}
