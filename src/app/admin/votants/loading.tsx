import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { Card } from "@/components/admin/mac/primitives";
import { Skeleton } from "@/components/admin/mac/Skeleton";

export default function VotantsLoading() {
  return (
    <>
      <MacToolbar
        title="Votants"
        subtitle="Communauté B&O’Z — pseudos et engagement."
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/votants", label: "Votants" },
        ]}
      />

      <div className="pt-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-7 w-12" />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-3">
          <Card className="p-5">
            <Skeleton className="h-3 w-32 mb-4" />
            <Skeleton className="h-[200px] w-full" />
          </Card>
          <Card className="p-5">
            <Skeleton className="h-3 w-32 mb-4" />
            <Skeleton className="h-[200px] w-full" />
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1fr_90px_90px_110px_120px] items-center px-5 h-9 bg-[color:var(--c-surface-2)] border-b border-[color:var(--c-border)] gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8 justify-self-end" />
            <Skeleton className="h-3 w-8 justify-self-end" />
            <Skeleton className="h-3 w-10 justify-self-end" />
            <Skeleton className="h-3 w-12 justify-self-end" />
          </div>
          <ul>
            {Array.from({ length: 8 }).map((_, i) => (
              <li
                key={i}
                className={
                  i === 0 ? "" : "border-t border-[color:var(--c-border)]"
                }
              >
                <div className="grid grid-cols-[1fr_90px_90px_110px_120px] items-center px-5 h-[56px] gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Skeleton className="h-8 w-8 !rounded-full" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-3.5 w-8 justify-self-end" />
                  <Skeleton className="h-3.5 w-8 justify-self-end" />
                  <Skeleton className="h-3.5 w-10 justify-self-end" />
                  <Skeleton className="h-3 w-16 justify-self-end" />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
