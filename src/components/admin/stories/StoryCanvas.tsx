"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { StoryPayload } from "@/lib/actions/stories";

const REF_W = 1080;
const REF_H_STORY = 1920;
const REF_H_POST = 1380; // Post portrait IG 4:5
const REF_H_POST_TEXT = 1380; // Slide 2 du post, même ratio que le post

export type ElementKey =
  | "logo"
  | "tag"
  | "title"
  | "genre"
  | "paragraph1"
  | "paragraph2"
  | "accent";
type TextElementKey =
  | "tag"
  | "title"
  | "genre"
  | "paragraph1"
  | "paragraph2";

type Transform = {
  x: number;
  y: number;
  rotation: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
};
type DragMode =
  | "move"
  | "scaleXLeft"
  | "scaleXRight"
  | "scaleYTop"
  | "scaleYBottom"
  | "scaleBoth"
  | "rotate";
const CENTER_SNAP_THRESHOLD = 0.03;
const ROTATION_SNAP_STEP = 90;
const SCALE_BASE_SNAP_THRESHOLD = 0.08;
const ROTATE_CURSOR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232088FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M3 12a9 9 0 1 0 3-6.7'/><polyline points='3 4 3 9 8 9'/></svg>") 12 12, grab`;

// Valeurs par défaut si les transforms d'un élément manquent (ex. anciens templates).
/** Trait sous le §2 : proche du texte (réglé par défaut ; toujours éditable à part). */
const DEFAULT_TRANSFORM_BY_KEY: Record<ElementKey, Transform> = {
  logo: { x: 0.5, y: 0.93, scaleX: 1, scaleY: 1, rotation: 0 },
  tag: { x: 0.5, y: 0.5, scaleX: 1, scaleY: 1, rotation: 0 },
  title: { x: 0.5, y: 0.6, scaleX: 1, scaleY: 1, rotation: 0 },
  genre: { x: 0.5, y: 0.75, scaleX: 1, scaleY: 1, rotation: 0 },
  paragraph1: { x: 0.5, y: 0.26, scaleX: 1, scaleY: 1, rotation: 0 },
  paragraph2: { x: 0.5, y: 0.515, scaleX: 1, scaleY: 1, rotation: 0 },
  accent: { x: 0.139, y: 0.618, scaleX: 1, scaleY: 1, rotation: 0 },
};

function scaleXOf(t: Transform): number {
  return t.scaleX ?? t.scale ?? 1;
}

function scaleYOf(t: Transform): number {
  return t.scaleY ?? t.scale ?? 1;
}

function getTransform(payload: StoryPayload, key: ElementKey): Transform {
  const t = (payload.transforms as Partial<Record<ElementKey, Transform>>)[key];
  return t ?? DEFAULT_TRANSFORM_BY_KEY[key];
}

type Props = {
  payload: StoryPayload;
  editable?: boolean;
  selected?: ElementKey | null;
  onSelect?: (key: ElementKey | null) => void;
  onTransformStart?: () => void;
  onTransformChange?: (key: ElementKey, next: Transform) => void;
  onTextChange?: (key: TextElementKey, value: string) => void;
};

export const StoryCanvas = forwardRef<HTMLDivElement, Props>(function StoryCanvas(
  {
    payload,
    editable = false,
    selected,
    onSelect,
    onTransformStart,
    onTransformChange,
    onTextChange,
  },
  ref,
) {
  const isPostText = payload.format === "post-text";
  const refH =
    payload.format === "story"
      ? REF_H_STORY
      : isPostText
        ? REF_H_POST_TEXT
        : REF_H_POST;
  const isPost = payload.format === "post";
  const [editingKey, setEditingKey] = useState<TextElementKey | null>(null);
  const [draftText, setDraftText] = useState("");
  const [guideX, setGuideX] = useState(false);
  const [guideY, setGuideY] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(REF_W);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      setStageW(wrapRef.current?.clientWidth ?? REF_W);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const scale = stageW / REF_W;
  const bgColor =
    (payload as { backgroundColor?: string }).backgroundColor ?? "transparent";

  // Drag state -----------------------------------------------------------
  const dragRef = useRef<{
    key: ElementKey;
    mode: DragMode;
    start: Transform;
    pointer0: { x: number; y: number };
    center: { x: number; y: number }; // in wrapper-local px
    size0: { width: number; height: number };
    axisLock: "x" | "y" | null;
    dist0?: number;
    angle0?: number;
  } | null>(null);

  const beginDrag = useCallback(
    (
      key: ElementKey,
      mode: DragMode,
      e: React.PointerEvent<HTMLDivElement>,
      elRect: DOMRect,
    ) => {
      e.stopPropagation();
      e.preventDefault();
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wrapRect = wrap.getBoundingClientRect();
      const center = {
        x: elRect.left + elRect.width / 2 - wrapRect.left,
        y: elRect.top + elRect.height / 2 - wrapRect.top,
      };
      const pointer0 = {
        x: e.clientX - wrapRect.left,
        y: e.clientY - wrapRect.top,
      };
      const dx = pointer0.x - center.x;
      const dy = pointer0.y - center.y;
      const startT = getTransform(payload, key);
      dragRef.current = {
        key,
        mode,
        start: {
          ...startT,
          scaleX: scaleXOf(startT),
          scaleY: scaleYOf(startT),
        },
        pointer0,
        center,
        size0: { width: elRect.width, height: elRect.height },
        axisLock: null,
        dist0: Math.hypot(dx, dy) || 1,
        angle0: Math.atan2(dy, dx),
      };
      onSelect?.(key);
      onTransformStart?.();
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    },
    [payload.transforms, onSelect, onTransformStart],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      const wrap = wrapRef.current;
      if (!d || !wrap) return;
      const wrapRect = wrap.getBoundingClientRect();
      const px = e.clientX - wrapRect.left;
      const py = e.clientY - wrapRect.top;

      if (d.mode === "move") {
        const rawDx = px - d.pointer0.x;
        const rawDy = py - d.pointer0.y;
        let moveDx = rawDx;
        let moveDy = rawDy;
        if (e.shiftKey) {
          if (!d.axisLock) {
            d.axisLock = Math.abs(rawDx) >= Math.abs(rawDy) ? "x" : "y";
          }
          if (d.axisLock === "x") moveDy = 0;
          if (d.axisLock === "y") moveDx = 0;
        } else {
          d.axisLock = null;
        }
        let nextX = d.start.x + moveDx / wrapRect.width;
        let nextY = d.start.y + moveDy / wrapRect.height;
        let snapX = false;
        let snapY = false;
        if (e.shiftKey) {
          if (Math.abs(nextX - 0.5) <= CENTER_SNAP_THRESHOLD) {
            nextX = 0.5;
            snapX = true;
          }
          if (Math.abs(nextY - 0.5) <= CENTER_SNAP_THRESHOLD) {
            nextY = 0.5;
            snapY = true;
          }
        }
        // Pixel-grid stabilization: avoids text looking stretched/compressed on sub-pixel moves.
        nextX = snapToStep(nextX, 1 / REF_W);
        nextY = snapToStep(nextY, 1 / refH);
        setGuideX(snapX);
        setGuideY(snapY);
        const current = getTransform(payload, d.key);
        onTransformChange?.(d.key, {
          ...current,
          scaleX: scaleXOf(current),
          scaleY: scaleYOf(current),
          x: clamp(nextX, -0.1, 1.1),
          y: clamp(nextY, -0.1, 1.1),
        });
      } else if (d.mode === "scaleXLeft" || d.mode === "scaleXRight") {
        const dragDx = px - d.pointer0.x;
        const signed = d.mode === "scaleXRight" ? dragDx : -dragDx;
        const ratio = 1 + signed / Math.max(1, d.size0.width);
        let nextScaleX = clamp((d.start.scaleX ?? 1) * ratio, 0.15, 4);
        if (e.shiftKey && Math.abs(nextScaleX - 1) <= SCALE_BASE_SNAP_THRESHOLD) {
          nextScaleX = 1;
        }
        const nextCenterX = d.start.x + dragDx / (2 * wrapRect.width);
        onTransformChange?.(d.key, {
          ...d.start,
          x: clamp(nextCenterX, -0.1, 1.1),
          scaleX: nextScaleX,
        });
      } else if (d.mode === "scaleYTop" || d.mode === "scaleYBottom") {
        const dragDy = py - d.pointer0.y;
        const signed = d.mode === "scaleYBottom" ? dragDy : -dragDy;
        const ratio = 1 + signed / Math.max(1, d.size0.height);
        let nextScaleY = clamp((d.start.scaleY ?? 1) * ratio, 0.15, 4);
        if (e.shiftKey && Math.abs(nextScaleY - 1) <= SCALE_BASE_SNAP_THRESHOLD) {
          nextScaleY = 1;
        }
        const nextCenterY = d.start.y + dragDy / (2 * wrapRect.height);
        onTransformChange?.(d.key, {
          ...d.start,
          y: clamp(nextCenterY, -0.1, 1.1),
          scaleY: nextScaleY,
        });
      } else if (d.mode === "scaleBoth") {
        const dist = Math.hypot(px - d.center.x, py - d.center.y);
        const ratio = dist / (d.dist0 ?? 1);
        let nextScaleX = clamp((d.start.scaleX ?? 1) * ratio, 0.15, 4);
        let nextScaleY = clamp((d.start.scaleY ?? 1) * ratio, 0.15, 4);
        if (e.shiftKey) {
          if (Math.abs(nextScaleX - 1) <= SCALE_BASE_SNAP_THRESHOLD) nextScaleX = 1;
          if (Math.abs(nextScaleY - 1) <= SCALE_BASE_SNAP_THRESHOLD) nextScaleY = 1;
        }
        onTransformChange?.(d.key, {
          ...d.start,
          scaleX: nextScaleX,
          scaleY: nextScaleY,
        });
      } else if (d.mode === "rotate") {
        const a = Math.atan2(py - d.center.y, px - d.center.x);
        const deltaDeg = ((a - (d.angle0 ?? 0)) * 180) / Math.PI;
        let nextRotation = normalizeDeg(d.start.rotation + deltaDeg);
        if (e.shiftKey) {
          nextRotation = Math.round(nextRotation / ROTATION_SNAP_STEP) * ROTATION_SNAP_STEP;
        }
        onTransformChange?.(d.key, {
          ...d.start,
          rotation: normalizeDeg(nextRotation),
        });
      }
    },
    [onTransformChange, payload.transforms],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setGuideX(false);
    setGuideY(false);
    dragRef.current = null;
  }, []);

  const txt = payload.textColor === "white" ? "#FFFFFF" : "#141110";
  const titleParts = splitAccent(payload.title, payload.accent);
  const titleAlign = payload.titleAlign ?? "center";

  const wedgePoints =
    payload.triangleDir === "right" ? "0,100 100,0 100,100" : "0,0 100,100 0,100";

  const beginInlineEdit = useCallback(
    (key: TextElementKey, value: string) => {
      if (!editable) return;
      setEditingKey(key);
      setDraftText(value);
      // Les paragraphes post-text ne font pas partie des ElementKey draggables.
      if (key === "tag" || key === "title" || key === "genre") {
        onSelect?.(key);
      } else {
        onSelect?.(null);
      }
    },
    [editable, onSelect],
  );

  const commitInlineEdit = useCallback(() => {
    if (!editingKey) return;
    onTextChange?.(editingKey, draftText);
    setEditingKey(null);
  }, [draftText, editingKey, onTextChange]);

  const cancelInlineEdit = useCallback(() => {
    setEditingKey(null);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none"
      style={{ aspectRatio: `${REF_W} / ${refH}`, touchAction: "none" }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerDown={() => {
        if (editable) onSelect?.(null);
      }}
    >
      {guideX && <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-brand-red/70 pointer-events-none" />}
      {guideY && <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-brand-red/70 pointer-events-none" />}
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        className="absolute top-0 left-0 origin-top-left overflow-hidden"
        style={{
          width: REF_W,
          height: refH,
          transform: `scale(${scale})`,
          background: bgColor,
        }}
      >
        {payload.backgroundUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={payload.backgroundUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={(() => {
              const fit = (payload as { backgroundFit?: { tx: number; ty: number; scale: number } }).backgroundFit;
              if (!fit) return undefined;
              return {
                transform: `translate(${fit.tx}%, ${fit.ty}%) scale(${fit.scale})`,
                transformOrigin: "center center",
              };
            })()}
          />
        ) : null}

        {payload.darkGradient && !isPostText && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0) 58%)",
            }}
          />
        )}

        {isPostText && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.58)" }}
          />
        )}

        {isPostText && (() => {
          const paragraph1 = (payload as { paragraph1?: string }).paragraph1 ?? "";
          const paragraph2 = (payload as { paragraph2?: string }).paragraph2 ?? "";

          const paraStyle = (sx: number, sy: number): React.CSSProperties => ({
            color: txt,
            fontFamily: "var(--font-kabel), 'Arial Black', sans-serif",
            textTransform: "uppercase",
            fontSize: 48 * sy,
            lineHeight: 1.1,
            letterSpacing: "0.005em",
            fontWeight: 700,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            width: Math.max(180, (REF_W - 160) * sx),
            margin: 0,
            padding: 0,
          });

          return (
            <>
              {/* Paragraphe 1 */}
              <ElementBox
                elementKey="paragraph1"
                payload={payload}
                editable={editable}
                selected={selected === "paragraph1"}
                onBeginDrag={beginDrag}
                isEditing={editingKey === "paragraph1"}
                onDoubleClick={() => beginInlineEdit("paragraph1", paragraph1)}
                disableScaleTransform
              >
                {(() => {
                  const tP = getTransform(payload, "paragraph1");
                  const sx = scaleXOf(tP);
                  const sy = scaleYOf(tP);
                  const style = paraStyle(sx, sy);
                  return editingKey === "paragraph1" ? (
                    <textarea
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      onBlur={commitInlineEdit}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter")
                          commitInlineEdit();
                        if (e.key === "Escape") cancelInlineEdit();
                      }}
                      autoFocus
                      rows={6}
                      className="bg-transparent border-none outline-none resize-none"
                      style={style}
                    />
                  ) : (
                    <div style={style}>{renderInlineBold(paragraph1)}</div>
                  );
                })()}
              </ElementBox>

              {/* Paragraphe 2 */}
              <ElementBox
                elementKey="paragraph2"
                payload={payload}
                editable={editable}
                selected={selected === "paragraph2"}
                onBeginDrag={beginDrag}
                isEditing={editingKey === "paragraph2"}
                onDoubleClick={() => beginInlineEdit("paragraph2", paragraph2)}
                disableScaleTransform
              >
                {(() => {
                  const tP = getTransform(payload, "paragraph2");
                  const sx = scaleXOf(tP);
                  const sy = scaleYOf(tP);
                  const style = paraStyle(sx, sy);
                  return editingKey === "paragraph2" ? (
                    <textarea
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      onBlur={commitInlineEdit}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter")
                          commitInlineEdit();
                        if (e.key === "Escape") cancelInlineEdit();
                      }}
                      autoFocus
                      rows={5}
                      className="bg-transparent border-none outline-none resize-none"
                      style={style}
                    />
                  ) : (
                    <div style={style}>{renderInlineBold(paragraph2)}</div>
                  );
                })()}
              </ElementBox>

              {/* Soulignage thématique : bloc séparé (déplaçable / scalable comme le post classique) */}
              <ElementBox
                elementKey="accent"
                payload={payload}
                editable={editable}
                selected={selected === "accent"}
                onBeginDrag={beginDrag}
              >
                <div
                  style={{
                    width: 140,
                    height: 8,
                    background: payload.genreColor,
                  }}
                />
              </ElementBox>

              {/* Logo (draggable comme pour un post classique) */}
              <ElementBox
                elementKey="logo"
                payload={payload}
                editable={editable}
                selected={selected === "logo"}
                onBeginDrag={beginDrag}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logo/${payload.logoTheme ?? "default"}-${payload.logoVariant === "light" ? "light" : "black"}.svg`}
                  alt="B&O'Z"
                  crossOrigin="anonymous"
                  style={{ width: 86, height: "auto", display: "block" }}
                  draggable={false}
                />
              </ElementBox>
            </>
          );
        })()}

        {!isPostText && (
          <svg
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            width={REF_W}
            height={refH * payload.triangleHeight}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ display: "block" }}
          >
            <polygon points={wedgePoints} fill={payload.genreColor} />
          </svg>
        )}

        {!isPostText && (
          <ElementBox
            elementKey="logo"
            payload={payload}
            editable={editable}
            selected={selected === "logo"}
            onBeginDrag={beginDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logo/${payload.logoTheme ?? "default"}-${payload.logoVariant === "light" ? "light" : "black"}.svg`}
              alt="B&O'Z"
              crossOrigin="anonymous"
              style={{ width: 140, height: "auto", display: "block" }}
              draggable={false}
            />
          </ElementBox>
        )}

        {!isPostText && payload.tag && (
          <ElementBox
            elementKey="tag"
            payload={payload}
            editable={editable}
            selected={selected === "tag"}
            onBeginDrag={beginDrag}
            isEditing={editingKey === "tag"}
            onDoubleClick={() => beginInlineEdit("tag", payload.tag)}
            disableScaleTransform
          >
            {(() => {
              const t = payload.transforms.tag;
              const tx = scaleXOf(t);
              const ty = scaleYOf(t);
              const tagFontFamily =
                payload.tagFont === "capitana"
                  ? "var(--font-capitana), serif"
                  : "var(--font-kabel), sans-serif";
              const tagTrackBase = payload.tagTracking ?? 0.2;
              return editingKey === "tag" ? (
                <div
                  style={{
                    background: payload.genreColor,
                    color: "#FFFFFF",
                    padding: `${14 * ty}px ${28 * tx}px`,
                    fontSize: 32 * ty,
                    letterSpacing: `${tagTrackBase * tx}em`,
                    textTransform: "uppercase",
                    fontWeight: 900,
                    fontFamily: tagFontFamily,
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  }}
                >
                  <input
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    onBlur={commitInlineEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitInlineEdit();
                      if (e.key === "Escape") cancelInlineEdit();
                    }}
                    autoFocus
                    className="bg-transparent border-none outline-none text-inherit"
                    style={{
                      display: "inline-block",
                      minWidth: 180,
                      fontSize: 32 * ty,
                      letterSpacing: `${tagTrackBase * tx}em`,
                      textTransform: "uppercase",
                      fontWeight: 900,
                      fontFamily: tagFontFamily,
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    background: payload.genreColor,
                    color: "#FFFFFF",
                    padding: `${14 * ty}px ${28 * tx}px`,
                    fontSize: 32 * ty,
                    letterSpacing: `${tagTrackBase * tx}em`,
                    textTransform: "uppercase",
                    fontWeight: 900,
                    fontFamily: tagFontFamily,
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  }}
                >
                  <span style={{ display: "inline-block" }}>
                    {payload.tag}
                  </span>
                </div>
              );
            })()}
          </ElementBox>
        )}

        {!isPostText && payload.title && (
          <ElementBox
            elementKey="title"
            payload={payload}
            editable={editable}
            selected={selected === "title"}
            onBeginDrag={beginDrag}
            isEditing={editingKey === "title"}
            onDoubleClick={() => beginInlineEdit("title", payload.title)}
            disableScaleTransform
          >
            {(() => {
              const t = payload.transforms.title;
              const tx = scaleXOf(t);
              const ty = scaleYOf(t);
              const titleWidth = Math.max(180, (isPost ? REF_W - 220 : REF_W - 120) * tx);
              const titleFontFamily =
                payload.titleFont === "capitana"
                  ? "var(--font-capitana), serif"
                  : "var(--font-kabel), sans-serif";
              const titleLetter = `${payload.titleTracking ?? -0.02}em`;
              return editingKey === "title" ? (
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  onBlur={commitInlineEdit}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") commitInlineEdit();
                    if (e.key === "Escape") cancelInlineEdit();
                  }}
                  autoFocus
                  rows={3}
                  className="bg-transparent text-inherit border-none outline-none resize-none"
                  style={{
                    width: titleWidth,
                    minWidth: 180,
                    fontSize: (isPost ? 98 : 120) * ty,
                    lineHeight: 0.9,
                    letterSpacing: titleLetter,
                    textTransform: "uppercase",
                    fontFamily: titleFontFamily,
                    color: txt,
                    padding: 0,
                    margin: 0,
                    textAlign: titleAlign,
                    textAlignLast: titleAlign === "justify" ? "center" : undefined,
                  }}
                />
              ) : (
                <h2
                  className="uppercase"
                  style={{
                    width: titleWidth,
                    color: txt,
                    fontSize: (isPost ? 98 : 120) * ty,
                    lineHeight: 0.9,
                    letterSpacing: titleLetter,
                    fontFamily: titleFontFamily,
                    fontWeight: 900,
                    margin: 0,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    textAlign: titleAlign,
                    textAlignLast: titleAlign === "justify" ? "center" : undefined,
                  }}
                >
                  {titleParts.map((p, i) =>
                    p.accent ? (
                      <span key={i} style={{ color: payload.genreColor }}>
                        {p.text}
                      </span>
                    ) : (
                      <span key={i}>{p.text}</span>
                    ),
                  )}
                </h2>
              );
            })()}
          </ElementBox>
        )}

        {!isPostText && payload.genre && (
          <ElementBox
            elementKey="genre"
            payload={payload}
            editable={editable}
            selected={selected === "genre"}
            onBeginDrag={beginDrag}
            isEditing={editingKey === "genre"}
            onDoubleClick={() => beginInlineEdit("genre", payload.genre)}
            disableScaleTransform
          >
            {(() => {
              const t = payload.transforms.genre;
              const tx = scaleXOf(t);
              const ty = scaleYOf(t);
              const genreWidth = 620 * tx;
              return editingKey === "genre" ? (
                <input
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  onBlur={commitInlineEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitInlineEdit();
                    if (e.key === "Escape") cancelInlineEdit();
                  }}
                  autoFocus
                  className="bg-transparent border-none outline-none"
                  style={{
                    width: genreWidth,
                    maxWidth: genreWidth,
                    color: txt,
                    fontSize: 26 * ty,
                    letterSpacing: `${0.3 * tx}em`,
                    textTransform: "uppercase",
                    fontFamily: "var(--font-capitana), sans-serif",
                    margin: 0,
                    opacity: 0.9,
                  }}
                />
              ) : (
                <p
                  className="uppercase"
                  style={{
                    width: genreWidth,
                    maxWidth: genreWidth,
                    color: txt,
                    fontSize: 26 * ty,
                    letterSpacing: `${0.3 * tx}em`,
                    margin: 0,
                    opacity: 0.9,
                  }}
                >
                  {payload.genre}
                </p>
              );
            })()}
          </ElementBox>
        )}
      </div>
    </div>
  );
});

// ----- Element wrapper with selection handles -----

function ElementBox({
  elementKey,
  payload,
  editable,
  selected,
  onBeginDrag,
  isEditing,
  onDoubleClick,
  disableScaleTransform,
  children,
}: {
  elementKey: ElementKey;
  payload: StoryPayload;
  editable: boolean;
  selected: boolean;
  onBeginDrag: (
    key: ElementKey,
    mode: DragMode,
    e: React.PointerEvent<HTMLDivElement>,
    elRect: DOMRect,
  ) => void;
  isEditing?: boolean;
  onDoubleClick?: () => void;
  disableScaleTransform?: boolean;
  children: React.ReactNode;
}) {
  const t = getTransform(payload, elementKey);
  const wrapRef = useRef<HTMLDivElement>(null);

  const startMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editable || !wrapRef.current || isEditing) return;
    onBeginDrag(elementKey, "move", e, wrapRef.current.getBoundingClientRect());
  };
  const startScale = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editable || !wrapRef.current) return;
    onBeginDrag(elementKey, "scaleXRight", e, wrapRef.current.getBoundingClientRect());
  };
  const startScaleBoth = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editable || !wrapRef.current) return;
    onBeginDrag(elementKey, "scaleBoth", e, wrapRef.current.getBoundingClientRect());
  };
  const startScaleY = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editable || !wrapRef.current) return;
    onBeginDrag(elementKey, "scaleYBottom", e, wrapRef.current.getBoundingClientRect());
  };
  const startRotate = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editable || !wrapRef.current) return;
    onBeginDrag(elementKey, "rotate", e, wrapRef.current.getBoundingClientRect());
  };

  const handleSize = 18;
  const rotHandleDist = 36;
  const sx = scaleXOf(t);
  const sy = scaleYOf(t);
  const layerByElement: Record<ElementKey, number> = {
    logo: 30,
    tag: 50,
    title: 20,
    genre: 10,
    paragraph1: 25,
    paragraph2: 26,
    accent: 27,
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={startMove}
      onDoubleClick={(e) => {
        if (!editable || !onDoubleClick) return;
        e.preventDefault();
        e.stopPropagation();
        onDoubleClick();
      }}
      className="absolute"
      style={{
        left: `${t.x * 100}%`,
        top: `${t.y * 100}%`,
        transform: disableScaleTransform
          ? `translate(-50%, -50%) rotate(${t.rotation}deg)`
          : `translate(-50%, -50%) rotate(${t.rotation}deg) scaleX(${sx}) scaleY(${sy})`,
        transformOrigin: "center",
        cursor: editable && !isEditing ? "grab" : "default",
        touchAction: "none",
        userSelect: "none",
        zIndex: layerByElement[elementKey],
      }}
    >
      {children}

      {editable && selected && (
        <>
          {/* Frame — fin contour bleu Photoshop-like */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              outline: "1.5px solid #2088FF",
              outlineOffset: 2,
              boxShadow: "0 0 0 0.5px rgba(255,255,255,0.5)",
            }}
          />
          {/* Width handles — carrés blancs à bord bleu */}
          {(["l", "r"] as const).map((side) => (
            <div
              key={side}
              className="absolute"
              style={{
                width: 10,
                height: 10,
                background: "#FFFFFF",
                border: "1.5px solid #2088FF",
                borderRadius: 0,
                boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)",
                cursor: "ew-resize",
                top: "50%",
                transform: "translateY(-50%)",
                left: side === "l" ? -7 : "auto",
                right: side === "r" ? -7 : "auto",
              }}
              onPointerDown={(e) => {
                if (side === "l") {
                  onBeginDrag(elementKey, "scaleXLeft", e, wrapRef.current!.getBoundingClientRect());
                  return;
                }
                startScale(e);
              }}
            />
          ))}
          {/* Height handles */}
          {(["t", "b"] as const).map((side) => (
            <div
              key={side}
              onPointerDown={(e) => {
                if (side === "t") {
                  onBeginDrag(elementKey, "scaleYTop", e, wrapRef.current!.getBoundingClientRect());
                  return;
                }
                startScaleY(e);
              }}
              className="absolute"
              style={{
                width: 10,
                height: 10,
                background: "#FFFFFF",
                border: "1.5px solid #2088FF",
                borderRadius: 0,
                boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)",
                cursor: "ns-resize",
                left: "50%",
                transform: "translateX(-50%)",
                top: side === "t" ? -7 : "auto",
                bottom: side === "b" ? -7 : "auto",
              }}
            />
          ))}
          {/* Corner handles — uniformes */}
          {(["tl", "tr", "bl", "br"] as const).map((corner) => (
            <div
              key={corner}
              onPointerDown={startScaleBoth}
              className="absolute"
              style={{
                width: 11,
                height: 11,
                background: "#FFFFFF",
                border: "1.5px solid #2088FF",
                borderRadius: 0,
                boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)",
                cursor: corner === "tl" || corner === "br" ? "nwse-resize" : "nesw-resize",
                top: corner.startsWith("t") ? -8 : "auto",
                bottom: corner.startsWith("b") ? -8 : "auto",
                left: corner.endsWith("l") ? -8 : "auto",
                right: corner.endsWith("r") ? -8 : "auto",
              }}
            />
          ))}
          {/* Ligne de liaison vers le bouton de rotation */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: -rotHandleDist - 2,
              height: rotHandleDist,
              width: 1,
              background: "#2088FF",
              transform: "translateX(-50%)",
              opacity: 0.7,
            }}
          />
          {/* Rotation handle — pastille blanche avec icône courbe */}
          <div
            onPointerDown={startRotate}
            className="absolute flex items-center justify-center"
            style={{
              left: "50%",
              top: -rotHandleDist - 22,
              width: 22,
              height: 22,
              transform: "translateX(-50%)",
              background: "#FFFFFF",
              border: "1.5px solid #2088FF",
              borderRadius: "50%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(0,0,0,0.05)",
              cursor: ROTATE_CURSOR,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2088FF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pointerEvents: "none" }}
            >
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <polyline points="3 4 3 9 8 9" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

// Rend des parties en gras pour les segments entourés de **…**
function renderInlineBold(text: string): React.ReactNode[] {
  if (!text) return [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <span key={i} style={{ fontWeight: 900 }}>
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function splitAccent(title: string, accent: string) {
  if (!accent.trim()) return [{ text: title, accent: false }];
  const idx = title.toLowerCase().indexOf(accent.toLowerCase());
  if (idx === -1) return [{ text: title, accent: false }];
  return [
    { text: title.slice(0, idx), accent: false },
    { text: title.slice(idx, idx + accent.length), accent: true },
    { text: title.slice(idx + accent.length), accent: false },
  ];
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function normalizeDeg(d: number) {
  let r = d % 360;
  if (r > 180) r -= 360;
  if (r < -180) r += 360;
  return r;
}

function snapToStep(value: number, step: number) {
  return Math.round(value / step) * step;
}
