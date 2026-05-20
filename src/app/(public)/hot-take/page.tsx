import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Spotlight } from "@/components/ui/Spotlight";
import { HotTakeCard } from "@/components/games/HotTake/HotTakeCard";
import { getOpenHotTakes } from "@/lib/queries";

export const metadata = { title: "Hot Take" };
export const dynamic = "force-dynamic";

export default async function HotTakePage() {
  const hotTakes = await getOpenHotTakes();

  if (hotTakes.length === 0) {
    return (
      <section className="relative overflow-hidden">
        <Spotlight className="-top-40 -left-20" size={800} />
        <div className="relative mx-auto max-w-xl px-5 md:px-8 py-20 md:py-28 text-center flex flex-col items-center min-h-[calc(100dvh-140px)] justify-center">
          <Badge size="lg">En pause</Badge>
          <h1 className="font-display uppercase text-5xl md:text-6xl text-chalk mt-6 leading-[0.88] tracking-[-0.03em]">
            Prochain <span className="text-brand-red">bientôt</span>
          </h1>
          <Link
            href="/hot-take/archives"
            className="mt-8 h-11 px-5 inline-flex items-center gap-2 hairline bg-chalk/5 text-chalk uppercase text-[11px] tracking-[0.22em] hover:bg-chalk/10 transition-colors"
          >
            Voir les précédents
            <span className="text-base leading-none text-brand-red">→</span>
          </Link>
        </div>
      </section>
    );
  }

  if (hotTakes.length === 1) {
    const hot = hotTakes[0];
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

  return (
    <section className="relative">
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(152deg, #7a1414 0%, #2a0808 26%, #0a0a0a 50%, #0a1624 74%, #0f2a4a 100%)",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-[0.1] mix-blend-overlay" />
        <div className="absolute -top-40 -left-24 w-[520px] h-[520px] rounded-full bg-brand-red/20 blur-3xl" />
        <div className="absolute -bottom-52 -right-32 w-[640px] h-[640px] rounded-full bg-[#2088ff]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 md:px-8 pt-6 md:pt-10 pb-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Badge tone="red" size="lg">
            Hot Takes
          </Badge>
          <span className="eyebrow text-mist tabular-nums">
            {hotTakes.length} ouverts
          </span>
        </div>

        <h1 className="mt-8 md:mt-10 font-display uppercase text-[44px] sm:text-[64px] md:text-[80px] leading-[0.88] tracking-[-0.035em] text-chalk">
          Choisis ton <span className="text-brand-red">débat</span>
        </h1>
        <p className="mt-4 eyebrow text-mist">
          Un vote par Hot Take · tranche-les tous
        </p>

        <ul className="mt-10 space-y-3 md:space-y-4">
          {hotTakes.map((hot) => {
            const total = hot.fire + hot.froid;
            const firePct =
              total > 0 ? Math.round((hot.fire / total) * 100) : null;
            const labelA = hot.optionALabel ?? "Chaud";
            const labelB = hot.optionBLabel ?? "Froid";
            const isVersus = !!(hot.optionALabel && hot.optionBLabel);
            return (
              <li key={hot.id}>
                <Link
                  href={`/hot-take/${hot.id}`}
                  className="group relative block hairline bg-ink/40 backdrop-blur-sm p-5 md:p-6 hover:bg-ink/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="chip chip-red chip-sm">
                        {isVersus ? "Versus" : "Hot Take"}
                      </span>
                      {total > 0 && (
                        <span className="eyebrow text-dim tabular-nums">
                          {total} vote{total > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <span className="w-9 h-9 shrink-0 flex items-center justify-center hairline bg-chalk/5 text-chalk text-lg leading-none group-hover:bg-brand-red group-hover:border-brand-red group-hover:text-white transition-colors">
                      →
                    </span>
                  </div>

                  <p className="mt-4 font-display uppercase text-[24px] md:text-[34px] leading-[0.95] tracking-[-0.025em] text-chalk line-clamp-3">
                    « {hot.statement.toUpperCase()} »
                  </p>

                  <div className="mt-5 flex items-center gap-3 flex-wrap">
                    <span className="chip chip-red chip-sm truncate max-w-[10rem]">
                      {labelA}
                    </span>
                    <span className="eyebrow text-dim">vs</span>
                    <span className="chip chip-blue chip-sm truncate max-w-[10rem]">
                      {labelB}
                    </span>
                    {firePct !== null && (
                      <span className="ml-auto eyebrow text-mist tabular-nums">
                        {firePct}% / {100 - firePct}%
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/hot-take/archives"
            className="eyebrow text-fade hover:text-chalk transition-colors"
          >
            Archives
          </Link>
        </div>
      </div>
    </section>
  );
}
