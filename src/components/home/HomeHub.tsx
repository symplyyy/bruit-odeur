"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { usePseudoStore } from "@/lib/pseudo-store";
import { PseudoGate } from "@/components/ui/PseudoGate";
import { Countdown } from "@/components/ui/Countdown";
import { Spotlight } from "@/components/ui/Spotlight";
import { Badge } from "@/components/ui/Badge";
import { WeeklyLeaderboard } from "@/components/home/WeeklyLeaderboard";
import { getIsoWeek } from "@/lib/utils";

type HotTakeData = {
  id: string;
  statement: string;
  backgroundUrl: string | null;
  totalVotes: number;
  optionALabel: string | null;
  optionBLabel: string | null;
};

type TopData = {
  id: string;
  title: string;
  closeAt: string;
  totalVotes: number;
  previews: { pochetteUrl: string }[];
};

type LeaderboardEntry = {
  id: string;
  name: string;
  slug: string;
  votes: number;
  topVotes: number;
  hotVotes: number;
};

type LeaderboardData = {
  endOfWeek: string;
  total: number;
  entries: LeaderboardEntry[];
};

type Props = {
  hotTake: HotTakeData | null;
  top: TopData | null;
  leaderboard: LeaderboardData;
};

/**
 * Home = launcher. Deux tuiles de jeu, plein pot. Un seul but : cliquer et voter.
 */
export function HomeHub({ hotTake, top, leaderboard }: Props) {
  const pseudo = usePseudoStore((s) => s.pseudo);
  const hydrated = usePseudoStore((s) => s.hydrated);
  const reduced = useReducedMotion();
  const showGate = hydrated && !pseudo;

  const weekNumber = getIsoWeek();
  const myEntry =
    hydrated && pseudo
      ? leaderboard.entries.find((e) => e.name === pseudo)
      : null;
  const myRank = myEntry
    ? leaderboard.entries.indexOf(myEntry) + 1
    : null;

  return (
    <>
      <div className="relative mx-auto max-w-5xl px-4 md:px-8 pt-6 md:pt-10 flex flex-col">
        <Spotlight className="-top-48 -right-20" size={800} />
        <Spotlight variant="red-soft" className="top-1/2 -left-32" size={700} />

        <div className="relative flex items-center justify-between gap-3 flex-wrap">
          <Badge tone="live" size="lg">
            En direct
          </Badge>
          <span className="eyebrow text-dim tabular-nums">
            Semaine {weekNumber}
          </span>
        </div>

        <HeaderHeadline />

        <StatusLine
          hydrated={hydrated}
          pseudo={pseudo}
          rank={myRank}
          myEntry={myEntry}
          leaderboardTotal={leaderboard.total}
          hotTakeOpen={!!hotTake}
          topOpen={!!top}
        />

        <div className="relative mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <HotTakeTile hotTake={hotTake} delay={0} reduced={!!reduced} />
          <TopTile top={top} delay={0.06} reduced={!!reduced} />
        </div>

        <WeeklyLeaderboard
          endOfWeek={leaderboard.endOfWeek}
          entries={leaderboard.entries}
        />

        <div className="relative mt-8 mb-2 flex items-center justify-center gap-4">
          <span className="eyebrow text-dim">Un pseudo · un vote</span>
          <span className="eyebrow text-dim">·</span>
          <Link
            href="/archives"
            className="eyebrow text-fade hover:text-chalk transition-colors"
          >
            Archives
          </Link>
        </div>
      </div>

      {showGate && (
        <PseudoGate
          title="Ton pseudo"
          subtitle="Avant de voter, dis-nous qui tu es."
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER — titre dynamique + status line                              */
/* ------------------------------------------------------------------ */

const HEADLINE_CLS =
  "relative font-display uppercase text-[48px] sm:text-[72px] md:text-[96px] leading-[0.86] tracking-[-0.035em] text-chalk mt-6 md:mt-8";

function HeaderHeadline() {
  return (
    <h1 className={HEADLINE_CLS}>
      Le bruit
      <br />
      <span className="text-brand-red">&amp; l&apos;odeur</span>
    </h1>
  );
}

function StatusLine({
  hydrated,
  pseudo,
  rank,
  myEntry,
  leaderboardTotal,
  hotTakeOpen,
  topOpen,
}: {
  hydrated: boolean;
  pseudo: string | null;
  rank: number | null;
  myEntry: LeaderboardEntry | null | undefined;
  leaderboardTotal: number;
  hotTakeOpen: boolean;
  topOpen: boolean;
}) {
  if (!hydrated) {
    return <div className="h-8 mt-4" />;
  }

  if (!pseudo) {
    const missions = [hotTakeOpen && "Hot Take", topOpen && "Top"].filter(
      Boolean,
    ) as string[];
    return (
      <p className="relative mt-5 eyebrow text-dim">
        {missions.length > 0 ? (
          <>
            {missions.length} vote{missions.length > 1 ? "s" : ""} t&apos;attendent
            · <span className="text-chalk">choisis ton pseudo</span>
          </>
        ) : (
          "Prochain drop bientôt"
        )}
      </p>
    );
  }

  const votes = myEntry?.votes ?? 0;
  const topVotes = myEntry?.topVotes ?? 0;
  const hotVotes = myEntry?.hotVotes ?? 0;

  return (
    <div className="relative mt-5 flex items-center gap-3 flex-wrap">
      <Link
        href={`/pseudo/${encodeURIComponent(pseudo)}`}
        className="chip hover:text-chalk transition-colors"
      >
        @{pseudo}
      </Link>
      {votes > 0 ? (
        <>
          <span className="eyebrow text-mist tabular-nums">
            {votes} vote{votes > 1 ? "s" : ""}
          </span>
          {topVotes > 0 && (
            <span className="eyebrow text-dim">· {topVotes} Top</span>
          )}
          {hotVotes > 0 && (
            <span className="eyebrow text-dim">· {hotVotes} Hot</span>
          )}
          {rank && rank > 3 && leaderboardTotal > 0 && (
            <span className="eyebrow text-brand-red">· rang #{rank}</span>
          )}
        </>
      ) : (
        <span className="eyebrow text-brand-red">
          0 vote cette semaine · fais-toi entendre
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

const TILE_CLS =
  "group relative block overflow-hidden aspect-[4/5] md:aspect-[5/6] hairline";

function TileMotion({
  delay,
  reduced,
  children,
}: {
  delay: number;
  reduced: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function TileHeader({
  kicker,
  red,
  arrow,
}: {
  kicker: string;
  red?: boolean;
  arrow: boolean;
}) {
  return (
    <div className="relative flex items-start justify-between">
      <span className={red ? "chip chip-red" : "chip"}>{kicker}</span>
      {arrow && (
        <span className="w-9 h-9 flex items-center justify-center hairline bg-chalk/5 text-chalk text-lg leading-none group-hover:bg-brand-red group-hover:border-brand-red group-hover:text-white transition-colors">
          →
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOT TAKE — duel visuel Chaud / Froid (ou A vs B si versus)        */
/* ------------------------------------------------------------------ */

function HotTakeTile({
  hotTake,
  delay,
  reduced,
}: {
  hotTake: HotTakeData | null;
  delay: number;
  reduced: boolean;
}) {
  if (!hotTake) {
    return (
      <TileMotion delay={delay} reduced={reduced}>
        <div className={`${TILE_CLS} opacity-60 pointer-events-none`}>
          <HotTakeBackdrop />
          <div className="relative h-full p-5 md:p-7 flex flex-col justify-between">
            <TileHeader kicker="Hot Take" red arrow={false} />
            <div className="space-y-3">
              <p className="font-display uppercase text-[28px] md:text-[38px] leading-[0.95] tracking-[-0.025em] text-chalk">
                En pause
              </p>
              <p className="eyebrow text-dim">Prochain arrive</p>
            </div>
          </div>
        </div>
      </TileMotion>
    );
  }

  return (
    <TileMotion delay={delay} reduced={reduced}>
      <Link href="/hot-take" className={TILE_CLS}>
        <HotTakeBackdrop />

        {/* Point d'interrogation décoratif */}
        <span
          aria-hidden
          className="absolute top-[18%] right-[8%] font-display text-[160px] md:text-[220px] leading-none text-chalk/10 select-none group-hover:text-chalk/15 transition-colors duration-500"
        >
          ?
        </span>

        <div className="relative h-full p-5 md:p-7 flex flex-col justify-between">
          <TileHeader kicker="Hot Take" red arrow />

          <div className="relative">
            <p className="font-display uppercase text-[22px] md:text-[32px] leading-[0.98] tracking-[-0.022em] text-chalk line-clamp-4">
              « {hotTake.statement.toUpperCase()} »
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="chip chip-red chip-sm truncate max-w-[9rem]">
                {hotTake.optionALabel ?? "Chaud"}
              </span>
              <span className="eyebrow text-dim">vs</span>
              <span className="chip chip-blue chip-sm truncate max-w-[9rem]">
                {hotTake.optionBLabel ?? "Froid"}
              </span>
            </div>
            <p className="mt-3 eyebrow text-mist">
              {hotTake.totalVotes} votes · tranche ton camp
            </p>
          </div>
        </div>
      </Link>
    </TileMotion>
  );
}

/* Dégradé diagonal rouge → sombre → bleu (métaphore Chaud/Froid) */
function HotTakeBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(152deg, #7a1414 0%, #2a0808 28%, #0a0a0a 50%, #0a1624 72%, #0f2a4a 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-grid opacity-[0.14] mix-blend-overlay"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  TOP — mini podium 2-1-3 avec pochettes                             */
/* ------------------------------------------------------------------ */

function TopTile({
  top,
  delay,
  reduced,
}: {
  top: TopData | null;
  delay: number;
  reduced: boolean;
}) {
  if (!top) {
    return (
      <TileMotion delay={delay} reduced={reduced}>
        <div className={`${TILE_CLS} opacity-60 pointer-events-none`}>
          <div className="absolute inset-0 bg-gradient-to-br from-smoke to-ink" />
          <div className="relative h-full p-5 md:p-7 flex flex-col justify-between">
            <TileHeader kicker="Top de la semaine" arrow={false} />
            <div className="space-y-3">
              <p className="font-display uppercase text-[28px] md:text-[38px] leading-[0.95] tracking-[-0.025em] text-chalk">
                En pause
              </p>
              <p className="eyebrow text-dim">Lundi prochain</p>
            </div>
          </div>
        </div>
      </TileMotion>
    );
  }

  const covers = top.previews.slice(0, 3);

  return (
    <TileMotion delay={delay} reduced={reduced}>
      <Link href="/top-semaine" className={TILE_CLS}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#151515] via-smoke to-ink" />

        {/* halo rouge décoratif */}
        <div
          aria-hidden
          className="absolute -top-24 -right-16 w-[260px] h-[260px] rounded-full bg-brand-red/20 blur-3xl group-hover:bg-brand-red/30 transition-colors duration-500"
        />

        <div className="relative h-full p-5 md:p-7 flex flex-col justify-between">
          <TileHeader kicker="Top de la semaine" arrow />

          {/* Mini podium 2 | 1 | 3 */}
          <div className="relative flex items-end justify-center gap-2 md:gap-3">
            <PodiumCover src={covers[1]?.pochetteUrl} rank={2} size="sm" />
            <PodiumCover src={covers[0]?.pochetteUrl} rank={1} size="lg" />
            <PodiumCover src={covers[2]?.pochetteUrl} rank={3} size="sm" />
          </div>

          <div className="relative">
            <p className="font-display uppercase text-[22px] md:text-[32px] leading-[0.98] tracking-[-0.022em] text-chalk line-clamp-2">
              {top.title}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <Countdown
                target={top.closeAt}
                className="eyebrow text-brand-red"
              />
              <span className="eyebrow text-mist">{top.totalVotes} votes</span>
            </div>
          </div>
        </div>
      </Link>
    </TileMotion>
  );
}

/* Une pochette empilée pour le mini-podium. */
function PodiumCover({
  src,
  rank,
  size,
}: {
  src?: string;
  rank: 1 | 2 | 3;
  size: "sm" | "lg";
}) {
  const isLead = rank === 1;
  const sizeCls =
    size === "lg"
      ? "w-[46%] aspect-square"
      : "w-[30%] aspect-square mb-3 md:mb-5";
  return (
    <div className={`relative ${sizeCls}`}>
      <div
        className={`absolute inset-0 bg-cover bg-center hairline ${
          isLead ? "outline outline-2 outline-brand-red outline-offset-[-2px]" : ""
        }`}
        style={{
          backgroundImage: src
            ? `url(${src})`
            : "linear-gradient(135deg, #222 0%, #111 100%)",
        }}
      />
      {/* Numéro de rang en parallélogramme */}
      <span
        className={`absolute -top-2 -left-2 inline-flex items-center justify-center font-display leading-none text-white ${
          isLead ? "bg-brand-red text-[22px] md:text-[28px] px-3 py-1.5" : "bg-black text-[14px] md:text-[16px] px-2 py-1"
        }`}
        style={{ transform: "skewX(-12deg)" }}
      >
        <span style={{ transform: "skewX(12deg)" }}>{rank}</span>
      </span>
    </div>
  );
}
