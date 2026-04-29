"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const statuses = ["DRAFT", "OPEN", "CLOSED"] as const;

const versusLabel = z
  .string()
  .transform((v) => v.trim())
  .pipe(
    z
      .string()
      .max(40, "40 caractères max")
      .refine((v) => v.length === 0 || v.length >= 2, {
        message: "2 caractères minimum",
      }),
  )
  .transform((v) => (v === "" ? null : v));

const hotTakeSchema = z
  .object({
    statement: z.string().min(5).max(280),
    backgroundUrl: z
      .string()
      .url()
      .or(z.literal(""))
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .optional(),
    publishAt: z.string().min(1),
    closeAt: z.string().optional(),
    status: z.enum(statuses),
    optionALabel: versusLabel,
    optionBLabel: versusLabel,
  })
  .refine(
    (d) =>
      (d.optionALabel == null && d.optionBLabel == null) ||
      (d.optionALabel != null && d.optionBLabel != null),
    {
      message: "Le mode versus demande les deux options (A et B) ou aucune.",
      path: ["optionALabel"],
    },
  );

function parseDateOrNull(value: FormDataEntryValue | null): Date | null {
  if (!value || typeof value !== "string" || value === "") return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function createHotTake(formData: FormData) {
  await requireAdmin();
  const parsed = hotTakeSchema.safeParse({
    statement: formData.get("statement"),
    backgroundUrl: formData.get("backgroundUrl") ?? "",
    publishAt: formData.get("publishAt"),
    closeAt: formData.get("closeAt") ?? "",
    status: formData.get("status") ?? "DRAFT",
    optionALabel: formData.get("optionALabel") ?? "",
    optionBLabel: formData.get("optionBLabel") ?? "",
  });
  if (!parsed.success) {
    throw new Error("Champs invalides : " + parsed.error.message);
  }
  const publishAt = new Date(parsed.data.publishAt);
  const closeAt = parseDateOrNull(parsed.data.closeAt ?? "");

  const created = await db.hotTake.create({
    data: {
      statement: parsed.data.statement,
      backgroundUrl: parsed.data.backgroundUrl ?? null,
      publishAt,
      closeAt,
      status: parsed.data.status,
      optionALabel: parsed.data.optionALabel ?? null,
      optionBLabel: parsed.data.optionBLabel ?? null,
    },
  });

  revalidatePath("/admin/hot-take");
  revalidatePath("/admin/dashboard");
  revalidatePath("/hot-take");
  revalidatePath("/");
  redirect(`/admin/hot-take/${created.id}`);
}

export async function updateHotTake(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = hotTakeSchema.safeParse({
    statement: formData.get("statement"),
    backgroundUrl: formData.get("backgroundUrl") ?? "",
    publishAt: formData.get("publishAt"),
    closeAt: formData.get("closeAt") ?? "",
    status: formData.get("status") ?? "DRAFT",
    optionALabel: formData.get("optionALabel") ?? "",
    optionBLabel: formData.get("optionBLabel") ?? "",
  });
  if (!parsed.success) {
    throw new Error("Champs invalides : " + parsed.error.message);
  }
  const publishAt = new Date(parsed.data.publishAt);
  const closeAt = parseDateOrNull(parsed.data.closeAt ?? "");

  await db.hotTake.update({
    where: { id },
    data: {
      statement: parsed.data.statement,
      backgroundUrl: parsed.data.backgroundUrl ?? null,
      publishAt,
      closeAt,
      status: parsed.data.status,
      optionALabel: parsed.data.optionALabel ?? null,
      optionBLabel: parsed.data.optionBLabel ?? null,
    },
  });

  revalidatePath("/admin/hot-take");
  revalidatePath("/admin/dashboard");
  revalidatePath("/hot-take");
  revalidatePath("/");
}

export async function deleteHotTake(id: string) {
  await requireAdmin();
  await db.hotTake.delete({ where: { id } });
  revalidatePath("/admin/hot-take");
  revalidatePath("/admin/dashboard");
  redirect("/admin/hot-take");
}

export async function toggleHotTakeStatus(id: string, next: "OPEN" | "CLOSED" | "DRAFT") {
  await requireAdmin();
  await db.hotTake.update({ where: { id }, data: { status: next } });
  revalidatePath("/admin/hot-take");
  revalidatePath("/admin/dashboard");
  revalidatePath("/hot-take");
  revalidatePath("/");
}
