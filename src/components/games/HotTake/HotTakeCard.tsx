"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePseudoStore } from "@/lib/pseudo-store";
import { PseudoGate } from "@/components/ui/PseudoGate";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type Side = "FIRE" | "FROID";

type Props = {
  hotTakeId: string;
  statement: string;
  backgroundUrl?: string | null;
  initialFire: number;
  initialFroid: number;
  optionALabel?: string | null;
  optionBLabel?: string | null;
};

export function HotTakeCard({
  hotTakeId,
  statement,
  backgroundUrl,
  initialFire,
  initialFroid,
  optionALabel,
  optionBLabel,
}: Props) {
  const isVersus = !!(optionALabel && optionBLabel);
  const labelA = optionALabel ?? "Chaud";
  const labelB = optionBLabel ?? "Froid";
  const subA = isVersus ? "Option A" : "D’accord";
  const subB = isVersus ? "Option B" : "Pas d’accord";
  const pseudo = usePseudoStore((s) => s.pseudo);
  const hydrated = usePseudoStore((s) => s.hydrated);
  const reduced = useReducedMotion();
  const [fire, setFire] = useState(initialFire);
  const [froid, setFroid] = useState(initialFroid);
  const [voted, setVoted] = useState<Side | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = `bno-hottake-${hotTakeId}`;
    const saved = window.localStorage.getItem(key) as Side | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydratation one-shot depuis localStorage
    if (saved) setVoted(saved);
  }, [hotTakeId]);

  const submit = async (side: Side) => {
    if (!pseudo || pending || voted) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/hot-takes/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotTakeId, side, pseudo }),
      });
      if (res.ok) {
        setVoted(side);
        if (side === "FIRE") setFire((n) => n + 1);
        else setFroid((n) => n + 1);
        window.localStorage.setItem(`bno-hottake-${hotTakeId}`, side);
      } else if (res.status === 409) {
        setVoted(side);
        window.localStorage.setItem(`bno-hottake-${hotTakeId}`, side);
      } else {
        setError("Erreur, réessaie");
      }
    } catch {
      setError("Connexion perdue");
    } finally {
      setPending(false);
    }
  };

  const total = fire + froid;
  const firePct = total > 0 ? Math.round((fire / total) * 100) : 50;
  const froidPct = 100 - firePct;
  const upper = statement.toUpperCase();
  const winner = voted ? (firePct >= 50 ? "FIRE" : "FROID") : null;

  return (
    <section className="relative">
      {/* ---------- Backdrop duotone rouge/bleu (pleine hauteur, passe derrière header & footer) ---------- */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(152deg, #7a1414 0%, #2a0808 26%, #0a0a0a 50%, #0a1624 74%, #0f2a4a 100%)",
          }}
        />
        {backgroundUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-grid opacity-[0.1] mix-blend-overlay" />
        <div className="absolute -top-40 -left-24 w-[520px] h-[520px] rounded-full bg-brand-red/20 blur-3xl" />
        <div className="absolute -bottom-52 -right-32 w-[640px] h-[640px] rounded-full bg-[#2088ff]/20 blur-3xl" />
      </div>

      {/* ---------- Contenu ---------- */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 md:px-8 pt-6 md:pt-10 pb-6 flex flex-col min-h-[calc(100dvh-140px)]">
        {/* Header : badge + compteur de votes */}
        <div className="relative flex items-center justify-between">
          <Badge tone="red" size="lg">
            {isVersus ? "Versus" : "Hot Take"}
          </Badge>
          {total > 0 && (
            <span className="eyebrow text-mist tabular-nums">
              {total} vote{total > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Statement — énorme, majuscules forcées, guillemets décoratifs */}
        <div className="relative flex-1 flex items-center mt-8 md:mt-10">
          <div className="relative">
            <span
              aria-hidden
              className="absolute -top-10 -left-3 md:-top-14 md:-left-6 font-display text-[120px] md:text-[180px] leading-none text-brand-red/30 select-none"
            >
              «
            </span>
            <motion.h1
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative font-display uppercase text-[44px] sm:text-[64px] md:text-[84px] leading-[0.88] tracking-[-0.035em] text-chalk"
              style={{ fontFeatureSettings: "'kern' 1" }}
            >
              {upper}
            </motion.h1>
            <span
              aria-hidden
              className="absolute bottom-[-1rem] right-0 md:right-4 font-display text-[120px] md:text-[180px] leading-none text-brand-red/30 select-none"
            >
              »
            </span>
          </div>
        </div>

        {/* Zone d'action : vote ou reveal */}
        <div className="relative mt-auto pt-10">
          <AnimatePresence mode="wait">
            {!voted ? (
              <motion.div
                key="vote"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 gap-3 md:gap-4"
              >
                <VoteButton
                  side="FIRE"
                  label={labelA}
                  sublabel={subA}
                  onClick={() => submit("FIRE")}
                  disabled={!pseudo || pending}
                />
                <VoteButton
                  side="FROID"
                  label={labelB}
                  sublabel={subB}
                  onClick={() => submit("FROID")}
                  disabled={!pseudo || pending}
                />
              </motion.div>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="animate-kick"
              >
                <div className="flex items-end justify-between gap-4">
                  <Metric
                    label={labelA}
                    pct={firePct}
                    active={voted === "FIRE"}
                    win={winner === "FIRE"}
                    color="red"
                  />
                  <Metric
                    label={labelB}
                    pct={froidPct}
                    active={voted === "FROID"}
                    win={winner === "FROID"}
                    color="blue"
                    align="right"
                  />
                </div>

                {/* Barre proportionnelle double — rouge vs bleu */}
                <div className="relative mt-5 h-3 md:h-4 overflow-hidden hairline bg-chalk/5">
                  <motion.div
                    initial={{ width: "50%" }}
                    animate={{ width: `${firePct}%` }}
                    transition={{
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.1,
                    }}
                    className="absolute inset-y-0 left-0 bg-brand-red"
                  />
                  <motion.div
                    initial={{ width: "50%" }}
                    animate={{ width: `${froidPct}%` }}
                    transition={{
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.1,
                    }}
                    className="absolute inset-y-0 right-0 bg-[#2088ff]"
                  />
                </div>

                <p className="mt-4 eyebrow text-mist text-center">
                  Tu as voté{" "}
                  <span
                    className={cn(
                      voted === "FIRE" ? "text-brand-red" : "text-[#2088ff]",
                    )}
                  >
                    {(voted === "FIRE" ? labelA : labelB).toUpperCase()}
                  </span>{" "}
                  · merci @{pseudo}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="mt-3 eyebrow text-brand-red text-center">{error}</p>
          )}
        </div>

        {hydrated && !pseudo && (
          <PseudoGate
            title="Ton pseudo"
            subtitle="Avant de voter, dis-nous qui tu es."
          />
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function VoteButton({
  side,
  label,
  sublabel,
  onClick,
  disabled,
}: {
  side: Side;
  label: string;
  sublabel: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const isFire = side === "FIRE";
  const upper = label.toUpperCase();
  const sizeCls =
    upper.length > 12
      ? "text-2xl md:text-3xl"
      : upper.length > 7
        ? "text-3xl md:text-4xl"
        : "text-5xl md:text-6xl";
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative h-28 md:h-32 transition-colors overflow-hidden",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        isFire
          ? "bg-brand-red text-white hover:bg-brand-red-hot glow-red"
          : "bg-[#2088ff] text-white hover:bg-[#1a6fd9]",
      )}
    >
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1 px-3 text-center">
        <span
          className={cn(
            "font-display uppercase leading-none tracking-[-0.025em] break-words max-w-full",
            sizeCls,
          )}
        >
          {upper}
        </span>
        <span className="eyebrow text-white/70">{sublabel}</span>
      </div>
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.22),transparent)] bg-[length:200%_100%] animate-[shimmer_1.2s_linear_infinite]"
      />
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */

function Metric({
  label,
  pct,
  active,
  win,
  color,
  align = "left",
}: {
  label: string;
  pct: number;
  active: boolean;
  win: boolean;
  color: "red" | "blue";
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="eyebrow text-mist flex items-center gap-2 justify-start">
        {align === "right" ? (
          <>
            {win && <span className="chip chip-red chip-sm">Majorité</span>}
            <span>{label.toUpperCase()}</span>
            {active && <span className="text-brand-red">· toi</span>}
          </>
        ) : (
          <>
            <span>{label.toUpperCase()}</span>
            {active && <span className="text-brand-red">· toi</span>}
            {win && <span className="chip chip-red chip-sm">Majorité</span>}
          </>
        )}
      </p>
      <p
        className={cn(
          "font-display mt-2 leading-none tracking-[-0.03em] text-6xl md:text-8xl",
          color === "red" ? "text-brand-red" : "text-[#2088ff]",
        )}
      >
        {pct}%
      </p>
    </div>
  );
}
