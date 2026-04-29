import { notFound } from "next/navigation";
import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { HotTakeForm } from "@/components/admin/HotTakeForm";
import { HotTakeVotersList } from "@/components/admin/HotTakeVotersList";
import { MacButton } from "@/components/admin/mac/primitives";
import { getAdminHotTake, listHotTakeVotes } from "@/lib/admin-queries";
import { deleteHotTake, updateHotTake } from "@/lib/actions/hot-takes";
import { Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Hot Take" };

export default async function EditHotTakePage(
  props: PageProps<"/admin/hot-take/[id]">,
) {
  const { id } = await props.params;
  const [hot, votes] = await Promise.all([
    getAdminHotTake(id),
    listHotTakeVotes(id),
  ]);
  if (!hot) notFound();

  const update = updateHotTake.bind(null, hot.id);
  const remove = deleteHotTake.bind(null, hot.id);

  return (
    <>
      <MacToolbar
        title="Éditer le Hot Take"
        subtitle={`« ${hot.statement.slice(0, 70)}${hot.statement.length > 70 ? "…" : ""} »`}
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/hot-take", label: "Hot Takes" },
          { href: "#", label: "Édition" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/admin/hot-take/${hot.id}/story`}>
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
                icon={<Trash2 size={13} />}
              >
                Supprimer
              </MacButton>
            </form>
          </div>
        }
      />
      <div className="pt-6 ui-fade-in">
        <HotTakeForm
          initial={{
            statement: hot.statement,
            backgroundUrl: hot.backgroundUrl,
            publishAt: hot.publishAt.toISOString(),
            closeAt: hot.closeAt?.toISOString() ?? null,
            status: hot.status,
            optionALabel: hot.optionALabel,
            optionBLabel: hot.optionBLabel,
          }}
          action={update}
          submitLabel="Enregistrer"
        />

        <div className="mt-8">
          <HotTakeVotersList
            votes={votes}
            optionALabel={hot.optionALabel}
            optionBLabel={hot.optionBLabel}
          />
        </div>
      </div>
    </>
  );
}
