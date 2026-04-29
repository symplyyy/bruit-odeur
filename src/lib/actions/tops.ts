"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const categories = ["SON", "ALBUM", "CLIP", "SPORT", "AUTRE"] as const;
const statuses = ["DRAFT", "OPEN", "CLOSED"] as const;

const topSchema = z.object({
  title: z.string().min(3).max(120),
  weekNumber: z.coerce.number().int().min(1).max(53),
  year: z.coerce.number().int().min(2024).max(2099),
  openAt: z.string().min(1),
  closeAt: z.string().min(1),
  status: z.enum(statuses),
});

const sortieSchema = z.object({
  artiste: z.string().min(1).max(60),
  titre: z.string().min(1).max(100),
  pochetteUrl: z.string().url(),
  embedUrl: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null))
    .refine((v) => v === null || /^https?:\/\//i.test(v), {
      message: "URL invalide",
    }),
  category: z.enum(categories),
});

function revalAll(id?: string) {
  revalidatePath("/admin/top-semaine");
  revalidatePath("/admin/dashboard");
  revalidatePath("/top-semaine");
  revalidatePath("/");
  if (id) revalidatePath(`/admin/top-semaine/${id}`);
}

export async function createTop(formData: FormData) {
  await requireAdmin();
  const parsed = topSchema.safeParse({
    title: formData.get("title"),
    weekNumber: formData.get("weekNumber"),
    year: formData.get("year"),
    openAt: formData.get("openAt"),
    closeAt: formData.get("closeAt"),
    status: formData.get("status") ?? "DRAFT",
  });
  if (!parsed.success) throw new Error("Champs invalides");

  const created = await db.top.create({
    data: {
      title: parsed.data.title,
      weekNumber: parsed.data.weekNumber,
      year: parsed.data.year,
      openAt: new Date(parsed.data.openAt),
      closeAt: new Date(parsed.data.closeAt),
      status: parsed.data.status,
    },
  });

  revalAll(created.id);
  redirect(`/admin/top-semaine/${created.id}`);
}

export async function updateTop(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = topSchema.safeParse({
    title: formData.get("title"),
    weekNumber: formData.get("weekNumber"),
    year: formData.get("year"),
    openAt: formData.get("openAt"),
    closeAt: formData.get("closeAt"),
    status: formData.get("status") ?? "DRAFT",
  });
  if (!parsed.success) throw new Error("Champs invalides");

  await db.top.update({
    where: { id },
    data: {
      title: parsed.data.title,
      weekNumber: parsed.data.weekNumber,
      year: parsed.data.year,
      openAt: new Date(parsed.data.openAt),
      closeAt: new Date(parsed.data.closeAt),
      status: parsed.data.status,
    },
  });
  revalAll(id);
}

export async function deleteTop(id: string) {
  await requireAdmin();
  await db.top.delete({ where: { id } });
  revalAll();
  redirect("/admin/top-semaine");
}

export async function addSortie(topId: string, formData: FormData) {
  await requireAdmin();
  const parsed = sortieSchema.safeParse({
    artiste: formData.get("artiste"),
    titre: formData.get("titre"),
    pochetteUrl: formData.get("pochetteUrl"),
    embedUrl: formData.get("embedUrl"),
    category: formData.get("category") ?? "SON",
  });
  if (!parsed.success) throw new Error("Sortie invalide");

  const count = await db.sortie.count({ where: { topId } });
  await db.sortie.create({
    data: {
      topId,
      artiste: parsed.data.artiste,
      titre: parsed.data.titre,
      pochetteUrl: parsed.data.pochetteUrl,
      embedUrl: parsed.data.embedUrl,
      category: parsed.data.category,
      order: count,
    },
  });
  revalAll(topId);
}

export async function deleteSortie(topId: string, sortieId: string) {
  await requireAdmin();
  await db.sortie.delete({ where: { id: sortieId } });
  revalAll(topId);
}

export async function moveSortie(
  topId: string,
  sortieId: string,
  direction: "up" | "down",
) {
  await requireAdmin();
  const sorties = await db.sortie.findMany({
    where: { topId },
    orderBy: { order: "asc" },
  });
  const idx = sorties.findIndex((s) => s.id === sortieId);
  if (idx === -1) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= sorties.length) return;

  const a = sorties[idx];
  const b = sorties[swapIdx];
  await db.$transaction([
    db.sortie.update({ where: { id: a.id }, data: { order: b.order } }),
    db.sortie.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalAll(topId);
}
