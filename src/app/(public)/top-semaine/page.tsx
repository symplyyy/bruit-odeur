import Link from "next/link";
import { TopSemaineBoard } from "@/components/games/TopSemaine/TopSemaineBoard";
import { Badge } from "@/components/ui/Badge";
import { Spotlight } from "@/components/ui/Spotlight";
import { getOpenTop } from "@/lib/queries";

export const metadata = { title: "Top de la semaine" };

export default async function TopSemainePage() {
  const top = await getOpenTop();

  if (!top) {
    return (
      <section className="relative overflow-hidden">
        <Spotlight className="-top-40 -left-20" size={800} />
        <div className="relative mx-auto max-w-xl px-5 md:px-8 py-20 md:py-28 text-center flex flex-col items-center min-h-[calc(100dvh-140px)] justify-center">
          <Badge size="lg">En pause</Badge>
          <h1 className="font-display uppercase text-5xl md:text-6xl text-chalk mt-6 leading-[0.88] tracking-[-0.03em]">
            Rendez-vous <span className="text-brand-red">lundi</span>
          </h1>
          <Link
            href="/archives"
            className="mt-8 h-11 px-5 inline-flex items-center gap-2 hairline bg-chalk/5 text-chalk uppercase text-[11px] tracking-[0.22em] hover:bg-chalk/10 transition-colors"
          >
            Voir les précédents
            <span className="text-base leading-none text-brand-red">→</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <TopSemaineBoard
      topId={top.id}
      title={top.title}
      closeAt={top.closeAt.toISOString()}
      initialSorties={top.sorties.map((s) => ({
        id: s.id,
        artiste: s.artiste,
        titre: s.titre,
        pochetteUrl: s.pochetteUrl,
        embedUrl: s.embedUrl,
        category: s.category,
        votes: s.votes,
      }))}
    />
  );
}
