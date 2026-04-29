import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { Card } from "@/components/admin/mac/primitives";
import { Skeleton } from "@/components/admin/mac/Skeleton";

export default function DashboardLoading() {
  return (
    <>
      <MacToolbar
        title="Vue d’ensemble"
        subtitle="Activité, contenus et engagement sur les 14 derniers jours."
      />

      <div className="pt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-3 w-24" />
              <div className="mt-3 flex items-end justify-between gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-7 w-20" />
              </div>
              <Skeleton className="mt-3 h-3 w-20" />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-3">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-9 w-32" />
            <Skeleton className="mt-3 h-4 w-full" />
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
            <Skeleton className="mt-5 h-8 w-full" />
          </Card>

          <Card className="p-5">
            <Skeleton className="h-3 w-32 mb-4" />
            <Skeleton className="h-[220px] w-full" />
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 h-[46px] border-b border-[color:var(--c-border)]">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <ul>
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={i}
                className={
                  i === 0 ? "" : "border-t border-[color:var(--c-border)]"
                }
              >
                <div className="grid grid-cols-[1fr_auto_auto_60px] items-center gap-4 px-5 h-[52px]">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-12" />
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
