import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Spotlight } from "@/components/ui/Spotlight";
import { getArchivedTops } from "@/lib/queries";

export const metadata = { title: "Archives — Top de la semaine" };

export default async function TopSemaineArchivesPage() {
  const list = await getArchivedTops();

  return (
    <section className="relative overflow-hidden">
      <Spotlight className="-top-40 -left-20" size={900} />

      <div className="relative mx-auto max-w-5xl px-5 md:px-10 pt-10 md:pt-16 pb-20">
        <header className="hairline-b pb-8">
          <Badge tone="red" size="lg">
            Archives Top
          </Badge>
          <h1 className="font-display uppercase text-[44px] md:text-[84px] text-chalk mt-5 leading-[0.88] tracking-[-0.035em]">
            Les <span className="text-brand-red">passés</span>
          </h1>
        </header>

        {list.length === 0 ? (
          <p className="mt-10 eyebrow text-dim text-center">
            Pas encore d&apos;archive.
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
            {list.map((t) => (
              <li
                key={t.id}
                className="group hairline bg-chalk/5 hover:bg-chalk/10 hover:border-chalk/20 p-3 md:p-4 transition-colors flex gap-4"
              >
                {t.winner ? (
                  <div
                    className="w-20 h-20 hairline bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${t.winner.pochetteUrl})` }}
                  />
                ) : (
                  <div className="w-20 h-20 hairline bg-chalk/10 shrink-0 flex items-center justify-center">
                    <span className="font-display text-brand-red text-2xl">
                      —
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col">
                  <p className="eyebrow text-fade">
                    {t.year} · {t.total} votes
                  </p>
                  <p className="font-display uppercase text-base md:text-lg text-chalk mt-1 leading-tight line-clamp-2 tracking-[-0.01em]">
                    {t.title}
                  </p>
                  {t.winner && (
                    <p className="mt-auto pt-2 eyebrow text-brand-red truncate">
                      ① {t.winner.artiste} — {t.winner.titre}
                    </p>
                  )}
                </div>
              </li>
            ))}
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
