"use client";

import { useMemo, useState } from "react";
import { blogPosts } from "@/lib/mock-data";
import {
  claimPostForDemo,
  getDemoProgress,
  saveBlogDraftForDemo,
  submitBlogDraftForDemo,
} from "@/lib/gamification";

const emptyForm = {
  id: "",
  title: "",
  topic: "",
  summary: "",
  content: "",
};

export default function BlogPage() {
  const [progress, setProgress] = useState(() => getDemoProgress());
  const [form, setForm] = useState(emptyForm);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const latestDrafts = useMemo(() => progress.blogDrafts.slice(0, 4), [progress.blogDrafts]);

  async function handleSaveDraft() {
    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setStatusMessage("Completa al menos título, resumen y contenido para guardar el borrador.");
      return;
    }

    const result = saveBlogDraftForDemo({
      id: form.id || undefined,
      title: form.title.trim(),
      topic: form.topic.trim(),
      summary: form.summary.trim(),
      content: form.content.trim(),
      status: "draft",
    });

    setProgress(result.progress);
    setForm({ ...form, id: result.draft.id });
    setStatusMessage("Borrador guardado en tu perfil demo.");
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setStatusMessage("Antes de enviar a Bamboo completa título, resumen y contenido.");
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const saved = saveBlogDraftForDemo({
        id: form.id || undefined,
        title: form.title.trim(),
        topic: form.topic.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        status: "draft",
      });

      const response = await fetch("/api/blog/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          topic: form.topic.trim(),
          summary: form.summary.trim(),
          content: form.content.trim(),
          status: "submitted",
        }),
      });

      const data = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok || !data.ok) {
        setProgress(saved.progress);
        setStatusMessage(data.message || "No se pudo enviar el artículo a revisión.");
        return;
      }

      const next = submitBlogDraftForDemo(saved.draft.id, 20);
      setProgress(next);
      setForm(emptyForm);
      setStatusMessage(data.message || "Artículo enviado a Bamboo. Se guardó en tu perfil y sumaste +20 XP por enviarlo a revisión.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "No se pudo enviar el artículo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section">
      <div className="container two-col blog-layout">
        <section className="stack-lg">
          <div className="stack-sm">
            <span className="pill">Blog Bamboo</span>
            <h1>Escribir también suma</h1>
            <p className="muted body-relaxed max-copy">
              El blog convierte aprendizaje en criterio compartido. Publicar un artículo no solo suma
              XP: también visibiliza a quienes detectan oportunidades, extraen aprendizajes y ayudan
              a que otras personas del holding trabajen mejor.
            </p>
          </div>

          <div className="grid gap-md">
            {blogPosts.map((post) => {
              const claimed = progress.claimedPosts.includes(post.id);

              return (
                <article key={post.id} className="card panel stack-md">
                  <div className="row-between row-wrap gap-sm">
                    <span className="tag">{post.tag}</span>
                    <span className="tag">{post.status === "published" ? "Publicado" : "Borrador"}</span>
                  </div>

                  <div className="stack-sm">
                    <h3 className="title-tight">{post.title}</h3>
                    <p className="muted">{post.summary}</p>
                    <p className="body-relaxed">{post.excerpt}</p>
                  </div>

                  <div className="row-between row-wrap gap-sm">
                    <span>{post.author}</span>
                    <div className="row-wrap gap-sm">
                      <span className="pill">+{post.xp_reward} XP</span>
                      <button
                        className="btn btn-secondary"
                        disabled={claimed}
                        onClick={() => setProgress(claimPostForDemo(post.id, post.xp_reward))}
                      >
                        {claimed ? "Acreditado" : "Acreditar XP"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="card panel stack-md sticky-panel">
          <div className="stack-sm">
            <span className="pill">Nuevo artículo</span>
            <h2 className="title-tight">Guardar en perfil o enviar a Bamboo</h2>
            <p className="muted body-relaxed">
              Puedes guardar borradores en tu perfil y, cuando esté listo, enviarlo a revisión a Bamboo.
            </p>
          </div>

          <form className="form-stack" onSubmit={(event) => event.preventDefault()}>
            <input
              className="input"
              placeholder="Título del artículo"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
            <input
              className="input"
              placeholder="Tema o módulo relacionado"
              value={form.topic}
              onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}
            />
            <textarea
              className="textarea textarea-sm"
              placeholder="Resumen breve o aprendizaje principal"
              value={form.summary}
              onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            />
            <textarea
              className="textarea"
              placeholder="Desarrolla el contenido completo del artículo"
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            />

            <div className="row-wrap gap-sm">
              <button type="button" className="btn btn-secondary" onClick={handleSaveDraft}>
                Guardar borrador
              </button>
              <button type="button" className="btn btn-primary" disabled={submitting} onClick={handleSubmit}>
                {submitting ? "Enviando..." : "Enviar a Bamboo"}
              </button>
            </div>
          </form>

          {statusMessage ? <div className="alert info">{statusMessage}</div> : null}

          <div className="subpanel stack-sm">
            <strong>Estado editorial sugerido</strong>
            <div className="grid gap-sm">
              <div className="row-between row-wrap"><span>Borrador guardado</span><span className="tag">sin XP</span></div>
              <div className="row-between row-wrap"><span>Enviado a revisión</span><span className="tag">+20 XP</span></div>
              <div className="row-between row-wrap"><span>Publicado por Bamboo</span><span className="tag">+250 XP</span></div>
            </div>
          </div>

          <div className="subpanel stack-sm">
            <strong>Tus últimos borradores</strong>
            {latestDrafts.length ? (
              <ul className="list-clean compact-list">
                {latestDrafts.map((draft) => (
                  <li key={draft.id} className="item-row item-top">
                    <div className="grow stack-xs">
                      <strong>{draft.title}</strong>
                      <span className="muted">{draft.topic || "Sin tema"}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-compact"
                      onClick={() =>
                        setForm({
                          id: draft.id,
                          title: draft.title,
                          topic: draft.topic,
                          summary: draft.summary,
                          content: draft.content,
                        })
                      }
                    >
                      Editar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted body-relaxed">Todavía no guardaste borradores en esta demo.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
