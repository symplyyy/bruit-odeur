"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  MacButton,
  MacField,
  MacInput,
  Segmented,
} from "@/components/admin/mac/primitives";
import { Download, Sparkles } from "lucide-react";
import { logoUrl } from "@/lib/logo-variants";

type HotTakeData = {
  id: string;
  statement: string;
  backgroundUrl?: string | null;
  fire: number;
  froid: number;
  total: number;
  optionALabel?: string | null;
  optionBLabel?: string | null;
};

type Mode = "question" | "results";
type Palette = "red" | "mono" | "light";

const STAGE_W = 1080;
const STAGE_H = 1920;

const RED = "#E52321";
const BLUE = "#2088FF";

/* ------------------------------------------------------------------ */
/*  Palette helpers — alignés sur TopVoteStudio                       */
/* ------------------------------------------------------------------ */

type PaletteTokens = {
  bg: string;
  textPrimary: string;
  textDim: string;
  rule: string;
  accent: string; // eyebrow tag bg
  accentText: string; // eyebrow tag text
  chipAColor: string;
  chipBColor: string;
  chipAFilled: boolean; // false = outline
  chipBFilled: boolean;
  chipATextColor: string;
  chipBTextColor: string;
  haloRed: boolean;
  haloBlue: boolean;
  drawGrid: boolean;
};

function tokens(p: Palette): PaletteTokens {
  if (p === "light") {
    return {
      bg: "#F5F2EA",
      textPrimary: "#0A0A0A",
      textDim: "rgba(10,10,10,0.55)",
      rule: "rgba(10,10,10,0.18)",
      accent: RED,
      accentText: "#FFFFFF",
      chipAColor: RED,
      chipBColor: "#0A0A0A",
      chipAFilled: true,
      chipBFilled: true,
      chipATextColor: "#FFFFFF",
      chipBTextColor: "#FFFFFF",
      haloRed: true,
      haloBlue: false,
      drawGrid: true,
    };
  }
  if (p === "mono") {
    return {
      bg: "#0A0A0A",
      textPrimary: "#FFFFFF",
      textDim: "rgba(255,255,255,0.55)",
      rule: "rgba(255,255,255,0.18)",
      accent: "#FFFFFF",
      accentText: "#0A0A0A",
      chipAColor: "#FFFFFF",
      chipBColor: "#FFFFFF",
      chipAFilled: true, // plein blanc, texte noir
      chipBFilled: false, // contour blanc, texte blanc
      chipATextColor: "#0A0A0A",
      chipBTextColor: "#FFFFFF",
      haloRed: false,
      haloBlue: false,
      drawGrid: true,
    };
  }
  // red (default)
  return {
    bg: "#0A0A0A",
    textPrimary: "#FFFFFF",
    textDim: "rgba(255,255,255,0.55)",
    rule: "rgba(255,255,255,0.16)",
    accent: RED,
    accentText: "#FFFFFF",
    chipAColor: RED,
    chipBColor: BLUE,
    chipAFilled: true,
    chipBFilled: true,
    chipATextColor: "#FFFFFF",
    chipBTextColor: "#FFFFFF",
    haloRed: true,
    haloBlue: true,
    drawGrid: true,
  };
}

/* ------------------------------------------------------------------ */

export function HotTakeStoryStudio({ hot }: { hot: HotTakeData }) {
  const [mode, setMode] = useState<Mode>("question");
  const [palette, setPalette] = useState<Palette>("red");
  const [heading, setHeading] = useState("Hot Take");
  const [cta, setCta] = useState("À toi de voter");
  const [pending, setPending] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

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
      const html2canvas = (await import("html2canvas")).default;
      const prev = node.style.transform;
      node.style.transform = "scale(1)";
      const canvas = await html2canvas(node, {
        backgroundColor: null,
        useCORS: true,
        scale: 1,
        width: STAGE_W,
        height: STAGE_H,
        windowWidth: STAGE_W,
        windowHeight: STAGE_H,
      });
      const a = document.createElement("a");
      const slug = mode === "question" ? "question" : "resultats";
      a.download = `hot-take-${slug}-${hot.id.slice(0, 6)}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      node.style.transform = prev;
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4 items-start">
      {/* ---------- Inspector ---------- */}
      <aside className="xl:sticky xl:top-[116px]">
        <Card>
          <div className="flex items-center h-9 px-3 border-b border-[color:var(--c-border)]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[color:var(--c-text-3)]">
              <Sparkles
                size={13}
                strokeWidth={1.75}
                className="text-[color:var(--c-text-4)]"
              />
              Story Hot Take
            </div>
          </div>
          <div className="p-4 space-y-5">
            <MacField label="Type de story">
              <Segmented
                size="sm"
                value={mode}
                onChange={(v) => setMode(v)}
                options={[
                  { value: "question", label: "Question" },
                  { value: "results", label: "Résultats" },
                ]}
              />
            </MacField>
            <MacField label="Eyebrow (en haut)">
              <MacInput
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Hot Take"
              />
            </MacField>
            {mode === "question" && (
              <MacField label="Call-to-action (en bas)">
                <MacInput
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="À toi de voter"
                />
              </MacField>
            )}
            <MacField label="Palette">
              <Segmented
                size="sm"
                value={palette}
                onChange={(v) => setPalette(v)}
                options={[
                  { value: "red", label: "Rouge" },
                  { value: "mono", label: "Mono" },
                  { value: "light", label: "Clair" },
                ]}
              />
            </MacField>
            <div className="pt-2 border-t border-[color:var(--c-border)]">
              <MacButton
                variant="primary"
                onClick={onExport}
                disabled={pending}
                icon={<Download size={13} strokeWidth={1.75} />}
              >
                {pending ? "Export…" : "Exporter PNG"}
              </MacButton>
              {mode === "results" && hot.total === 0 && (
                <p className="mt-2 text-[11px] text-[color:var(--c-text-3)]">
                  Aucun vote pour le moment — le résultat affichera 50/50.
                </p>
              )}
            </div>
          </div>
        </Card>
      </aside>

      {/* ---------- Stage ---------- */}
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
              {mode === "question" ? (
                <QuestionCanvas
                  heading={heading}
                  cta={cta}
                  palette={palette}
                  statement={hot.statement}
                  backgroundUrl={hot.backgroundUrl}
                  optionALabel={hot.optionALabel ?? null}
                  optionBLabel={hot.optionBLabel ?? null}
                />
              ) : (
                <ResultsCanvas
                  heading={heading}
                  palette={palette}
                  statement={hot.statement}
                  fire={hot.fire}
                  froid={hot.froid}
                  total={hot.total}
                  optionALabel={hot.optionALabel ?? null}
                  optionBLabel={hot.optionBLabel ?? null}
                />
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11.5px] text-[color:var(--c-text-3)] text-center">
          Aperçu à l&apos;échelle · export natif 1080 × 1920 px
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                      Decorative layers                              */
/* ------------------------------------------------------------------ */

function Halos({ t }: { t: PaletteTokens }) {
  return (
    <>
      {t.haloRed && (
        <div
          style={{
            position: "absolute",
            top: -240,
            left: -180,
            width: 720,
            height: 720,
            borderRadius: "9999px",
            background:
              "radial-gradient(closest-side, rgba(229,35,33,0.45), transparent 70%)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />
      )}
      {t.haloBlue && (
        <div
          style={{
            position: "absolute",
            bottom: -280,
            right: -220,
            width: 820,
            height: 820,
            borderRadius: "9999px",
            background:
              "radial-gradient(closest-side, rgba(32,136,255,0.38), transparent 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}

function Grid({ t }: { t: PaletteTokens }) {
  if (!t.drawGrid) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: t.bg === "#F5F2EA" ? 0.3 : 0.45,
        backgroundImage: `linear-gradient(to right, ${t.rule} 1px, transparent 1px), linear-gradient(to bottom, ${t.rule} 1px, transparent 1px)`,
        backgroundSize: "120px 120px",
        maskImage:
          "radial-gradient(ellipse at center, black 35%, transparent 85%)",
        pointerEvents: "none",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*                      QUESTION canvas                                */
/* ------------------------------------------------------------------ */

function QuestionCanvas({
  heading,
  cta,
  palette,
  statement,
  backgroundUrl,
  optionALabel,
  optionBLabel,
}: {
  heading: string;
  cta: string;
  palette: Palette;
  statement: string;
  backgroundUrl?: string | null;
  optionALabel?: string | null;
  optionBLabel?: string | null;
}) {
  const t = tokens(palette);
  const isLight = palette === "light";
  const isVersus = !!(optionALabel && optionBLabel);
  const labelA = (optionALabel ?? "Chaud").toUpperCase();
  const labelB = (optionBLabel ?? "Froid").toUpperCase();
  const subA = isVersus ? "Option A" : "D'accord";
  const subB = isVersus ? "Option B" : "Pas d'accord";
  const upper = statement.toUpperCase();
  const length = upper.length;
  const fontSize =
    length < 28 ? 220 : length < 50 ? 170 : length < 80 ? 140 : length < 120 ? 110 : 88;

  return (
    <div
      style={{
        width: STAGE_W,
        height: STAGE_H,
        background: t.bg,
        color: t.textPrimary,
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-capitana), 'Inter', sans-serif",
      }}
    >
      {/* backdrop image optionnel */}
      {backgroundUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isLight ? 0.12 : 0.18,
              mixBlendMode: isLight ? "multiply" : "overlay",
              filter: "saturate(0.9)",
            }}
          />
        </>
      )}

      <Grid t={t} />
      <Halos t={t} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 80,
          right: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ParallelTag bg={t.accent} textColor={t.accentText} text={heading.toUpperCase()} />
        <span
          style={{
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: t.textDim,
          }}
        >
          B&O&apos;Z
        </span>
      </div>

      {/* Guillemet décoratif supérieur */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
          fontSize: 380,
          lineHeight: 0.7,
          color: palette === "mono" ? "rgba(255,255,255,0.18)" : isLight ? "rgba(229,35,33,0.35)" : "rgba(229,35,33,0.35)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        «
      </div>

      {/* Statement géant */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 80,
          right: 80,
          bottom: 500,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize,
            lineHeight: 0.88,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: t.textPrimary,
          }}
        >
          {upper}
        </div>
      </div>

      {/* Guillemet décoratif inférieur */}
      <div
        style={{
          position: "absolute",
          bottom: 460,
          right: 60,
          fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
          fontSize: 380,
          lineHeight: 0.3,
          color: palette === "mono" ? "rgba(255,255,255,0.18)" : palette === "red" ? "rgba(32,136,255,0.35)" : "rgba(10,10,10,0.18)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        »
      </div>

      {/* Choix */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 260,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 30,
        }}
      >
        <ChoiceChip
          label={labelA}
          sublabel={subA}
          color={t.chipAColor}
          textColor={t.chipATextColor}
          filled={t.chipAFilled}
          dimColor={t.textDim}
        />
        <span
          style={{
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize: 70,
            color: t.textDim,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          VS
        </span>
        <ChoiceChip
          label={labelB}
          sublabel={subB}
          color={t.chipBColor}
          textColor={t.chipBTextColor}
          filled={t.chipBFilled}
          dimColor={t.textDim}
          align="right"
        />
      </div>

      {/* Footer CTA */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 26,
          borderTop: `1px solid ${t.rule}`,
        }}
      >
        <span
          style={{
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: t.textDim,
          }}
        >
          {cta}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl("default", isLight ? "black" : "light")}
          alt="B&O'Z"
          style={{ width: 130, height: 130, display: "block" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                      RESULTS canvas                                 */
/* ------------------------------------------------------------------ */

function ResultsCanvas({
  heading,
  palette,
  statement,
  fire,
  froid,
  total,
  optionALabel,
  optionBLabel,
}: {
  heading: string;
  palette: Palette;
  statement: string;
  fire: number;
  froid: number;
  total: number;
  optionALabel?: string | null;
  optionBLabel?: string | null;
}) {
  const t = tokens(palette);
  const isLight = palette === "light";
  const isVersus = !!(optionALabel && optionBLabel);
  const labelA = (optionALabel ?? "Chaud").toUpperCase();
  const labelB = (optionBLabel ?? "Froid").toUpperCase();
  const subA = isVersus ? "Option A" : "D'accord";
  const subB = isVersus ? "Option B" : "Pas d'accord";
  const firePct = total > 0 ? Math.round((fire / total) * 100) : 50;
  const froidPct = 100 - firePct;
  const winner: "FIRE" | "FROID" | null =
    total === 0 ? null : firePct === froidPct ? null : firePct > froidPct ? "FIRE" : "FROID";

  const upper = statement.toUpperCase();
  const length = upper.length;
  const statementSize =
    length < 40 ? 88 : length < 80 ? 72 : length < 120 ? 60 : 50;

  // Couleurs des stats : en mono, on distingue par emphase plutôt que par teinte
  const statColorA = t.chipAColor;
  const statColorB = palette === "mono" ? t.textPrimary : t.chipBColor;

  return (
    <div
      style={{
        width: STAGE_W,
        height: STAGE_H,
        background: t.bg,
        color: t.textPrimary,
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-capitana), 'Inter', sans-serif",
      }}
    >
      <Grid t={t} />
      <Halos t={t} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 80,
          right: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ParallelTag
          bg={t.accent}
          textColor={t.accentText}
          text={`${heading.toUpperCase()} · RÉSULTATS`}
        />
        <span
          style={{
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: t.textDim,
          }}
        >
          B&O&apos;Z
        </span>
      </div>

      {/* Statement rappel */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 80,
          right: 80,
          height: 280,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize: statementSize,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: t.textPrimary,
          }}
        >
          « {upper} »
        </div>
      </div>

      {/* Split */}
      <div
        style={{
          position: "absolute",
          top: 580,
          left: 80,
          right: 80,
          height: 820,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: `1px solid ${t.rule}`,
        }}
      >
        <SideStat
          label={labelA}
          sublabel={subA}
          pct={firePct}
          votes={fire}
          color={statColorA}
          isWinner={winner === "FIRE"}
          align="left"
          tokens={t}
        />
        <SideStat
          label={labelB}
          sublabel={subB}
          pct={froidPct}
          votes={froid}
          color={statColorB}
          isWinner={winner === "FROID"}
          align="right"
          tokens={t}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 14,
            background: isLight ? "rgba(10,10,10,0.06)" : "rgba(255,255,255,0.06)",
            display: "flex",
          }}
        >
          <div style={{ width: `${firePct}%`, height: "100%", background: statColorA }} />
          <div style={{ width: `${froidPct}%`, height: "100%", background: statColorB }} />
        </div>
      </div>

      {/* Bandeau gagnant */}
      {winner && (
        <div
          style={{
            position: "absolute",
            top: 1430,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <ParallelTag
            bg={winner === "FIRE" ? statColorA : statColorB}
            textColor={
              palette === "mono" && winner === "FROID"
                ? "#0A0A0A" // contour blanc devient plein blanc, texte noir
                : winner === "FIRE"
                  ? t.chipATextColor
                  : t.chipBTextColor
            }
            text={`MAJORITÉ ${winner === "FIRE" ? labelA : labelB}`}
          />
          <span
            style={{
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: t.textDim,
            }}
          >
            {isVersus
              ? "Le public a tranché"
              : winner === "FIRE"
                ? "La foule a dit oui"
                : "La foule a dit non"}
          </span>
        </div>
      )}
      {!winner && total > 0 && (
        <div
          style={{
            position: "absolute",
            top: 1430,
            left: 80,
            right: 80,
          }}
        >
          <ParallelTag
            bg={isLight ? "#0A0A0A" : "#FFFFFF"}
            textColor={isLight ? "#FFFFFF" : "#0A0A0A"}
            text="ÉGALITÉ PARFAITE"
          />
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 26,
          borderTop: `1px solid ${t.rule}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 20,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: t.textDim,
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
              fontSize: 70,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: t.textPrimary,
            }}
          >
            {total} vote{total > 1 ? "s" : ""}
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl("default", isLight ? "black" : "light")}
          alt="B&O'Z"
          style={{ width: 150, height: 150, display: "block" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                         Sub-components                              */
/* ------------------------------------------------------------------ */

function ChoiceChip({
  label,
  sublabel,
  color,
  textColor,
  filled,
  dimColor,
  align = "left",
}: {
  label: string;
  sublabel: string;
  color: string;
  textColor: string;
  filled: boolean;
  dimColor: string;
  align?: "left" | "right";
}) {
  const fontSize =
    label.length <= 5
      ? 76
      : label.length <= 9
        ? 62
        : label.length <= 14
          ? 48
          : 36;
  const pad = label.length <= 9 ? "28px 48px" : "22px 36px";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "right" ? "flex-end" : "flex-start",
        gap: 12,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: pad,
          background: filled ? color : "transparent",
          border: filled ? "none" : `3px solid ${color}`,
          color: textColor,
          transform: "skewX(-12deg)",
          boxShadow: filled ? "0 20px 40px -18px rgba(0,0,0,0.45)" : "none",
          maxWidth: 420,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            transform: "skewX(12deg)",
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            color: textColor,
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontSize: 22,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: dimColor,
        }}
      >
        {sublabel}
      </span>
    </div>
  );
}

function SideStat({
  label,
  sublabel,
  pct,
  votes,
  color,
  isWinner,
  align,
  tokens: t,
}: {
  label: string;
  sublabel: string;
  pct: number;
  votes: number;
  color: string;
  isWinner: boolean;
  align: "left" | "right";
  tokens: PaletteTokens;
}) {
  return (
    <div
      style={{
        position: "relative",
        padding: "60px 50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 20,
        background: isWinner ? `${color}14` : "transparent",
        borderRight:
          align === "left" ? `1px solid ${t.rule}` : undefined,
        alignItems: align === "right" ? "flex-end" : "flex-start",
        textAlign: align === "right" ? "right" : "left",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: t.textDim,
          }}
        >
          {sublabel}
        </span>
        <span
          style={{
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize:
              label.length <= 6
                ? 96
                : label.length <= 10
                  ? 72
                  : label.length <= 14
                    ? 56
                    : 44,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: color,
            wordBreak: "break-word",
          }}
        >
          {label}
        </span>
      </div>

      <div
        style={{
          fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
          fontSize: 240,
          lineHeight: 0.82,
          letterSpacing: "-0.04em",
          color: color,
        }}
      >
        {pct}
        <span style={{ fontSize: 90, marginLeft: 6, verticalAlign: "baseline" }}>
          %
        </span>
      </div>

      <span
        style={{
          fontSize: 22,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: t.textDim,
        }}
      >
        {votes} vote{votes > 1 ? "s" : ""}
      </span>
    </div>
  );
}

/* Parallélogramme (eyebrow) — bg + couleur de texte explicites */
function ParallelTag({
  bg,
  textColor,
  text,
}: {
  bg: string;
  textColor: string;
  text: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        padding: "14px 32px",
        background: bg,
        color: textColor,
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
