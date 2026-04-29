"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const HomeIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
    <path
      d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);
const FlameIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
    <path
      d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1.5-3.5C10.5 6 11.5 4.5 12 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9 14c0 2 1.3 4 3 4s3-1.5 3-3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const StackIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
    <rect x="4" y="5" width="16" height="4" stroke="currentColor" strokeWidth="1.5" />
    <rect x="4" y="11" width="16" height="4" stroke="currentColor" strokeWidth="1.5" />
    <rect x="4" y="17" width="16" height="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const TABS: Tab[] = [
  { href: "/", label: "Accueil", icon: HomeIcon },
  { href: "/hot-take", label: "Hot Take", icon: FlameIcon },
  { href: "/top-semaine", label: "Top", icon: StackIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[min(calc(100%-24px),380px)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="nav-paral grid grid-cols-3 px-2">
        {TABS.map((t) => {
          const active =
            t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <li key={t.href} className="relative">
              <Link
                href={t.href}
                aria-label={t.label}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 h-16 transition-colors",
                  active ? "text-chalk" : "text-fade hover:text-chalk",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-active"
                    className="nav-paral-pill"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-1">
                  <span className="transition-colors">{t.icon}</span>
                  <span className="text-[9px] uppercase tracking-[0.22em] font-bold">
                    {t.label}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
