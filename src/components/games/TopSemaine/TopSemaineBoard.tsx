"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SortieCard } from "./SortieCard";
import { Countdown } from "@/components/ui/Countdown";
import { PseudoGate } from "@/components/ui/PseudoGate";
import { Spotlight } from "@/components/ui/Spotlight";
import { Badge } from "@/components/ui/Badge";
import { usePseudoStore } from "@/lib/pseudo-store";

type Sortie = {
  id: string;
  artiste: string;
  titre: string;
  pochetteUrl: string;
  embedUrl: string | null;
  category: string;
  votes: number;
};

type Props = {
  topId: string;
  title: string;
  closeAt: string;
  initialSorties: Sortie[];
};

export function TopSemaineBoard({
  topId,
  title,
  closeAt,
  initialSorties,
}: Props) {
  const pseudo = usePseudoStore((s) => s.pseudo);
  const hydrated = usePseudoStore((s) => s.hydrated);
  const reduced = useReducedMotion();
  const [sorties, setSorties] = useState(initialSorties);
  const [votedId, setVotedId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(`bno-top-${topId}`);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydratation one-shot depuis localStorage
    if (saved) setVotedId(saved);
  }, [topId]);

  const total = sorties.reduce((n, s) => n + s.votes, 0);
  const sorted = [...sorties].sort((a, b) => b.votes - a.votes);
  const rankById = new Map(sorted.map((s, i) => [s.id, i + 1]));
  const leaderId = total > 0 ? sorted[0].id : null;
  const revealed = votedId !== null;

  const submit = async (sortieId: string) => {
    if (!pseudo || pending || votedId) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topId, sortieId, pseudo }),
      });
      if (res.ok || res.status === 409) {
        setVotedId(sortieId);
        window.localStorage.setItem(`bno-top-${topId}`, sortieId);
        setSorties((prev) =>
          prev.map((s) =>
            s.id === sortieId ? { ...s, votes: s.votes + 1 } : s,
          ),
        );
      } else {
        setError("Erreur, réessaie");
      }
    } catch {
      setError("Connexion perdue");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <Spotlight className="-top-40 -right-20" size={800} />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8 pt-6 md:pt-10 pb-4">
        <div className="flex items-center justify-between">
          <Badge tone="live" size="lg">
            Top en cours
          </Badge>
          <Countdown target={closeAt} className="eyebrow text-mist" />
        </div>

        <motion.h1
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display uppercase text-[36px] sm:text-[48px] md:text-[64px] leading-[0.9] tracking-[-0.03em] text-chalk mt-5 max-w-[20ch]"
        >
          {title}
        </motion.h1>

        <p className="mt-3 eyebrow text-dim">
          {revealed
            ? `Merci @${pseudo} · résultats en direct`
            : `Choisis ta sortie · 1 vote`}
        </p>

        <div className="mt-7 md:mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sorties.map((s, i) => (
            <motion.div
              key={s.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: reduced ? 0 : i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <SortieCard
                sortieId={s.id}
                topId={topId}
                artiste={s.artiste}
                titre={s.titre}
                pochetteUrl={s.pochetteUrl}
                category={s.category}
                votes={s.votes}
                sharePct={total > 0 ? Math.round((s.votes / total) * 100) : 0}
                leading={revealed && s.id === leaderId && total > 0}
                voted={votedId === s.id}
                revealed={revealed}
                onVote={() => submit(s.id)}
                pending={pending}
                rank={rankById.get(s.id) ?? i + 1}
              />
            </motion.div>
          ))}
        </div>

        {error && (
          <p className="mt-6 text-center eyebrow text-brand-red">{error}</p>
        )}

        {hydrated && !pseudo && (
          <PseudoGate title="Ton pseudo" subtitle="Un pseudo et on vote." />
        )}
      </div>
    </section>
  );
}
