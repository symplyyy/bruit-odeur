import Link from "next/link";
import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { MacButton } from "@/components/admin/mac/primitives";
import { StoryEditor } from "@/components/admin/stories/StoryEditor";
import { StoryList } from "@/components/admin/stories/StoryList";
import {
  getStoryTemplate,
  listStoryTemplates,
  type StoryPayload,
} from "@/lib/actions/stories";
import { Plus, X } from "lucide-react";

export const metadata = { title: "Studio" };

export default async function AdminStoriesPage(
  props: PageProps<"/admin/stories">,
) {
  const params = await props.searchParams;
  const editId = typeof params?.id === "string" ? params.id : null;

  const [templates, editing] = await Promise.all([
    listStoryTemplates(),
    editId ? getStoryTemplate(editId) : Promise.resolve(null),
  ]);

  const initial = editing
    ? {
        id: editing.id,
        name: editing.name,
        payload: editing.payload as StoryPayload,
      }
    : undefined;

  return (
    <>
      <MacToolbar
        title="Studio"
        subtitle={
          editing
            ? `Édition de « ${editing.name} » — export PNG 1080×1380 (post) / 1080×1920 (story).`
            : "Crée, duplique et exporte tes posts 1080×1380 — option story 1080×1920."
        }
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/stories", label: "Studio" },
          ...(editing ? [{ href: "#", label: editing.name }] : []),
        ]}
        actions={
          editing ? (
            <Link href="/admin/stories">
              <MacButton icon={<X size={13} strokeWidth={1.75} />}>
                Fermer l’édition
              </MacButton>
            </Link>
          ) : undefined
        }
      />

      <div className="pt-4 ui-fade-in">
        <StoryEditor key={editing?.id ?? "new"} initial={initial} />

        <section className="mt-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight">
                Templates enregistrés
              </h2>
              <p className="text-[12px] text-[color:var(--c-text-3)] mt-1">
                {templates.length} template{templates.length > 1 ? "s" : ""}.
                Clique pour éditer, survole pour dupliquer ou supprimer.
              </p>
            </div>
            {editing && (
              <Link href="/admin/stories">
                <MacButton
                  variant="primary"
                  icon={<Plus size={13} strokeWidth={1.75} />}
                >
                  Nouveau template
                </MacButton>
              </Link>
            )}
          </div>

          <StoryList
            items={templates
              .map((t) => ({
                id: t.id,
                name: t.name,
                updatedAt: t.updatedAt,
                payload: t.payload as StoryPayload,
              }))
              .sort((a, b) => {
                const rank = (f?: string) =>
                  f === "post" ? 0 : f === "post-text" ? 1 : 2;
                const ra = rank(a.payload?.format);
                const rb = rank(b.payload?.format);
                if (ra !== rb) return ra - rb;
                return (
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
                );
              })}
          />
        </section>
      </div>
    </>
  );
}
