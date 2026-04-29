import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { Card } from "@/components/admin/mac/primitives";
import { Skeleton } from "@/components/admin/mac/Skeleton";

export default function StoriesLoading() {
  return (
    <>
      <MacToolbar
        title="Studio"
        subtitle="Crée, duplique et exporte tes posts 1080×1380 — option story 1080×1920."
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/stories", label: "Studio" },
        ]}
      />

      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-3">
            <Skeleton className="aspect-[1080/1380] w-full" />
            <Skeleton className="mt-3 h-3.5 w-3/4" />
            <div className="mt-3 flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-20" />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
