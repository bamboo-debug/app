import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { BlogSubmissionPayload } from "@/lib/types";

function validatePayload(payload: Partial<BlogSubmissionPayload>) {
  if (!payload.title?.trim()) return "Falta el título del artículo.";
  if (!payload.summary?.trim()) return "Falta el resumen del artículo.";
  if (!payload.content?.trim()) return "Falta el contenido del artículo.";
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BlogSubmissionPayload>;
    const validationError = validatePayload(body);

    if (validationError) {
      return NextResponse.json({ ok: false, message: validationError }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({
        ok: true,
        message:
          "Borrador válido. Para guardarlo en Supabase en producción configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.",
      });
    }

    const { error } = await supabase.from("blog_submissions").insert({
      title: body.title?.trim(),
      topic: body.topic?.trim() || null,
      summary: body.summary?.trim(),
      content: body.content?.trim(),
      status: "draft",
    });

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Borrador guardado en Supabase." });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar el borrador." },
      { status: 500 },
    );
  }
}
