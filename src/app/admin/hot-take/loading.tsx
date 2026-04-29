import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { Card } from "@/components/admin/mac/primitives";
import { Skeleton } from "@/components/admin/mac/Skeleton";

export default function HotTakeLoading() {
  return (
    <>
      <MacToolbar
        title="Hot Takes"
        subtitle="Rédige, programme et clôture les opinions tranchées."
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/hot-take", label: "Hot Takes" },
        ]}
      />

      <div className="pt-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-3 h-7 w-12" />
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1fr_110px_110px_80px] items-center px-5 h-9 bg-[color:var(--c-surface-2)] border-b border-[color:var(--c-border)] gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-10 justify-self-end" />
          </div>
          <ul>
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className={
                  i === 0 ? "" : "border-t border-[color:var(--c-border)]"
                }
              >
                <div className="grid grid-cols-[1fr_110px_110px_80px] items-center px-5 h-[52px] gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <Skeleton className="h-[18px] w-16" />
                    <Skeleton className="h-3.5 w-3/4" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3.5 w-8 justify-self-end" />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
