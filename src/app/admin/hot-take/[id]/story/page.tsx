import { notFound } from "next/navigation";
import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { HotTakeStoryStudio } from "@/components/admin/stories/HotTakeStoryStudio";
import { getHotTakeForStory } from "@/lib/admin-queries";

export const metadata = { title: "Story hot take" };

export default async function HotTakeStoryPage(
  props: PageProps<"/admin/hot-take/[id]/story">,
) {
  const { id } = await props.params;
  const hot = await getHotTakeForStory(id);
  if (!hot) notFound();

  const preview =
    hot.statement.length > 70
      ? `${hot.statement.slice(0, 70)}…`
      : hot.statement;

  return (
    <>
      <MacToolbar
        title="Story Hot Take"
        subtitle={`« ${preview} »`}
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/hot-take", label: "Hot Takes" },
          { href: `/admin/hot-take/${hot.id}`, label: "Édition" },
          { href: "#", label: "Story" },
        ]}
      />
      <div className="pt-6 ui-fade-in">
        <HotTakeStoryStudio hot={hot} />
      </div>
    </>
  );
}
