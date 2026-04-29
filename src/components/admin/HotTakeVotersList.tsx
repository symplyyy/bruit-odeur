import Link from "next/link";
import { Card } from "@/components/admin/mac/primitives";
import { cn } from "@/lib/utils";

type Vote = {
  id: string;
  createdAt: Date;
  side: "FIRE" | "FROID";
  pseudo: { id: string; name: string; slug: string };
};

type HotTakeVotersListProps = {
  votes: Vote[];
  optionALabel?: string | null;
  optionBLabel?: string | null;
};

export function HotTakeVotersList({
  votes,
  optionALabel,
  optionBLabel,
}: HotTakeVotersListProps) {
  const labelA = optionALabel ?? "Chaud";
  const labelB = optionBLabel ?? "Froid";
  const shortA = labelA.length > 10 ? labelA.slice(0, 9) + "…" : labelA;
  const shortB = labelB.length > 10 ? labelB.slice(0, 9) + "…" : labelB;
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

  const fire = votes.filter((v) => v.side === "FIRE");
  const froid = votes.filter((v) => v.side === "FROID");

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between h-9 px-4 bg-[color:var(--c-surface-2)] border-b border-[color:var(--c-border)]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[color:var(--c-text-3)]">
          Votants · {votes.length}
        </span>
        <span className="text-[11px] text-[color:var(--c-text-3)] tabular-nums uppercase">
          {shortA} {fire.length} · {shortB} {froid.length}
        </span>
      </div>
      <ul className="divide-y divide-[color:var(--c-border)]">
        {votes.map((v) => (
          <li key={v.id}>
            <div className="grid grid-cols-[1fr_80px_110px] items-center gap-3 px-4 h-12">
              <Link
                href={`/pseudo/${v.pseudo.slug}`}
                className="flex items-center gap-2 min-w-0 hover:underline"
              >
                <span className="w-7 h-7 rounded-full bg-[color:var(--c-surface-3)] grid place-items-center text-[11px] font-semibold shrink-0">
                  {v.pseudo.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-[13px] font-medium truncate">
                  @{v.pseudo.name}
                </span>
              </Link>

              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[0.14em] text-center py-1 px-1 truncate",
                  v.side === "FIRE"
                    ? "text-white bg-[#E52321]"
                    : "text-white bg-[#2088FF]",
                )}
                style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
                title={v.side === "FIRE" ? labelA : labelB}
              >
                {v.side === "FIRE" ? shortA : shortB}
              </span>

              <span className="text-right text-[11px] text-[color:var(--c-text-3)] tabular-nums">
                {v.createdAt.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                })}
                {" · "}
                {v.createdAt.toLocaleTimeString("fr-FR", {
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
