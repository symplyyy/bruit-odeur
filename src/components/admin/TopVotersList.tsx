import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/admin/mac/primitives";

type Vote = {
  id: string;
  createdAt: Date;
  pseudo: { id: string; name: string; slug: string };
  sortie: { id: string; artiste: string; titre: string; pochetteUrl: string };
};

export function TopVotersList({ votes }: { votes: Vote[] }) {
  if (votes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-[13px] font-medium">Aucun vote pour l’instant</p>
        <p className="mt-1 text-[12px] text-[color:var(--c-text-3)]">
          Les votants apparaîtront ici en temps réel.
        </p>
      </Card>
    );
  }

  const byPseudo = new Map<
    string,
    { pseudo: Vote["pseudo"]; sortie: Vote["sortie"]; createdAt: Date }
  >();
  for (const v of votes) {
    if (!byPseudo.has(v.pseudo.id)) {
      byPseudo.set(v.pseudo.id, {
        pseudo: v.pseudo,
        sortie: v.sortie,
        createdAt: v.createdAt,
      });
    }
  }
  const entries = [...byPseudo.values()];

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between h-9 px-4 bg-[color:var(--c-surface-2)] border-b border-[color:var(--c-border)]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[color:var(--c-text-3)]">
          Votants · {entries.length}
        </span>
      </div>
      <ul className="divide-y divide-[color:var(--c-border)]">
        {entries.map(({ pseudo, sortie, createdAt }) => (
          <li key={pseudo.id}>
            <div className="grid grid-cols-[1fr_1fr_110px] items-center gap-3 px-4 h-[56px]">
              <Link
                href={`/pseudo/${pseudo.slug}`}
                className="flex items-center gap-2 min-w-0 hover:underline"
              >
                <span className="w-7 h-7 rounded-full bg-[color:var(--c-surface-3)] grid place-items-center text-[11px] font-semibold shrink-0">
                  {pseudo.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-[13px] font-medium truncate">
                  @{pseudo.name}
                </span>
              </Link>

              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-8 h-8 shrink-0 overflow-hidden rounded-[2px] bg-[color:var(--c-surface-3)]">
                  {sortie.pochetteUrl ? (
                    <Image
                      src={sortie.pochetteUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="32px"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate">
                    {sortie.titre}
                  </p>
                  <p className="text-[11px] text-[color:var(--c-text-3)] truncate">
                    {sortie.artiste}
                  </p>
                </div>
              </div>

              <span className="text-right text-[11px] text-[color:var(--c-text-3)] tabular-nums">
                {createdAt.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                })}
                {" · "}
                {createdAt.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
