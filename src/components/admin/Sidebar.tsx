"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", marker: "§0" },
  { href: "/admin/top-semaine", label: "Top de la semaine", marker: "§2" },
  { href: "/admin/hot-take", label: "Hot Takes", marker: "§1" },
  { href: "/admin/stories", label: "Stories", marker: "§3" },
] as const;

type Props = {
  logoutAction: () => Promise<void>;
};

export function AdminSidebar({ logoutAction }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 border-r border-black/10 bg-white/80 backdrop-blur-xl flex flex-col sticky top-0 h-dvh">
      <div className="px-6 py-6 border-b border-black/10">
        <p className="text-[10px] uppercase tracking-[0.35em] text-black/45">
          Back-office
        </p>
        <Link href="/admin/dashboard" aria-label="Dashboard — B&O'Z" className="block mt-2">
          <Logo variant="black" className="h-10 w-auto" />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {items.map((it) => {
          const active = pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-xl border mb-1",
                active
                  ? "border-black/10 bg-black text-white shadow-sm"
                  : "border-transparent text-black/60 hover:text-black hover:bg-black/[0.04]",
              )}
            >
              <span
                className={cn(
                  "font-display text-[11px] w-8",
                  active ? "text-white/70" : "text-black/35",
                )}
                aria-hidden
              >
                {it.marker}
              </span>
              <span className="uppercase tracking-[0.18em] text-[11px] font-display">
                {it.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-black/10 flex flex-col gap-2">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.25em] text-black/55 hover:text-black"
        >
          ↗ Voir le site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-[10px] uppercase tracking-[0.25em] text-black/55 hover:text-black"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
