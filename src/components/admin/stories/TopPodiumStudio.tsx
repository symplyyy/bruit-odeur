"use client";

import { useEffect, useRef, useState } from "react";
import { Card, MacButton, MacField, MacInput, Segmented } from "@/components/admin/mac/primitives";
import { Download, Sparkles } from "lucide-react";
import { LOGO_THEMES, logoUrl, type LogoTheme } from "@/lib/logo-variants";
import { exportStage } from "@/lib/story-export";

type PodiumSortie = {
  id: string;
  artiste: string;
  titre: string;
  pochetteUrl: string;
  category: string;
  votes: number;
};

type Props = {
  top: {
    id: string;
    title: string;
    weekNumber: number;
    year: number;
    totalVotes: number;
    sorties: PodiumSortie[];
  };
};

/* Story IG : 1080 × 1920. */
const STAGE_W = 1080;
const STAGE_H = 1920;

export function TopPodiumStudio({ top }: Props) {
  const [accent, setAccent] = useState<"red" | "mono" | "light">("red");
  const [logoTheme, setLogoTheme] = useState<LogoTheme>("default");
  const [heading, setHeading] = useState(`Top Semaine · S${top.weekNumber}`);
  const [pending, setPending] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  /* Fit-to-view : le preview se met à l'échelle du conteneur dispo. */
  useEffect(() => {
    const update = () => {
      const w = wrapRef.current?.clientWidth ?? 0;
      const h = window.innerHeight - 280;
      if (!w) return;
      setScale(Math.min(w / STAGE_W, h / STAGE_H, 0.6));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onExport = async () => {
    const node = stageRef.current;
    if (!node) return;
    setPending(true);
    try {
      await exportStage(
        node,
        STAGE_W,
        STAGE_H,
        `podium-s${top.weekNumber}-${top.year}.png`,
      );
    } finally {
      setPending(false);
    }
  };

  const [gold, silver, bronze] = top.sorties;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4 items-start">
      {/* ---------- Inspector ---------- */}
      <aside className="xl:sticky xl:top-[116px]">
        <Card>
          <div className="flex items-center h-9 px-3 border-b border-[color:var(--c-border)]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[color:var(--c-text-3)]">
              <Sparkles size={13} strokeWidth={1.75} className="text-[color:var(--c-text-4)]" />
              Story podium
            </div>
          </div>
          <div className="p-4 space-y-5">
            <MacField label="Titre en haut">
              <MacInput
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Top Semaine · S42"
              />
            </MacField>
            <MacField label="Palette">
              <Segmented
                size="sm"
                value={accent}
                onChange={(v) => setAccent(v)}
                options={[
                  { value: "red", label: "Rouge" },
                  { value: "mono", label: "Noir" },
                  { value: "light", label: "Clair" },
                ]}
              />
            </MacField>
            <MacField label="Logo">
              <Segmented
                size="sm"
                value={logoTheme}
                onChange={(v) => setLogoTheme(v)}
                options={LOGO_THEMES.map((t) => ({
                  value: t.value,
                  label: t.label,
                }))}
              />
            </MacField>
            <div className="pt-2 border-t border-[color:var(--c-border)]">
              <MacButton
                variant="primary"
                onClick={onExport}
                disabled={pending || top.sorties.length < 3}
                icon={<Download size={13} strokeWidth={1.75} />}
              >
                {pending ? "Export…" : "Exporter PNG"}
              </MacButton>
              {top.sorties.length < 3 && (
                <p className="mt-2 text-[11px] text-[color:var(--c-text-3)]">
                  Il faut au moins 3 sorties pour générer un podium.
                </p>
              )}
            </div>
          </div>
        </Card>
      </aside>

      {/* ---------- Preview stage ---------- */}
      <div ref={wrapRef} className="min-w-0">
        <div
          className="rounded-[10px] border border-[color:var(--c-border)] bg-[color:var(--c-surface-2)] overflow-hidden flex items-center justify-center"
          style={{ height: `${STAGE_H * scale + 32}px` }}
        >
          <div style={{ width: STAGE_W * scale, height: STAGE_H * scale }}>
            <div
              ref={stageRef}
              style={{
                width: STAGE_W,
                height: STAGE_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <PodiumCanvas
                heading={heading}
                accent={accent}
                logoTheme={logoTheme}
                title={top.title}
                totalVotes={top.totalVotes}
                gold={gold}
                silver={silver}
                bronze={bronze}
              />
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11.5px] text-[color:var(--c-text-3)] text-center">
          Aperçu à l’échelle · export natif 1080 × 1920 px
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PodiumCanvas — rendu "natif" pour html2canvas                     */
/* ------------------------------------------------------------------ */

function PodiumCanvas({
  heading,
  accent,
  logoTheme,
  title,
  totalVotes,
  gold,
  silver,
  bronze,
}: {
  heading: string;
  accent: "red" | "mono" | "light";
  logoTheme: LogoTheme;
  title: string;
  totalVotes: number;
  gold?: PodiumSortie;
  silver?: PodiumSortie;
  bronze?: PodiumSortie;
}) {
  const isLight = accent === "light";
  const accentColor = accent === "mono" ? "#0A0A0A" : "#E52321";
  const bg = isLight ? "#F5F2EA" : "#0A0A0A";
  const textPrimary = isLight ? "#0A0A0A" : "#FFFFFF";
  const textDim = isLight ? "rgba(10,10,10,0.55)" : "rgba(255,255,255,0.55)";
  const cardBg = isLight ? "rgba(10,10,10,0.04)" : "rgba(255,255,255,0.04)";
  const rule = isLight ? "rgba(10,10,10,0.15)" : "rgba(255,255,255,0.12)";

  return (
    <div
      style={{
        width: STAGE_W,
        height: STAGE_H,
        background: bg,
        color: textPrimary,
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-capitana), 'Inter', sans-serif",
      }}
    >
      {/* halo rouge décoratif */}
      {accent !== "mono" && (
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -200,
            width: 820,
            height: 820,
            borderRadius: "9999px",
            background: `radial-gradient(closest-side, ${accentColor}55, transparent 70%)`,
            filter: "blur(12px)",
            pointerEvents: "none",
          }}
        />
      )}
      {/* grille subtile */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isLight ? 0.35 : 0.5,
          backgroundImage: `linear-gradient(to right, ${rule} 1px, transparent 1px), linear-gradient(to bottom, ${rule} 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ParallelTag color={accentColor} text={heading.toUpperCase()} light />
          <span
            style={{
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: textDim,
            }}
          >
            B&O’Z
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize: 130,
            lineHeight: 0.86,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: textPrimary,
          }}
        >
          Le podium
        </div>
        <div
          style={{
            fontSize: 26,
            color: textDim,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            marginTop: -10,
          }}
        >
          {truncate(title, 56)}
        </div>
      </div>

      {/* Podium — 3 colonnes bottom-alignées */}
      <div
        style={{
          position: "absolute",
          top: 430,
          left: 30,
          right: 30,
          bottom: 200,
          display: "grid",
          gridTemplateColumns: "280px 440px 260px",
          columnGap: 20,
          alignItems: "end",
          justifyContent: "center",
        }}
      >
        {silver && (
          <PodiumColumn
            rank={2}
            sortie={silver}
            total={totalVotes}
            pochetteSize={280}
            stepHeight={300}
            stepColor={textPrimary}
            stepTextColor={bg}
            titleSize={42}
            accentColor={accentColor}
            textPrimary={textPrimary}
            textDim={textDim}
            cardBg={cardBg}
          />
        )}
        {gold && (
          <PodiumColumn
            rank={1}
            sortie={gold}
            total={totalVotes}
            pochetteSize={440}
            stepHeight={480}
            stepColor={accentColor}
            stepTextColor="#FFFFFF"
            titleSize={66}
            highlighted
            accentColor={accentColor}
            textPrimary={textPrimary}
            textDim={textDim}
            cardBg={cardBg}
          />
        )}
        {bronze && (
          <PodiumColumn
            rank={3}
            sortie={bronze}
            total={totalVotes}
            pochetteSize={260}
            stepHeight={200}
            stepColor={cardBg}
            stepTextColor={textPrimary}
            borderStep={rule}
            titleSize={36}
            accentColor={accentColor}
            textPrimary={textPrimary}
            textDim={textDim}
            cardBg={cardBg}
          />
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 22,
          borderTop: `1px solid ${rule}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 20,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: textDim,
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
              fontSize: 58,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: textPrimary,
            }}
          >
            {totalVotes} votes
          </span>
        </div>
        {/* Logo B&O'Z — thème + couleur selon la palette */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl(logoTheme, isLight ? "black" : "light")}
          alt="B&O'Z"
          style={{
            width: 150,
            height: 150,
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PodiumColumn — une colonne du podium (meta + pochette + marche)   */
/* ------------------------------------------------------------------ */

function PodiumColumn({
  rank,
  sortie,
  total,
  pochetteSize,
  stepHeight,
  stepColor,
  stepTextColor,
  borderStep,
  titleSize,
  highlighted = false,
  accentColor,
  textPrimary,
  textDim,
  cardBg,
}: {
  rank: number;
  sortie: PodiumSortie;
  total: number;
  pochetteSize: number;
  stepHeight: number;
  stepColor: string;
  stepTextColor: string;
  borderStep?: string;
  titleSize: number;
  highlighted?: boolean;
  accentColor: string;
  textPrimary: string;
  textDim: string;
  cardBg: string;
}) {
  const pct = total > 0 ? Math.round((sortie.votes / total) * 100) : 0;
  const rankFontSize = rank === 1 ? 340 : rank === 2 ? 220 : 150;
  const artistMax = rank === 1 ? 24 : 20;
  const titleMax = rank === 1 ? 20 : 16;

  return (
    <div
      style={{
        width: pochetteSize,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {/* ----- META (artiste / titre / %) ----- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          textAlign: "center",
          paddingBottom: 18,
        }}
      >
        <span
          style={{
            fontSize: 16,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: textDim,
          }}
        >
          {truncate(sortie.artiste, artistMax)}
        </span>
        <span
          style={{
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize: titleSize,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: textPrimary,
          }}
        >
          {truncate(sortie.titre, titleMax)}
        </span>
        <span
          style={{
            marginTop: 6,
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize: rank === 1 ? 30 : 22,
            letterSpacing: "-0.01em",
            color: accentColor,
          }}
        >
          {pct}% · {sortie.votes} vote{sortie.votes > 1 ? "s" : ""}
        </span>
      </div>

      {/* ----- POCHETTE ----- */}
      <div
        style={{
          position: "relative",
          width: pochetteSize,
          height: pochetteSize,
          overflow: "hidden",
          background: cardBg,
          boxShadow: "0 20px 40px -20px rgba(0,0,0,0.35)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sortie.pochetteUrl}
          alt=""
          crossOrigin="anonymous"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* ----- MARCHE DU PODIUM ----- */}
      <div
        style={{
          position: "relative",
          width: pochetteSize,
          height: stepHeight,
          background: stepColor,
          border: borderStep ? `1px solid ${borderStep}` : undefined,
          borderTop: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize: rankFontSize,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: stepTextColor,
          }}
        >
          {rank}
        </span>
      </div>
    </div>
  );
}

/* Petit tag parallélogramme (eyebrow) */
function ParallelTag({
  color,
  text,
  light = false,
}: {
  color: string;
  text: string;
  light?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        padding: "14px 32px",
        background: color,
        color: light ? "#FFFFFF" : "#0A0A0A",
        transform: "skewX(-12deg)",
      }}
    >
      <span
        style={{
          transform: "skewX(12deg)",
          fontSize: 22,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
