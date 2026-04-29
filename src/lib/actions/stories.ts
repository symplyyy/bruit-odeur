"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const transform = z.object({
  x: z.number().min(-0.5).max(1.5),
  y: z.number().min(-0.5).max(1.5),
  scale: z.number().min(0.1).max(5).optional(),
  scaleX: z.number().min(0.1).max(5).optional(),
  scaleY: z.number().min(0.1).max(5).optional(),
  rotation: z.number().min(-360).max(360),
});

const payloadSchema = z.object({
  format: z.enum(["story", "post", "post-text"]),
  backgroundUrl: z.string().url().or(z.literal("")),
  backgroundColor: z
    .union([
      z.string().regex(/^#[0-9a-fA-F]{6}$/),
      z.literal("transparent"),
      z.literal(""),
    ])
    .optional(),
  logoVariant: z.enum(["light", "black"]),
  logoTheme: z.enum(["default", "sport", "mode", "autre"]).default("default"),
  textColor: z.enum(["white", "ink"]),
  titleAlign: z.enum(["left", "center", "right", "justify"]).optional(),
  tag: z.string().max(40),
  tagFont: z.enum(["kabel", "capitana"]).optional(),
  tagTracking: z.number().min(-0.1).max(1).optional(),
  title: z.string().max(200),
  titleFont: z.enum(["kabel", "capitana"]).optional(),
  titleTracking: z.number().min(-0.1).max(0.5).optional(),
  accent: z.string().max(60),
  genre: z.string().max(40),
  genreColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  darkGradient: z.boolean(),
  triangleHeight: z.number().min(0).max(0.5),
  triangleDir: z.enum(["left", "right"]),
  // Format "post-text" : deuxième slide d'un post, texte long avec mots en gras
  // via marquage `**mot**`. Logo centré en pied de slide.
  paragraph1: z.string().max(800).optional(),
  paragraph2: z.string().max(800).optional(),
  transforms: z.object({
    logo: transform,
    tag: transform,
    title: transform,
    genre: transform,
    // Optionnels : utilisés par "post-text"
    paragraph1: transform.optional(),
    paragraph2: transform.optional(),
    accent: transform.optional(),
  }),
});

const saveSchema = z.object({
  name: z.string().min(1).max(80),
  payload: payloadSchema,
});

export type StoryPayload = z.infer<typeof payloadSchema>;

export async function saveStoryTemplate(input: {
  name: string;
  payload: StoryPayload;
}): Promise<{ id: string }> {
  await requireAdmin();
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) throw new Error("Story invalide");

  const created = await db.storyTemplate.create({
    data: {
      name: parsed.data.name,
      payload: parsed.data.payload,
    },
  });
  revalidatePath("/admin/stories");
  return { id: created.id };
}

const updateSchema = saveSchema.extend({ id: z.string().min(1) });

export async function updateStoryTemplate(input: {
  id: string;
  name: string;
  payload: StoryPayload;
}): Promise<{ id: string }> {
  await requireAdmin();
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) throw new Error("Story invalide");

  await db.storyTemplate.update({
    where: { id: parsed.data.id },
    data: {
      name: parsed.data.name,
      payload: parsed.data.payload,
    },
  });
  revalidatePath("/admin/stories");
  return { id: parsed.data.id };
}

export async function deleteStoryTemplate(id: string) {
  await requireAdmin();
  await db.storyTemplate.delete({ where: { id } });
  revalidatePath("/admin/stories");
}

export async function duplicateStoryTemplate(id: string) {
  await requireAdmin();
  const src = await db.storyTemplate.findUnique({ where: { id } });
  if (!src) throw new Error("Introuvable");
  const created = await db.storyTemplate.create({
    data: {
      name: `${src.name} (copie)`,
      payload: src.payload as StoryPayload,
    },
  });
  revalidatePath("/admin/stories");
  return { id: created.id };
}

export async function listStoryTemplates() {
  try {
    return await db.storyTemplate.findMany({
      orderBy: { updatedAt: "desc" },
      take: 30,
    });
  } catch {
    return [];
  }
}

export async function getStoryTemplate(id: string) {
  try {
    return await db.storyTemplate.findUnique({ where: { id } });
  } catch {
    return null;
  }
}
