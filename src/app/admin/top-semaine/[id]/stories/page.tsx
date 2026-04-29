import { notFound } from "next/navigation";
import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { StoriesStudio } from "@/components/admin/stories/StoriesStudio";
import { getTopPodium } from "@/lib/admin-queries";

export const metadata = { title: "Stories" };

export default async function TopStoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const top = await getTopPodium(id);
  if (!top) notFound();

  return (
    <>
      <MacToolbar
        title="Stories"
        subtitle={`${top.title} · Semaine ${top.weekNumber} · ${top.year}`}
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d'ensemble" },
          { href: "/admin/top-semaine", label: "Top de la semaine" },
          { href: `/admin/top-semaine/${top.id}`, label: `S${top.weekNumber}` },
          { href: "#", label: "Stories" },
        ]}
      />
      <div className="pt-6 ui-fade-in">
        <StoriesStudio podium={top} />
      </div>
    </>
  );
}
