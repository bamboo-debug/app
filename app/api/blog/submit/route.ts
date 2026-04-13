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

    const title = body.title?.trim() || "";
    const topic = body.topic?.trim() || "";
    const summary = body.summary?.trim() || "";
    const content = body.content?.trim() || "";

    const supabase = getSupabaseAdminClient();
    let savedToSupabase = false;

    if (supabase) {
      const { error } = await supabase.from("blog_submissions").insert({
        title,
        topic: topic || null,
        summary,
        content,
        status: "submitted",
      });

      if (error) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
      }

      savedToSupabase = true;
    }

    const webhook = process.env.BLOG_REVIEW_WEBHOOK_URL;
    let sentToBamboo = false;

    if (webhook) {
      const upstream = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destino: "bamboo@texo.com.py",
          titulo: title,
          tema: topic,
          resumen: summary,
          contenido: content,
        }),
        cache: "no-store",
      });

      if (!upstream.ok) {
        const details = await upstream.text();
        return NextResponse.json(
          {
            ok: false,
            message: `No se pudo notificar a Bamboo: ${details || upstream.statusText}`,
          },
          { status: 502 },
        );
      }

      sentToBamboo = true;
    }

    if (savedToSupabase && sentToBamboo) {
      return NextResponse.json({
        ok: true,
        message: "Artículo enviado a Bamboo y guardado en Supabase. También sumaste +20 XP en la demo.",
      });
    }

    if (savedToSupabase) {
      return NextResponse.json({
        ok: true,
        message:
          "Artículo enviado a revisión y guardado en Supabase. Solo falta configurar BLOG_REVIEW_WEBHOOK_URL para reenviarlo a bamboo@texo.com.py.",
      });
    }

    return NextResponse.json({
      ok: true,
      message:
        "Artículo registrado en modo demo. Para producción configura Supabase y BLOG_REVIEW_WEBHOOK_URL para enviarlo a bamboo@texo.com.py.",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "No se pudo enviar el artículo." },
      { status: 500 },
    );
  }
}
