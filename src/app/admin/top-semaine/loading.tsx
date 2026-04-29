import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { Card } from "@/components/admin/mac/primitives";
import { Skeleton } from "@/components/admin/mac/Skeleton";

export default function TopSemaineLoading() {
  return (
    <>
      <MacToolbar
        title="Top de la semaine"
        subtitle="Crée un Top chaque lundi, ajoute 4 à 8 sorties, clôture le dimanche à 23h59."
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/top-semaine", label: "Top de la semaine" },
        ]}
      />

      <div className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-2/3" />
              <div className="mt-4 flex items-center gap-5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="mt-3 pt-3 border-t border-[color:var(--c-border)] flex justify-end">
                <Skeleton className="h-3 w-14" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
