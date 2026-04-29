"use client";

import { useState, useTransition } from "react";
import {
  Card,
  MacButton,
  MacField,
  MacInput,
  Segmented,
} from "@/components/admin/mac/primitives";

type Values = {
  title: string;
  weekNumber: number;
  year: number;
  openAt: string;
  closeAt: string;
  status: "DRAFT" | "OPEN" | "CLOSED";
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

function currentWeek(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = (now.getTime() - start.getTime()) / 86400000;
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

export function TopForm({
  initial,
  action,
  submitLabel = "Enregistrer",
}: Props) {
  const [status, setStatus] = useState<Values["status"]>(
    initial?.status ?? "DRAFT",
  );
  const [pending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    formData.set("status", status);
    startTransition(() => action(formData));
  };

  return (
    <form
      action={onSubmit}
      className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5"
    >
      <Card className="p-5 space-y-4">
        <MacField label="Titre" hint="Ex: Top rap #16 — sorties de la semaine.">
          <MacInput
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            placeholder="Titre du Top"
            className="text-[14px] font-semibold"
          />
        </MacField>

        <div className="grid grid-cols-2 gap-4">
          <MacField label="Semaine">
            <MacInput
              name="weekNumber"
              type="number"
              min={1}
              max={53}
              required
              defaultValue={initial?.weekNumber ?? currentWeek()}
            />
          </MacField>
          <MacField label="Année">
            <MacInput
              name="year"
              type="number"
              min={2024}
              max={2099}
              required
              defaultValue={initial?.year ?? new Date().getFullYear()}
            />
          </MacField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MacField label="Ouverture">
            <MacInput
              name="openAt"
              type="datetime-local"
              required
              defaultValue={toLocal(initial?.openAt)}
            />
          </MacField>
          <MacField label="Clôture">
            <MacInput
              name="closeAt"
              type="datetime-local"
              required
              defaultValue={toLocal(initial?.closeAt)}
            />
          </MacField>
        </div>
      </Card>

      <aside className="space-y-4 self-start xl:sticky xl:top-[68px]">
        <Card className="p-5 space-y-4">
          <MacField label="Statut">
            <Segmented
              value={status}
              onChange={setStatus}
              options={[
                { value: "DRAFT", label: "Brouillon" },
                { value: "OPEN", label: "Ouvert" },
                { value: "CLOSED", label: "Clos" },
              ]}
            />
            <p className="text-[11.5px] text-[color:var(--c-text-3)] mt-2 leading-snug">
              {status === "DRAFT" && "Masqué du public, uniquement visible ici."}
              {status === "OPEN" &&
                "Les votants voient le Top et peuvent voter."}
              {status === "CLOSED" &&
                "Podium révélé, les votes sont fermés."}
            </p>
          </MacField>

          <div className="pt-1 border-t border-[color:var(--c-border)]">
            <MacButton
              type="submit"
              variant="primary"
              className="w-full h-9"
              disabled={pending}
            >
              {pending ? "Enregistrement…" : submitLabel}
            </MacButton>
          </div>
        </Card>
      </aside>
    </form>
  );
}
