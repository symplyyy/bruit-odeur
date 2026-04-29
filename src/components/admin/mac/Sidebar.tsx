"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  LayoutDashboard,
  Trophy,
  Flame,
  Images,
  Users,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
};

const MAIN: Item[] = [
  { href: "/admin/dashboard", label: "Vue d’ensemble", icon: LayoutDashboard },
  { href: "/admin/top-semaine", label: "Top de la semaine", icon: Trophy },
  { href: "/admin/hot-take", label: "Hot Takes", icon: Flame },
  { href: "/admin/stories", label: "Studio", icon: Images },
];

const COMMUNITY: Item[] = [
  { href: "/admin/votants", label: "Votants", icon: Users },
];

function NavItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-2.5 h-8 px-2 rounded-[7px] text-[13px] font-medium transition-colors",
        active
          ? "bg-[color:var(--c-surface-3)] text-[color:var(--c-text)]"
          : "text-[color:var(--c-text-2)] hover:bg-[color:var(--c-hover)] hover:text-[color:var(--c-text)]",
      )}
    >
      {active && (
        <span className="absolute left-[-6px] top-2 bottom-2 w-[2px] rounded-full bg-[color:var(--c-text)]" />
      )}
      <Icon size={15} strokeWidth={1.75} className="shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
    </Link>
  );
}

export function AdminSidebar({
  logoutAction,
}: {
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <aside className="ui-sidebar w-[232px] shrink-0 flex flex-col sticky top-0 h-dvh z-10">
      {/* Brand */}
      <div className="h-[52px] px-3 flex items-center gap-2 border-b border-[color:var(--c-border)]">
        <div
          className="w-[26px] h-[26px] rounded-[7px] grid place-items-center text-white text-[12px] font-bold"
          style={{
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)",
          }}
        >
          B
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold leading-none tracking-tight">
            B&O’Z
          </p>
          <p className="text-[10.5px] text-[color:var(--c-text-3)] mt-[3px] leading-none">
            Rédaction
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 pt-3 overflow-y-auto">
        <SectionLabel>Contenus</SectionLabel>
        <ul className="space-y-[2px] mb-4">
          {MAIN.map((it) => (
            <li key={it.href}>
              <NavItem
                item={it}
                active={
                  pathname === it.href || pathname.startsWith(it.href + "/")
                }
              />
            </li>
          ))}
        </ul>

        <SectionLabel>Communauté</SectionLabel>
        <ul className="space-y-[2px]">
          {COMMUNITY.map((it) => (
            <li key={it.href}>
              <NavItem
                item={it}
                active={pathname.startsWith(it.href)}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-[color:var(--c-border)]">
        <ThemeToggle variant="admin" />
        <Link
          href="/"
          className="flex items-center gap-2 h-8 px-2 rounded-[7px] text-[12px] text-[color:var(--c-text-2)] hover:bg-[color:var(--c-hover)] hover:text-[color:var(--c-text)] transition-colors"
        >
          <ArrowUpRight size={13} strokeWidth={1.75} />
          Voir le site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 h-8 w-full px-2 rounded-[7px] text-[12px] text-[color:var(--c-text-2)] hover:bg-[color:var(--c-hover)] hover:text-[color:var(--c-text)] transition-colors"
          >
            <LogOut size={13} strokeWidth={1.75} />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 mb-1 text-[10.5px] font-semibold uppercase tracking-[0.04em] text-[color:var(--c-text-4)]">
      {children}
    </p>
  );
}
