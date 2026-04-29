import Link from "next/link";
import type { ReactNode } from "react";

type Breadcrumb = { href: string; label: string };

type Props = {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
};

export function AdminPageHeader({ title, subtitle, breadcrumbs, actions }: Props) {
  return (
    <header className="mb-8 flex items-end justify-between gap-4 flex-wrap rounded-2xl border border-black/10 bg-white/75 backdrop-blur-xl px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-black/45 mb-3">
            {breadcrumbs.map((b, i) => (
              <span key={b.href} className="flex items-center gap-2">
                <Link href={b.href} className="hover:text-black">
                  {b.label}
                </Link>
                {i < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display uppercase text-3xl md:text-4xl text-black leading-[0.92] tracking-[-0.02em]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-black/60 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
