import { NextResponse } from "next/server";
import type { ClubSignupPayload } from "@/lib/types";

function validatePayload(payload: Partial<ClubSignupPayload>) {
  const requiredFields: Array<keyof ClubSignupPayload> = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "agency",
    "area",
  ];

  const labels: Record<keyof ClubSignupPayload, string> = {
    firstName: "nombre",
    lastName: "apellido",
    email: "email",
    phone: "teléfono",
    agency: "agencia",
    area: "área",
  };

  for (const field of requiredFields) {
    if (!payload[field] || !String(payload[field]).trim()) {
      return `Falta completar el campo ${labels[field]}.`;
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ClubSignupPayload>;
    const validationError = validatePayload(body);

    if (validationError) {
      return NextResponse.json({ ok: false, message: validationError }, { status: 400 });
    }

    const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!endpoint) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Falta configurar GOOGLE_APPS_SCRIPT_URL en las variables de entorno del proyecto.",
        },
        { status: 503 },
      );
    }

    const payload = {
      nombre: String(body.firstName).trim(),
      apellido: String(body.lastName).trim(),
      email: String(body.email).trim(),
      telefono: String(body.phone).trim(),
      agencia: String(body.agency).trim(),
      area: String(body.area).trim(),
    };

    const upstreamResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: `Apps Script respondió con error: ${text || upstreamResponse.statusText}`,
        },
        { status: 502 },
      );
    }

    let upstream: unknown = text;

    try {
      upstream = JSON.parse(text);
    } catch {
      upstream = { status: "success", message: text || "Inscripción enviada correctamente." };
    }

    return NextResponse.json({
      ok: true,
      message: "Inscripción enviada correctamente.",
      upstream,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "No se pudo enviar la inscripción.",
      },
      { status: 500 },
    );
  }
}
