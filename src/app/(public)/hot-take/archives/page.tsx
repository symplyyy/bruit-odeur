import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Spotlight } from "@/components/ui/Spotlight";
import { getArchivedHotTakes } from "@/lib/queries";

export const metadata = { title: "Archives — Hot Take" };

export default async function HotTakeArchivesPage() {
  const list = await getArchivedHotTakes();

  return (
    <section className="relative overflow-hidden">
      <Spotlight className="-top-40 -right-20" size={900} />

      <div className="relative mx-auto max-w-4xl px-5 md:px-10 pt-10 md:pt-16 pb-20">
        <header className="hairline-b pb-8">
          <Badge tone="red" size="lg">
            Archives Hot Take
          </Badge>
          <h1 className="font-display uppercase text-[44px] md:text-[84px] text-chalk mt-5 leading-[0.88] tracking-[-0.035em]">
            Tous les <span className="text-brand-red">verdicts</span>
          </h1>
        </header>

        {list.length === 0 ? (
          <p className="mt-10 eyebrow text-dim text-center">
            Pas encore d&apos;archive.
          </p>
        ) : (
          <ul className="mt-10 flex flex-col gap-2">
            {list.map((h) => {
              const firePct = h.firePct;
              const froidPct = 100 - firePct;
              const isVersus = !!(h.optionALabel && h.optionBLabel);
              const labelA = h.optionALabel ?? "Chaud";
              const labelB = h.optionBLabel ?? "Froid";
              const winner = firePct >= 50 ? labelA : labelB;
              return (
                <li
                  key={h.id}
                  className="group hairline bg-chalk/5 hover:bg-chalk/10 hover:border-chalk/20 p-4 md:p-5 transition-colors"
                >
                  {isVersus && (
                    <span className="chip chip-sm chip-red mb-3 inline-block">
                      Versus
                    </span>
                  )}
                  <p className="font-display uppercase text-lg md:text-xl text-chalk leading-tight tracking-[-0.01em]">
                    « {h.statement.toUpperCase()} »
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-[3px] bg-chalk/10 overflow-hidden">
                      <div
                        className="h-full bg-brand-red"
                        style={{ width: `${firePct}%` }}
                      />
                    </div>
                    <span
                      className={`eyebrow ${firePct >= 50 ? "text-brand-red" : "text-mist"}`}
                    >
                      {firePct}% / {froidPct}%
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between eyebrow text-dim gap-3">
                    <span className="truncate">
                      {new Date(h.publishAt).toLocaleDateString("fr-FR")} ·{" "}
                      {h.total} vote{h.total > 1 ? "s" : ""}
                    </span>
                    <span className="text-brand-red truncate shrink-0 max-w-[60%]">
                      Gagnant · {winner}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Link
          href="/archives"
          className="mt-12 inline-flex items-center gap-2 eyebrow text-fade hover:text-chalk transition-colors"
        >
          <span className="text-sm leading-none">←</span>
          Toutes les archives
        </Link>
      </div>
    </section>
  );
}
