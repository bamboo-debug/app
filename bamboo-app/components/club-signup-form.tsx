"use client";

import { useState } from "react";
import type { ClubSignupPayload } from "@/lib/types";

const AGENCIES = ["Lupe", "Texo", "Omd", "Roger", "Nasta", "Brick", "ROW"];
const AREAS = [
  "Creatividad",
  "Cuentas",
  "Estrategia",
  "Medios",
  "Producción",
  "Social Media",
  "Data",
  "Administración",
  "People & Cultura",
];

const initialState: ClubSignupPayload = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  agency: "",
  area: "",
};

export function ClubSignupForm() {
  const [form, setForm] = useState<ClubSignupPayload>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  function updateField<K extends keyof ClubSignupPayload>(key: K, value: ClubSignupPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/club-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        upstream?: { status?: string; message?: string };
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "No se pudo enviar la inscripción.");
      }

      if (data.upstream?.status === "duplicate") {
        setMessage(data.upstream.message || "Este email ya está registrado en Bamboo.");
        setMessageType("error");
        return;
      }

      setMessage("Tu inscripción fue enviada correctamente. Bienvenido a Bamboo 🌱");
      setMessageType("success");
      setForm(initialState);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo completar la inscripción.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card panel form-stack">
      <div className="grid two-up">
        <label className="field">
          <span>Nombre</span>
          <input
            className="input"
            value={form.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Apellido</span>
          <input
            className="input"
            value={form.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            required
          />
        </label>
      </div>

      <label className="field">
        <span>Mail</span>
        <input
          className="input"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          required
        />
      </label>

      <label className="field">
        <span>Número de teléfono</span>
        <input
          className="input"
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          required
        />
      </label>

      <label className="field">
        <span>Agencia</span>
        <input
          className="input"
          list="agency-options"
          placeholder="Elegí o escribí tu agencia"
          value={form.agency}
          onChange={(e) => updateField("agency", e.target.value)}
          required
        />
        <datalist id="agency-options">
          {AGENCIES.map((agency) => (
            <option key={agency} value={agency} />
          ))}
          <option value="Otro" />
        </datalist>
      </label>

      <label className="field">
        <span>Área</span>
        <input
          className="input"
          list="area-options"
          placeholder="Elegí o escribí tu área"
          value={form.area}
          onChange={(e) => updateField("area", e.target.value)}
          required
        />
        <datalist id="area-options">
          {AREAS.map((area) => (
            <option key={area} value={area} />
          ))}
        </datalist>
      </label>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Quiero sumarme al club"}
      </button>

      <p className="muted" style={{ margin: 0 }}>
        Tip: si alguien escribe una agencia que no está en la lista, igual se envía. Así cubrís
        “Otro” sin perder autocompletado.
      </p>

      {message ? (
        <div
          className="subpanel"
          style={{
            borderColor: messageType === "error" ? "rgba(220,38,38,.25)" : "rgba(22,163,74,.25)",
          }}
        >
          {message}
        </div>
      ) : null}
    </form>
  );
}
