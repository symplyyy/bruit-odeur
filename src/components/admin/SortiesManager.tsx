import { addSortie, deleteSortie, moveSortie } from "@/lib/actions/tops";
import { Card, MacButton, MacField, MacInput, Badge } from "@/components/admin/mac/primitives";
import { Plus, ArrowUp, ArrowDown, Trash2, GripVertical } from "lucide-react";

type Sortie = {
  id: string;
  artiste: string;
  titre: string;
  pochetteUrl: string;
  embedUrl: string | null;
  category: string;
  order: number;
};

type Props = {
  topId: string;
  sorties: Sortie[];
};

const categories = ["SON", "ALBUM", "CLIP", "SPORT", "AUTRE"] as const;

export function SortiesManager({ topId, sorties }: Props) {
  const add = addSortie.bind(null, topId);

  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">
            Sorties
            <span className="ml-2 text-[12px] font-normal text-[color:var(--c-text-3)]">
              {sorties.length} {sorties.length > 1 ? "sorties" : "sortie"}
            </span>
          </h2>
          <p className="text-[12px] text-[color:var(--c-text-3)] mt-1">
            4 à 8 sorties recommandées. Réordonne avec les flèches.
          </p>
        </div>
      </div>

      {sorties.length > 0 && (
        <Card className="overflow-hidden">
          <ul>
            {sorties.map((s, i) => (
              <li
                key={s.id}
                className={
                  i === 0
                    ? ""
                    : "border-t border-[color:var(--c-border)]"
                }
              >
                <div className="flex items-center gap-3 px-4 h-[72px] group hover:bg-[color:var(--c-hover)] transition-colors">
                  <GripVertical
                    size={14}
                    className="text-[color:var(--c-text-4)] shrink-0"
                  />
                  <div
                    className="w-12 h-12 rounded-[6px] bg-cover bg-center shrink-0 border border-[color:var(--c-border)]"
                    style={{ backgroundImage: `url(${s.pochetteUrl})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge tone="neutral">{s.category}</Badge>
                      <span className="text-[11px] text-[color:var(--c-text-3)] tabular-nums">
                        #{i + 1}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px] font-medium truncate">
                      {s.titre}
                    </p>
                    <p className="text-[11.5px] text-[color:var(--c-text-3)] truncate">
                      {s.artiste}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <form action={moveSortie.bind(null, topId, s.id, "up")}>
                      <MacButton
                        type="submit"
                        variant="ghost"
                        size="sm"
                        disabled={i === 0}
                        aria-label="Monter"
                      >
                        <ArrowUp size={13} strokeWidth={1.75} />
                      </MacButton>
                    </form>
                    <form action={moveSortie.bind(null, topId, s.id, "down")}>
                      <MacButton
                        type="submit"
                        variant="ghost"
                        size="sm"
                        disabled={i === sorties.length - 1}
                        aria-label="Descendre"
                      >
                        <ArrowDown size={13} strokeWidth={1.75} />
                      </MacButton>
                    </form>
                    <form action={deleteSortie.bind(null, topId, s.id)}>
                      <MacButton
                        type="submit"
                        variant="ghost"
                        size="sm"
                        aria-label="Supprimer"
                        className="hover:text-[color:var(--c-danger)]"
                      >
                        <Trash2 size={13} strokeWidth={1.75} />
                      </MacButton>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-5">
        <p className="text-[12px] font-medium text-[color:var(--c-text-2)] mb-4">
          Ajouter une sortie
        </p>
        <form
          action={add}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <MacField label="Artiste">
            <MacInput name="artiste" required placeholder="Ex: Gazo" />
          </MacField>
          <MacField label="Titre">
            <MacInput name="titre" required placeholder="Ex: Apollo" />
          </MacField>
          <MacField label="Pochette (URL)" className="md:col-span-2">
            <MacInput
              name="pochetteUrl"
              type="url"
              required
              placeholder="https://…"
            />
          </MacField>
          <MacField
            label="Lien YouTube / Spotify (optionnel)"
            className="md:col-span-2"
          >
            <MacInput
              name="embedUrl"
              type="url"
              placeholder="https://www.youtube.com/embed/… — laisse vide si aucun"
            />
          </MacField>
          <MacField label="Catégorie">
            <select
              name="category"
              defaultValue="SON"
              className="ui-input"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </MacField>
          <div className="flex items-end">
            <MacButton
              type="submit"
              variant="primary"
              className="w-full h-[32px]"
              icon={<Plus size={13} strokeWidth={1.75} />}
            >
              Ajouter
            </MacButton>
          </div>
        </form>
      </Card>
    </section>
  );
}
