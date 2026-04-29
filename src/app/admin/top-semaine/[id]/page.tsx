import Link from "next/link";
import { notFound } from "next/navigation";
import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { TopForm } from "@/components/admin/TopForm";
import { SortiesManager } from "@/components/admin/SortiesManager";
import { TopVotersList } from "@/components/admin/TopVotersList";
import { MacButton } from "@/components/admin/mac/primitives";
import { getAdminTop, listTopVotes } from "@/lib/admin-queries";
import { deleteTop, updateTop } from "@/lib/actions/tops";
import { Trash2, Sparkles } from "lucide-react";

export const metadata = { title: "Top" };

export default async function EditTopPage(
  props: PageProps<"/admin/top-semaine/[id]">,
) {
  const { id } = await props.params;
  const [top, votes] = await Promise.all([getAdminTop(id), listTopVotes(id)]);
  if (!top) notFound();

  const update = updateTop.bind(null, top.id);
  const remove = deleteTop.bind(null, top.id);

  return (
    <>
      <MacToolbar
        title={`Semaine ${top.weekNumber} · ${top.year}`}
        subtitle={top.title}
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/top-semaine", label: "Top de la semaine" },
          { href: "#", label: `S${top.weekNumber}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/admin/top-semaine/${top.id}/stories`}>
              <MacButton
                type="button"
                variant="primary"
                icon={<Sparkles size={13} strokeWidth={1.75} />}
              >
                Stories
              </MacButton>
            </Link>
            <form action={remove}>
              <MacButton
                type="submit"
                variant="danger"
                icon={<Trash2 size={13} strokeWidth={1.75} />}
              >
                Supprimer
              </MacButton>
            </form>
          </div>
        }
      />

      <div className="pt-6 ui-fade-in">
        <TopForm
          initial={{
            title: top.title,
            weekNumber: top.weekNumber,
            year: top.year,
            openAt: top.openAt.toISOString(),
            closeAt: top.closeAt.toISOString(),
            status: top.status,
          }}
          action={update}
          submitLabel="Enregistrer"
        />

        <SortiesManager
          topId={top.id}
          sorties={top.sorties.map((s) => ({
            id: s.id,
            artiste: s.artiste,
            titre: s.titre,
            pochetteUrl: s.pochetteUrl,
            embedUrl: s.embedUrl,
            category: s.category,
            order: s.order,
          }))}
        />

        <div className="mt-8">
          <TopVotersList votes={votes} />
        </div>
      </div>
    </>
  );
}
