"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MacButton } from "@/components/admin/mac/primitives";
import { Move, ZoomIn, RotateCcw, Check, X } from "lucide-react";

export type BackgroundFit = { tx: number; ty: number; scale: number };

const DEFAULT_FIT: BackgroundFit = { tx: 0, ty: 0, scale: 1 };

function clampFit(f: BackgroundFit): BackgroundFit {
  const max = ((f.scale - 1) / 2) * 100;
  return {
    scale: Math.min(6, Math.max(1, f.scale)),
    tx: Math.min(max, Math.max(-max, f.tx)),
    ty: Math.min(max, Math.max(-max, f.ty)),
  };
}

const FORMAT_RATIO: Record<"story" | "post" | "post-text", number> = {
  story: 1080 / 1920,
  post: 1080 / 1380,
  "post-text": 1080 / 1380,
};

export function BackgroundCropper({
  open,
  imageUrl,
  format,
  initial,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  imageUrl: string;
  format: "story" | "post" | "post-text";
  initial?: BackgroundFit;
  onCancel: () => void;
  onConfirm: (fit: BackgroundFit) => void;
}) {
  const [fit, setFit] = useState<BackgroundFit>(initial ?? DEFAULT_FIT);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setFit(clampFit(initial ?? DEFAULT_FIT));
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm(fit);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, fit, onCancel, onConfirm]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = { x: e.clientX, y: e.clientY, tx: fit.tx, ty: fit.ty };
    },
    [fit.tx, fit.ty],
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !frameRef.current) return;
    const w = frameRef.current.clientWidth;
    const h = frameRef.current.clientHeight;
    const dx = ((e.clientX - dragRef.current.x) / w) * 100;
    const dy = ((e.clientY - dragRef.current.y) / h) * 100;
    setFit((f) =>
      clampFit({ ...f, tx: dragRef.current!.tx + dx, ty: dragRef.current!.ty + dy }),
    );
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFit((f) => clampFit({ ...f, scale: f.scale - e.deltaY * 0.002 }));
  }, []);

  if (!open || !mounted) return null;

  const ratio = FORMAT_RATIO[format];
  const node = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm ui-fade-in"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-[color:var(--c-surface)] border border-[color:var(--c-border)] rounded-[10px] shadow-[var(--s-3)] w-[min(540px,92vw)] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-[color:var(--c-text-2)]">
            <Move size={13} strokeWidth={1.75} />
            Cadrer l’image de fond
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[color:var(--c-text-3)] hover:text-[color:var(--c-text)] transition-colors"
            aria-label="Fermer"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex justify-center">
          <div
            ref={frameRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
            className="relative overflow-hidden rounded-[6px] border border-[color:var(--c-border)] bg-[color:var(--c-surface-2)] cursor-grab active:cursor-grabbing select-none touch-none"
            style={{ width: 320, height: 320 / ratio }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{
                transform: `translate(${fit.tx}%, ${fit.ty}%) scale(${fit.scale})`,
                transformOrigin: "center center",
              }}
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20" />
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-1">
          <ZoomIn
            size={13}
            strokeWidth={1.75}
            className="text-[color:var(--c-text-3)] shrink-0"
          />
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={fit.scale}
            onChange={(e) =>
              setFit((f) => clampFit({ ...f, scale: Number(e.target.value) }))
            }
            className="flex-1"
          />
          <span
            className="w-[42px] text-right text-[11px] tabular-nums text-[color:var(--c-text-3)]"
            style={{ fontFamily: "var(--f-mono)" }}
          >
            ×{fit.scale.toFixed(2)}
          </span>
        </div>

        <p className="text-[11px] text-[color:var(--c-text-4)] px-1">
          Glisse l’image · molette pour zoomer · ⏎ valider · Echap annuler
        </p>

        <div className="flex items-center justify-between gap-2 pt-1">
          <MacButton
            size="sm"
            onClick={() => setFit(DEFAULT_FIT)}
            icon={<RotateCcw size={12} strokeWidth={1.75} />}
          >
            Réinitialiser
          </MacButton>
          <div className="flex items-center gap-2">
            <MacButton size="sm" onClick={onCancel}>
              Annuler
            </MacButton>
            <MacButton
              size="sm"
              variant="primary"
              onClick={() => onConfirm(fit)}
              icon={<Check size={12} strokeWidth={1.75} />}
            >
              Valider
            </MacButton>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
