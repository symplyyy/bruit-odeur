"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Countdown } from "@/components/ui/Countdown";
import { usePseudoStore } from "@/lib/pseudo-store";
import { cn } from "@/lib/utils";

type Entry = {
  id: string;
  name: string;
  slug: string;
  votes: number;
  topVotes: number;
  hotVotes: number;
};

type Props = {
  endOfWeek: string;
  entries: Entry[];
};

export function WeeklyLeaderboard({ endOfWeek, entries }: Props) {
  const pseudo = usePseudoStore((s) => s.pseudo);
  const reduced = useReducedMotion();

  return (
    <section className="relative mt-8 md:mt-12">
      <header className="flex flex-wrap items-end justify-between gap-3 pb-4">
        <div>
          <p className="eyebrow text-dim">Classement live</p>
          <h2 className="font-display uppercase text-[28px] md:text-[36px] leading-none tracking-[-0.025em] text-chalk mt-2">
            Top <span className="text-brand-red">votants</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 eyebrow">
          <span className="text-dim">Fin dans</span>
          <Countdown
            target={endOfWeek}
            className="text-brand-red tabular-nums"
          />
        </div>
      </header>

      {entries.length === 0 ? (
        <div className="hairline bg-chalk/[0.02] px-5 py-10 text-center">
          <p className="eyebrow text-dim">Personne n&apos;a encore voté cette semaine.</p>
          <p className="mt-2 font-display uppercase text-[20px] md:text-[24px] tracking-[-0.02em] text-chalk">
            Sois le premier.
          </p>
        </div>
      ) : (
        <ol className="hairline divide-y divide-chalk/10 bg-chalk/[0.02]">
          {entries.map((entry, idx) => {
            const rank = idx + 1;
            const mine = pseudo === entry.name;
            return (
              <motion.li
                key={entry.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(idx * 0.035, 0.35),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/pseudo/${encodeURIComponent(entry.slug)}`}
                  className={cn(
                    "group flex items-center gap-4 px-4 md:px-5 py-3 md:py-4 transition-colors",
                    mine
                      ? "bg-brand-red/10 hover:bg-brand-red/15"
                      : "hover:bg-chalk/[0.04]",
                  )}
                >
                  <RankBadge rank={rank} />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-display uppercase text-[20px] md:text-[24px] leading-none tracking-[-0.02em] truncate",
                        rank === 1
                          ? "text-brand-red"
                          : mine
                            ? "text-chalk"
                            : "text-chalk",
                      )}
                    >
                      {entry.name}
                      {mine && (
                        <span className="ml-2 chip chip-sm chip-red align-middle">
                          toi
                        </span>
                      )}
                    </p>
                    <p className="mt-1 eyebrow text-mist">
                      {entry.topVotes > 0 && (
                        <span>
                          {entry.topVotes} Top
                        </span>
                      )}
                      {entry.topVotes > 0 && entry.hotVotes > 0 && (
                        <span className="mx-2 text-dim">·</span>
                      )}
                      {entry.hotVotes > 0 && (
                        <span>{entry.hotVotes} Hot</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0">
                    <span
                      className={cn(
                        "font-display tabular-nums text-[32px] md:text-[40px] leading-none tracking-[-0.03em]",
                        rank === 1 ? "text-brand-red" : "text-chalk",
                      )}
                    >
                      {entry.votes}
                    </span>
                    <span className="eyebrow text-dim hidden sm:inline">
                      votes
                    </span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const isPodium = rank <= 3;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center h-10 w-10 md:h-12 md:w-12 font-display leading-none shrink-0",
        rank === 1 && "bg-brand-red text-white",
        rank === 2 && "bg-chalk text-ink",
        rank === 3 && "bg-chalk/80 text-ink",
        !isPodium && "hairline bg-chalk/5 text-chalk",
      )}
      style={{ transform: "skewX(-12deg)" }}
    >
      <span
        className="text-[18px] md:text-[22px] tracking-[-0.02em]"
        style={{ transform: "skewX(12deg)" }}
      >
        {rank}
      </span>
    </span>
  );
}
