import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { STORAGE_BUCKET, supabaseAdmin } from "@/lib/supabase";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté (JPEG, PNG, WEBP, GIF)" },
      { status: 415 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Fichier trop lourd (max 8 Mo)" },
      { status: 413 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const key = `bg/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const sb = supabaseAdmin();
  const { error } = await sb.storage
    .from(STORAGE_BUCKET)
    .upload(key, file, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json(
      { error: `Upload échoué : ${error.message}` },
      { status: 500 },
    );
  }

  const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(key);
  return NextResponse.json({ url: data.publicUrl });
}

export const runtime = "nodejs";
