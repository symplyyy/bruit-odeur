import Link from "next/link";
import { HotTakeCard } from "@/components/games/HotTake/HotTakeCard";
import { Badge } from "@/components/ui/Badge";
import { Spotlight } from "@/components/ui/Spotlight";
import { getOpenHotTake } from "@/lib/queries";

export const metadata = { title: "Hot Take" };

export default async function HotTakePage() {
  const hot = await getOpenHotTake();

  if (!hot) {
    return (
      <section className="relative overflow-hidden">
        <Spotlight className="-top-40 -left-20" size={800} />
        <div className="relative mx-auto max-w-xl px-5 md:px-8 py-20 md:py-28 text-center flex flex-col items-center min-h-[calc(100dvh-140px)] justify-center">
          <Badge size="lg">En pause</Badge>
          <h1 className="font-display uppercase text-5xl md:text-6xl text-chalk mt-6 leading-[0.88] tracking-[-0.03em]">
            Prochain <span className="text-brand-red">bientôt</span>
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
    <HotTakeCard
      hotTakeId={hot.id}
      statement={hot.statement}
      backgroundUrl={hot.backgroundUrl}
      initialFire={hot.fire}
      initialFroid={hot.froid}
      optionALabel={hot.optionALabel}
      optionBLabel={hot.optionBLabel}
    />
  );
}
