"use client";

import { useState } from "react";
import { blogPosts } from "@/lib/mock-data";
import { claimPostForDemo, getDemoProgress } from "@/lib/gamification";

export default function BlogPage() {
  const [progress, setProgress] = useState(() => getDemoProgress());

  return (
    <main className="section">
      <div className="container two-col">
        <section>
          <span className="pill">Blog Bamboo</span>
          <h1>Escribir también suma</h1>
          <p className="muted" style={{ lineHeight: 1.8 }}>
            El blog convierte aprendizaje en criterio compartido. Publicar un artículo no solo suma
            XP: también visibiliza a quienes detectan oportunidades, extraen aprendizajes y ayudan
            a que otras personas del holding trabajen mejor.
          </p>

          <div className="grid" style={{ marginTop: 24 }}>
            {blogPosts.map((post) => {
              const claimed = progress.claimedPosts.includes(post.id);

              return (
                <article key={post.id} className="card panel">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="tag">{post.tag}</span>
                    <span className="tag">{post.status === "published" ? "Publicado" : "Borrador"}</span>
                  </div>

                  <h3>{post.title}</h3>
                  <p className="muted">{post.summary}</p>
                  <p style={{ lineHeight: 1.7 }}>{post.excerpt}</p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>{post.author}</span>

                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span className="pill">+{post.xp_reward} XP</span>
                      <button
                        className="btn btn-secondary"
                        disabled={claimed}
                        onClick={() => {
                          const next = claimPostForDemo(post.id, post.xp_reward);
                          setProgress(next);
                        }}
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

        <aside className="card panel">
          <h2 style={{ marginTop: 0 }}>Enviar nuevo artículo</h2>
          <form className="form-stack">
            <input className="input" placeholder="Título del artículo" />
            <input className="input" placeholder="Tema o módulo relacionado" />
            <textarea className="textarea" placeholder="Resumen breve o aprendizaje principal" />
            <button type="button" className="btn btn-primary">
              Guardar borrador
            </button>
          </form>

          <p className="muted" style={{ marginBottom: 0, lineHeight: 1.7 }}>
            En la siguiente fase, este formulario puede conectarse a Supabase para guardar
            borradores, enviarlos a revisión editorial y premiar la publicación automáticamente.
          </p>
        </aside>
      </div>
    </main>
  );
}
