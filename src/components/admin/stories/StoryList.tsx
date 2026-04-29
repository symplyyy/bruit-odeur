"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  deleteStoryTemplate,
  duplicateStoryTemplate,
  type StoryPayload,
} from "@/lib/actions/stories";
import { StoryCanvas } from "./StoryCanvas";
import { Card, Badge, IconButton } from "@/components/admin/mac/primitives";
import { CalendarClock, Copy, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  name: string;
  updatedAt: Date;
  payload: StoryPayload;
};

type ThemeFilter = "all" | NonNullable<StoryPayload["logoTheme"]>;

const THEME_LABELS: Record<
  NonNullable<StoryPayload["logoTheme"]>,
  string
> = {
  default: "Musique",
  sport: "Sport",
  mode: "Mode",
  autre: "Autre",
};

const THEME_OPTIONS: { value: ThemeFilter; label: string }[] = [
  { value: "all", label: "Tous les thèmes" },
  { value: "default", label: "Musique" },
  { value: "sport", label: "Sport" },
  { value: "mode", label: "Mode" },
  { value: "autre", label: "Autre" },
];

function logoThemeOf(payload: StoryPayload): NonNullable<StoryPayload["logoTheme"]> {
  return payload.logoTheme ?? "default";
}

export function StoryList({ items }: { items: Item[] }) {
  const [pending, startTransition] = useTransition();
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>("all");

  const filtered = useMemo(() => {
    if (themeFilter === "all") return items;
    return items.filter((s) => logoThemeOf(s.payload) === themeFilter);
  }, [items, themeFilter]);

  if (items.length === 0) {
    return (
      <Card className="p-10 text-center">
        <p className="text-[14px] font-semibold">Aucun template</p>
        <p className="text-[12px] text-[color:var(--c-text-3)] mt-1">
          Tes templates enregistrés apparaîtront ici.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3 min-w-0">
          <span className="text-[12px] font-medium text-[color:var(--c-text-2)] shrink-0">
            Thème
          </span>
          <select
            className="ui-input h-[32px] text-[12px] w-full sm:w-[min(100%,220px)] ui-focus"
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value as ThemeFilter)}
            aria-label="Filtrer par thème"
          >
            {THEME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {themeFilter !== "all" && (
          <p className="text-[11px] text-[color:var(--c-text-3)] sm:text-right">
            {filtered.length} sur {items.length} template
            {items.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-[13px] font-medium text-[color:var(--c-text-2)]">
            Aucun template pour ce thème
          </p>
          <p className="text-[12px] text-[color:var(--c-text-3)] mt-1">
            Choisis « Tous les thèmes » ou un autre filtre.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((s) => {
        const transparent =
          !s.payload?.backgroundColor ||
          s.payload.backgroundColor === "transparent" ||
          s.payload.backgroundColor === "";
        return (
          <li key={s.id}>
            <Card className="overflow-hidden group">
              <Link
                href={`/admin/stories?id=${s.id}`}
                className="block relative"
              >
                <div
                  className={cn(
                    "relative overflow-hidden border-b border-[color:var(--c-border)]",
                    transparent && "ui-checker",
                  )}
                >
                  <div className="pointer-events-none">
                    <StoryCanvas payload={s.payload} editable={false} />
                  </div>
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-0.5rem)]">
                    <Badge tone="neutral">
                      {s.payload?.format === "post"
                        ? "Post"
                        : s.payload?.format === "post-text"
                          ? "Post · texte"
                          : "Story"}
                    </Badge>
                    <Badge tone="neutral">
                      {THEME_LABELS[logoThemeOf(s.payload)]}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors grid place-items-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-[11px] font-medium text-white bg-black/70 px-2.5 h-7 rounded-full shadow-lg">
                      <Pencil size={11} strokeWidth={2} />
                      Éditer
                    </span>
                  </div>
                </div>
              </Link>
              <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium truncate">
                    {s.name}
                  </p>
                  <p className="text-[10.5px] text-[color:var(--c-text-3)] mt-0.5 inline-flex items-center gap-1">
                    <CalendarClock size={10} strokeWidth={1.75} />
                    {new Date(s.updatedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <IconButton
                    size="sm"
                    tooltip="Dupliquer"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await duplicateStoryTemplate(s.id);
                      })
                    }
                  >
                    <Copy size={12} strokeWidth={1.75} />
                  </IconButton>
                  <IconButton
                    size="sm"
                    tooltip="Supprimer"
                    disabled={pending}
                    className="hover:text-[color:var(--c-danger)]"
                    onClick={() => {
                      if (confirm(`Supprimer « ${s.name} » ?`)) {
                        startTransition(async () => {
                          await deleteStoryTemplate(s.id);
                        });
                      }
                    }}
                  >
                    <Trash2 size={12} strokeWidth={1.75} />
                  </IconButton>
                </div>
              </div>
            </Card>
          </li>
        );
      })}
        </ul>
      )}
    </div>
  );
}
