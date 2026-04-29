import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type Crumb = { href: string; label: string };

export function MacToolbar({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="ui-toolbar sticky top-0 z-30 -mx-4 md:-mx-8 lg:-mx-10 px-4 md:px-8 lg:px-10 h-[52px] flex items-center justify-between gap-4">
      <div className="min-w-0 flex items-center gap-3">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="hidden md:flex items-center gap-1 text-[12px] text-[color:var(--c-text-3)]">
            {breadcrumbs.map((b, i) => (
              <span key={`${b.href}-${i}`} className="inline-flex items-center gap-1">
                <Link
                  href={b.href}
                  className="hover:text-[color:var(--c-text)] transition-colors"
                >
                  {b.label}
                </Link>
                {i < breadcrumbs.length - 1 && (
                  <ChevronRight
                    size={12}
                    strokeWidth={1.75}
                    className="text-[color:var(--c-text-4)]"
                  />
                )}
              </span>
            ))}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold leading-tight truncate tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] text-[color:var(--c-text-3)] truncate leading-tight mt-[2px]">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">{actions}</div>
    </div>
  );
}
