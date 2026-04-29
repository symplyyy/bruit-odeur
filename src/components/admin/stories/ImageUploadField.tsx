"use client";

import { useRef, useState } from "react";
import {
  IconButton,
  MacButton,
  MacInput,
} from "@/components/admin/mac/primitives";
import {
  Upload,
  X,
  Loader2,
  Link2,
  ImagePlus,
  AlertCircle,
  Crop,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BackgroundCropper, type BackgroundFit } from "./BackgroundCropper";

export function ImageUploadField({
  value,
  onChange,
  format = "post",
  fit,
  onFitChange,
}: {
  value: string;
  onChange: (url: string) => void;
  format?: "story" | "post" | "post-text";
  fit?: BackgroundFit;
  onFitChange?: (fit: BackgroundFit) => void;
}) {
  const [cropperOpen, setCropperOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? `Erreur ${res.status}`);
      }
      onChange(json.url);
      if (onFitChange) {
        onFitChange({ tx: 0, ty: 0, scale: 1 });
        setCropperOpen(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload échoué");
    } finally {
      setUploading(false);
    }
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) void uploadFile(f);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void uploadFile(f);
  }

  return (
    <div className="space-y-2">
      {/* Zone d'aperçu / dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative w-full aspect-[4/5] max-h-[220px] rounded-[8px] overflow-hidden border-2 border-dashed transition-colors",
          dragOver
            ? "border-[color:var(--c-text)] bg-[color:var(--c-hover)]"
            : "border-[color:var(--c-border)] bg-[color:var(--c-surface-2)]",
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Aperçu"
              className="absolute inset-0 w-full h-full object-cover"
              onError={() =>
                setError("Impossible de charger l'image (URL invalide ?)")
              }
              onLoad={() => setError(null)}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              {onFitChange && (
                <IconButton
                  tooltip="Recadrer"
                  size="sm"
                  onClick={() => setCropperOpen(true)}
                  className="bg-white/90 text-[color:var(--c-text)] hover:bg-white"
                >
                  <Crop size={13} strokeWidth={1.75} />
                </IconButton>
              )}
              <IconButton
                tooltip="Remplacer"
                size="sm"
                onClick={() => inputRef.current?.click()}
                className="bg-white/90 text-[color:var(--c-text)] hover:bg-white"
              >
                <Upload size={13} strokeWidth={1.75} />
              </IconButton>
              <IconButton
                tooltip="Retirer"
                size="sm"
                onClick={() => {
                  onChange("");
                  setError(null);
                }}
                className="bg-white/90 text-[color:var(--c-danger)] hover:bg-white"
              >
                <X size={13} strokeWidth={1.75} />
              </IconButton>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 grid place-items-center text-[color:var(--c-text-3)] hover:text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)] transition-colors"
          >
            <div className="flex flex-col items-center gap-1.5">
              {uploading ? (
                <Loader2
                  size={20}
                  strokeWidth={1.75}
                  className="animate-spin"
                />
              ) : (
                <ImagePlus size={20} strokeWidth={1.75} />
              )}
              <span className="text-[12px] font-medium">
                {uploading
                  ? "Envoi en cours…"
                  : dragOver
                    ? "Lâche le fichier"
                    : "Cliquer ou glisser une image"}
              </span>
              {!uploading && (
                <span className="text-[10.5px] text-[color:var(--c-text-4)]">
                  PNG · JPG · WEBP · GIF — 8 Mo max
                </span>
              )}
            </div>
          </button>
        )}

        {uploading && value && (
          <div className="absolute inset-0 grid place-items-center bg-black/40">
            <Loader2
              size={22}
              strokeWidth={2}
              className="animate-spin text-white"
            />
          </div>
        )}
      </div>

      {/* Input fichier caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onPickFile}
      />

      {/* Champ URL */}
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Link2
            size={13}
            strokeWidth={1.75}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[color:var(--c-text-4)] pointer-events-none"
          />
          <MacInput
            type="url"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setError(null);
            }}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v && /^https?:\/\//i.test(v) && onFitChange) {
                onFitChange({ tx: 0, ty: 0, scale: 1 });
                setCropperOpen(true);
              }
            }}
            placeholder="ou colle une URL https://…"
            className="pl-8"
          />
        </div>
        <MacButton
          size="sm"
          icon={<Upload size={12} strokeWidth={1.75} />}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Importer
        </MacButton>
      </div>

      {error && (
        <p className="flex items-start gap-1.5 text-[11.5px] text-[color:var(--c-danger)]">
          <AlertCircle size={12} strokeWidth={2} className="mt-[1px] shrink-0" />
          {error}
        </p>
      )}

      {onFitChange && (
        <BackgroundCropper
          open={cropperOpen && !!value}
          imageUrl={value}
          format={format}
          initial={fit}
          onCancel={() => setCropperOpen(false)}
          onConfirm={(f) => {
            onFitChange(f);
            setCropperOpen(false);
          }}
        />
      )}
    </div>
  );
}
