"use client";

import { useState, useTransition } from "react";
import {
  Card,
  MacButton,
  MacField,
  MacInput,
  MacTextarea,
  Segmented,
} from "@/components/admin/mac/primitives";
import { Flame, Snowflake, Swords } from "lucide-react";

type Values = {
  statement: string;
  backgroundUrl: string | null;
  publishAt: string;
  closeAt: string | null;
  status: "DRAFT" | "OPEN" | "CLOSED";
  optionALabel: string | null;
  optionBLabel: string | null;
};

type Props = {
  initial?: Partial<Values>;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
};

function toLocal(dt: string | null | undefined): string {
  if (!dt) return "";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function HotTakeForm({
  initial,
  action,
  submitLabel = "Enregistrer",
}: Props) {
  const [statement, setStatement] = useState(initial?.statement ?? "");
  const [bg, setBg] = useState(initial?.backgroundUrl ?? "");
  const [status, setStatus] = useState<Values["status"]>(
    initial?.status ?? "DRAFT",
  );
  const [mode, setMode] = useState<"classic" | "versus">(
    initial?.optionALabel && initial?.optionBLabel ? "versus" : "classic",
  );
  const [optionA, setOptionA] = useState(initial?.optionALabel ?? "");
  const [optionB, setOptionB] = useState(initial?.optionBLabel ?? "");
  const [pending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    formData.set("status", status);
    if (mode === "versus") {
      formData.set("optionALabel", optionA);
      formData.set("optionBLabel", optionB);
    } else {
      formData.set("optionALabel", "");
      formData.set("optionBLabel", "");
    }
    startTransition(() => action(formData));
  };

  const versusReady =
    mode === "classic" ||
    (optionA.trim().length >= 2 && optionB.trim().length >= 2);

  const count = statement.length;
  const countColor =
    count === 0
      ? "text-[color:var(--c-text-4)]"
      : count < 5 || count > 280
        ? "text-[color:var(--c-danger)]"
        : count > 240
          ? "text-[color:var(--c-warning)]"
          : "text-[color:var(--c-text-3)]";

  return (
    <form
      action={onSubmit}
      className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5"
    >
      <div className="space-y-4">
        {/* Preview */}
        <Card className="overflow-hidden">
          <div className="px-5 h-[42px] border-b border-[color:var(--c-border)] flex items-center">
            <span className="text-[11px] font-medium text-[color:var(--c-text-3)] uppercase tracking-[0.04em]">
              Aperçu
            </span>
          </div>
          <div
            className="relative min-h-[260px] flex items-center justify-center px-8 py-12 text-center"
            style={{
              background: bg
                ? `#0a0a0a url(${bg}) center/cover`
                : "linear-gradient(135deg, #111 0%, #333 100%)",
            }}
          >
            {bg && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            )}
            <p
              className="relative text-white text-[28px] md:text-[30px] font-semibold max-w-2xl leading-[1.05]"
              style={{
                textShadow: "0 2px 20px rgba(0,0,0,0.45)",
                letterSpacing: "-0.02em",
              }}
            >
              « {statement || "Ton affirmation…"} »
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 h-[44px] border-t border-[color:var(--c-border)]">
            {mode === "classic" ? (
              <>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--c-danger)]">
                  <Flame size={13} strokeWidth={1.75} />
                  Chaud
                </span>
                <span className="w-px h-4 bg-[color:var(--c-border-strong)]" />
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--c-accent)]">
                  <Snowflake size={13} strokeWidth={1.75} />
                  Froid
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--c-danger)] truncate max-w-[9rem]">
                  <Swords size={13} strokeWidth={1.75} />
                  {optionA || "Option A"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--c-text-4)]">
                  vs
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--c-accent)] truncate max-w-[9rem]">
                  {optionB || "Option B"}
                </span>
              </>
            )}
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <MacField label="Affirmation">
            <MacTextarea
              name="statement"
              required
              rows={3}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              maxLength={280}
              placeholder="Ex: Le drill français est mort en 2025."
              className="text-[14px] font-medium"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-[color:var(--c-text-3)]">
                Une phrase tranchée, 5 à 280 caractères.
              </span>
              <span
                className={`text-[11.5px] tabular-nums ${countColor}`}
              >
                {count} / 280
              </span>
            </div>
          </MacField>

          <MacField label="Format de vote">
            <Segmented
              value={mode}
              onChange={(v) => setMode(v as "classic" | "versus")}
              options={[
                { value: "classic", label: "Chaud / Froid" },
                { value: "versus", label: "Versus A / B" },
              ]}
            />
            <p className="text-[11.5px] text-[color:var(--c-text-3)] mt-2 leading-snug">
              {mode === "classic"
                ? "Duel historique : chaud (rouge, d’accord) vs froid (bleu, pas d’accord)."
                : "Duel custom. L’option A prend le rouge, la B le bleu."}
            </p>
          </MacField>

          {mode === "versus" && (
            <div className="grid grid-cols-2 gap-4">
              <MacField label="Option A (rouge)" hint="2 à 40 caractères">
                <MacInput
                  name="optionALabel"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  maxLength={40}
                  placeholder="Ex: Booba"
                />
              </MacField>
              <MacField label="Option B (bleu)" hint="2 à 40 caractères">
                <MacInput
                  name="optionBLabel"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  maxLength={40}
                  placeholder="Ex: Kaaris"
                />
              </MacField>
            </div>
          )}

          <MacField
            label="Image de fond"
            hint="Optionnelle. JPG/PNG en URL absolue."
          >
            <MacInput
              name="backgroundUrl"
              type="url"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              placeholder="https://…"
            />
          </MacField>

          <div className="grid grid-cols-2 gap-4">
            <MacField label="Publication">
              <MacInput
                name="publishAt"
                type="datetime-local"
                required
                defaultValue={
                  toLocal(initial?.publishAt) ||
                  toLocal(new Date().toISOString())
                }
              />
            </MacField>
            <MacField label="Clôture (optionnelle)">
              <MacInput
                name="closeAt"
                type="datetime-local"
                defaultValue={toLocal(initial?.closeAt)}
              />
            </MacField>
          </div>
        </Card>
      </div>

      <aside className="space-y-4 self-start xl:sticky xl:top-[68px]">
        <Card className="p-5 space-y-4">
          <MacField label="Statut">
            <Segmented
              value={status}
              onChange={setStatus}
              options={[
                { value: "DRAFT", label: "Brouillon" },
                { value: "OPEN", label: "Publié" },
                { value: "CLOSED", label: "Clos" },
              ]}
            />
            <p className="text-[11.5px] text-[color:var(--c-text-3)] mt-2 leading-snug">
              {status === "DRAFT" &&
                "Masqué du public, itération libre avant publication."}
              {status === "OPEN" &&
                "Visible publiquement et ouvert aux votes."}
              {status === "CLOSED" &&
                "Archive consultable mais fermée aux votes."}
            </p>
          </MacField>

          <div className="pt-1 border-t border-[color:var(--c-border)]">
            <MacButton
              type="submit"
              variant="primary"
              className="w-full h-9"
              disabled={pending || !versusReady}
            >
              {pending ? "Enregistrement…" : submitLabel}
            </MacButton>
            {!versusReady && (
              <p className="text-[11.5px] text-[color:var(--c-danger)] mt-2">
                Les deux options du versus doivent faire 2 caractères min.
              </p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[12px] font-medium text-[color:var(--c-text-2)] mb-2">
            Checklist
          </p>
          <ul className="space-y-1.5 text-[12px] text-[color:var(--c-text-2)]">
            <Check ok={count >= 5 && count <= 280}>
              Affirmation 5–280 caractères
            </Check>
            <Check ok={versusReady}>
              {mode === "classic" ? "Mode Chaud / Froid" : "Options A et B (2 min)"}
            </Check>
            <Check ok={!!bg}>Image de fond (recommandée)</Check>
            <Check ok={status === "OPEN"}>Statut publié</Check>
          </ul>
        </Card>
      </aside>
    </form>
  );
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`w-3.5 h-3.5 rounded-full grid place-items-center text-[9px] text-white ${
          ok
            ? "bg-[color:var(--c-success)]"
            : "bg-[color:var(--c-surface-3)] text-[color:var(--c-text-3)]"
        }`}
      >
        {ok ? "✓" : ""}
      </span>
      <span className={ok ? "" : "text-[color:var(--c-text-3)]"}>
        {children}
      </span>
    </li>
  );
}
