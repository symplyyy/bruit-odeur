"use client";

import { useEffect, useRef, useState } from "react";
import { Card, MacButton, MacField, MacInput, Segmented } from "@/components/admin/mac/primitives";
import { Download, Link2 } from "lucide-react";
import { LOGO_THEMES, logoUrl, type LogoTheme } from "@/lib/logo-variants";
import { siteDisplay } from "@/lib/site";
import { exportStage } from "@/lib/story-export";

type Sortie = {
  id: string;
  artiste: string;
  titre: string;
};

type Props = {
  top: {
    id: string;
    title: string;
    weekNumber: number;
    year: number;
    closeAt: Date | string;
    sorties: Sortie[];
  };
};

const STAGE_W = 1080;
const STAGE_H = 1920;

export function TopVoteStudio({ top }: Props) {
  const [accent, setAccent] = useState<"red" | "mono" | "light">("red");
  const [logoTheme, setLogoTheme] = useState<LogoTheme>("default");
  const [heading, setHeading] = useState(`Top Semaine · S${top.weekNumber}`);
  const [headline, setHeadline] = useState("Vote");
  const [accentWord, setAccentWord] = useState("Maintenant !");
  const [voteUrl, setVoteUrl] = useState(siteDisplay("/top-semaine"));
  const [showArtists, setShowArtists] = useState<"on" | "off">("on");
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
      await exportStage(
        node,
        STAGE_W,
        STAGE_H,
        `story-vote-s${top.weekNumber}-${top.year}.png`,
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4 items-start">
      {/* Inspector */}
      <aside className="xl:sticky xl:top-[116px]">
        <Card>
          <div className="flex items-center h-9 px-3 border-b border-[color:var(--c-border)]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[color:var(--c-text-3)]">
              <Link2 size={13} strokeWidth={1.75} className="text-[color:var(--c-text-4)]" />
              Story vote
            </div>
          </div>
          <div className="p-4 space-y-5">
            <MacField label="Eyebrow">
              <MacInput
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Top Semaine · S42"
              />
            </MacField>
            <MacField label="Headline">
              <MacInput
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Vote"
              />
            </MacField>
            <MacField label="Accent">
              <MacInput
                value={accentWord}
                onChange={(e) => setAccentWord(e.target.value)}
                placeholder="Maintenant."
              />
            </MacField>
            <MacField label="Lien de vote">
              <MacInput
                value={voteUrl}
                onChange={(e) => setVoteUrl(e.target.value)}
                placeholder={siteDisplay("/top-semaine")}
              />
            </MacField>
            <MacField label="Artistes">
              <Segmented
                size="sm"
                value={showArtists}
                onChange={(v) => setShowArtists(v)}
                options={[
                  { value: "on", label: "Afficher" },
                  { value: "off", label: "Masquer" },
                ]}
              />
            </MacField>
            <MacField label="Palette">
              <Segmented
                size="sm"
                value={accent}
                onChange={(v) => setAccent(v)}
                options={[
                  { value: "red", label: "Rouge" },
                  { value: "mono", label: "Mono" },
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
                disabled={pending}
                icon={<Download size={13} strokeWidth={1.75} />}
              >
                {pending ? "Export…" : "Exporter PNG"}
              </MacButton>
            </div>
          </div>
        </Card>
      </aside>

      {/* Preview stage */}
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
              <VoteCanvas
                heading={heading}
                headline={headline}
                accentWord={accentWord}
                voteUrl={voteUrl}
                accent={accent}
                logoTheme={logoTheme}
                title={top.title}
                closeAt={new Date(top.closeAt)}
                sorties={top.sorties}
                showArtists={showArtists === "on"}
              />
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
/*  VoteCanvas — éditorial brutaliste, 100% typo, pas de pochette     */
/* ------------------------------------------------------------------ */

function VoteCanvas({
  heading,
  headline,
  accentWord,
  voteUrl,
  accent,
  logoTheme,
  title,
  closeAt,
  sorties,
  showArtists,
}: {
  heading: string;
  headline: string;
  accentWord: string;
  voteUrl: string;
  accent: "red" | "mono" | "light";
  logoTheme: LogoTheme;
  title: string;
  closeAt: Date;
  sorties: Sortie[];
  showArtists: boolean;
}) {
  const isLight = accent === "light";
  const isMono = accent === "mono";
  const bg = isLight ? "#F5F2EA" : "#0A0A0A";
  const textPrimary = isLight ? "#0A0A0A" : "#FFFFFF";
  const textDim = isLight ? "rgba(10,10,10,0.55)" : "rgba(255,255,255,0.55)";
  const rule = isLight ? "rgba(10,10,10,0.18)" : "rgba(255,255,255,0.16)";
  // Mono : on remplace le rouge par la couleur primaire opposée pour rester lisible.
  const accentColor = isMono ? textPrimary : "#E52321";
  // Eyebrow tag : en mono, fond clair sur sombre (ou inverse) avec texte contrasté.
  const tagTextColor = isMono ? bg : "#FFFFFF";

  const closeStr = formatCloseDate(closeAt);
  const count = sorties.length;
  const countStr = String(count).padStart(2, "0");

  // Liste artistes : 6 max, on tronque en mode "et 3 autres"
  const visibleArtists = sorties.slice(0, 6);
  const extra = Math.max(0, count - visibleArtists.length);

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
      {/* Halo accent */}
      {accent !== "mono" && (
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -180,
            width: 820,
            height: 820,
            borderRadius: "9999px",
            background: `radial-gradient(closest-side, ${accentColor}55, transparent 70%)`,
            filter: "blur(14px)",
            pointerEvents: "none",
          }}
        />
      )}
      {/* Grille subtile */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isLight ? 0.3 : 0.45,
          backgroundImage: `linear-gradient(to right, ${rule} 1px, transparent 1px), linear-gradient(to bottom, ${rule} 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 85%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Eyebrow header ── */}
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
        <ParallelTag color={accentColor} text={heading.toUpperCase()} textColor={tagTextColor} />
        <span
          style={{
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: textDim,
          }}
        >
          B&O&apos;Z
        </span>
      </div>

      {/* ── Hero typo ── */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
            fontSize: 260,
            lineHeight: 0.84,
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            color: textPrimary,
          }}
        >
          {headline}
        </div>
        {accentWord && (
          <div
            style={{
              fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
              fontSize: 130,
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: accentColor,
              marginTop: 12,
              wordBreak: "break-word",
            }}
          >
            {accentWord}
          </div>
        )}
      </div>

      {/* ── Strip info ── */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 32,
          alignItems: "end",
          paddingBottom: 24,
          borderBottom: `1px solid ${rule}`,
        }}
      >
        {/* Compteur sorties */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: textDim,
            }}
          >
            Sorties
          </span>
          <span
            style={{
              fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
              fontSize: 140,
              lineHeight: 0.86,
              letterSpacing: "-0.04em",
              color: textPrimary,
            }}
          >
            {countStr}
          </span>
        </div>

        {/* Titre + clôture */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingBottom: 22,
            paddingLeft: 20,
            borderLeft: `1px solid ${rule}`,
          }}
        >
          <span
            style={{
              fontSize: 22,
              lineHeight: 1.25,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: textPrimary,
            }}
          >
            {truncate(title, 70)}
          </span>
          <span
            style={{
              fontSize: 20,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: textDim,
            }}
          >
            Clôture · {closeStr}
          </span>
        </div>
      </div>

      {/* ── Liste artistes (typo only) ── */}
      {showArtists && visibleArtists.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 1340,
            left: 80,
            right: 80,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 16,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: textDim,
              marginBottom: 8,
            }}
          >
            En lice
          </span>
          {visibleArtists.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr",
                gap: 16,
                alignItems: "baseline",
                paddingBottom: 6,
                borderBottom:
                  i === visibleArtists.length - 1 ? "none" : `1px solid ${rule}`,
                paddingTop: i === 0 ? 0 : 6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
                  fontSize: 28,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: accentColor,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
                  fontSize: 30,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  color: textPrimary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {truncate(`${s.artiste} — ${s.titre}`, 42)}
              </span>
            </div>
          ))}
          {extra > 0 && (
            <span
              style={{
                marginTop: 10,
                fontSize: 18,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: textDim,
              }}
            >
              + {extra} autre{extra > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* ── CTA footer ── */}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontSize: 20,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: textDim,
            }}
          >
            Lien en bio ↗
          </span>
          <span
            style={{
              fontFamily: "var(--font-kabel), 'Archivo Black', sans-serif",
              fontSize: 50,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: accentColor,
            }}
          >
            {voteUrl || siteDisplay("/top-semaine")}
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl(logoTheme, isLight ? "black" : "light")}
          alt="B&O'Z"
          style={{ width: 130, height: 130, display: "block" }}
        />
      </div>
    </div>
  );
}

/* Tag parallélogramme (eyebrow) */
function ParallelTag({
  color,
  text,
  textColor,
}: {
  color: string;
  text: string;
  textColor: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        padding: "14px 32px",
        background: color,
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

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function formatCloseDate(d: Date): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
      .format(d)
      .replace(/\./g, "");
  } catch {
    return "";
  }
}
