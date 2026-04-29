"use client";

import { motion } from "framer-motion";
import { usePseudoStore } from "@/lib/pseudo-store";
import { cn } from "@/lib/utils";

type Props = {
  sortieId: string;
  topId: string;
  artiste: string;
  titre: string;
  pochetteUrl: string;
  category: string;
  sharePct: number;
  votes: number;
  leading: boolean;
  voted: boolean;
  revealed: boolean;
  onVote: () => void;
  pending: boolean;
  rank: number;
};

export function SortieCard({
  artiste,
  titre,
  pochetteUrl,
  sharePct,
  votes,
  leading,
  voted,
  revealed,
  onVote,
  pending,
  rank,
}: Props) {
  const pseudo = usePseudoStore((s) => s.pseudo);
  const canVote = !!pseudo && !revealed && !pending;

  return (
    <motion.button
      type="button"
      onClick={onVote}
      disabled={!canVote}
      whileHover={canVote ? { y: -2 } : undefined}
      whileTap={canVote ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "group relative w-full text-left overflow-hidden bg-smoke/60",
        leading ? "animate-leading" : "hairline",
        voted && "outline outline-2 outline-brand-red outline-offset-[-1px]",
        !canVote && "cursor-default",
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1s] ease-out group-hover:scale-[1.06]"
          style={{ backgroundImage: `url(${pochetteUrl})` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent"
        />

        {revealed && (
          <span
            className={cn(
              "absolute top-2 left-2 w-7 h-7 flex items-center justify-center font-display text-sm",
              leading ? "bg-brand-red text-white" : "bg-ink/80 text-chalk hairline backdrop-blur-sm",
            )}
          >
            {rank}
          </span>
        )}

        {voted && (
          <div className="absolute top-2 right-2">
            <span className="chip chip-red chip-sm">Ton vote</span>
          </div>
        )}
      </div>

      <div className="relative p-3">
        <p className="eyebrow text-fade truncate">{artiste}</p>
        <p className="font-display uppercase text-base md:text-lg text-chalk mt-1 leading-tight line-clamp-2 tracking-[-0.01em]">
          {titre}
        </p>

        {revealed ? (
          <div className="mt-3">
            <div className="h-[3px] bg-chalk/10 w-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sharePct}%` }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1,
                }}
                className={leading ? "h-full bg-brand-red" : "h-full bg-chalk"}
              />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p
                className={cn(
                  "font-display text-2xl leading-none tracking-[-0.02em]",
                  leading ? "text-brand-red" : "text-chalk",
                )}
              >
                {sharePct}%
              </p>
              <p className="eyebrow text-dim">
                {votes}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between">
            <span className="eyebrow text-brand-red">Voter</span>
            <span className="text-lg leading-none text-brand-red group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
