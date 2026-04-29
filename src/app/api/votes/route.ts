import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

const voteSchema = z.object({
  topId: z.string().min(1),
  sortieId: z.string().min(1),
  pseudo: z.string().min(2).max(24),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = voteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  const { topId, sortieId, pseudo } = parsed.data;

  const slug = slugify(pseudo);
  const pseudoRow = await db.pseudo.upsert({
    where: { slug },
    update: {},
    create: { name: pseudo, slug },
  });

  try {
    await db.topVote.create({
      data: { topId, sortieId, pseudoId: pseudoRow.id },
    });
  } catch {
    return NextResponse.json({ error: "already_voted" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
