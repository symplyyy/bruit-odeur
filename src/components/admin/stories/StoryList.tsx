"use client";

import Link from "next/link";
import { useTransition } from "react";
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

export function StoryList({ items }: { items: Item[] }) {
  const [pending, startTransition] = useTransition();

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
    <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      {items.map((s) => {
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
                  <div className="absolute top-2 left-2">
                    <Badge tone="neutral">
                      {s.payload?.format === "post"
                        ? "Post"
                        : s.payload?.format === "post-text"
                          ? "Post · texte"
                          : "Story"}
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
  );
}
