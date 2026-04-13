"use client";

import { useMemo, useState } from "react";
import { StatCard } from "@/components/stat-card";
import { activities, blogPosts, demoProfile, modules, welcomeMessage } from "@/lib/mock-data";
import {
  claimActivityForDemo,
  claimPostForDemo,
  getDemoProgress,
  getLevel,
  progressToNextLevel,
  resetDemoProgress,
} from "@/lib/gamification";

export default function DashboardPage() {
  const [progress, setProgress] = useState(() => getDemoProgress());

  const level = useMemo(() => getLevel(progress.points), [progress.points]);
  const nextLevel = useMemo(() => progressToNextLevel(progress.points), [progress.points]);

  const nextModule = modules.find((module) => !progress.completedModules.includes(module.id));

  const publishedCount = progress.claimedPosts.length + 1;

  return (
    <main className="section">
      <div className="container dashboard-grid">
        <section className="grid">
          <div className="card panel accent-panel">
            <span className="pill">Hola, {demoProfile.full_name}</span>
            <h1 style={{ marginBottom: 10 }}>{welcomeMessage.title}</h1>
            <p style={{ lineHeight: 1.8, marginBottom: 0 }}>
              Bamboo combina aprendizaje continuo, retos concretos y visibilidad del progreso para
              que cada persona crezca con más confianza, más criterio y más impacto en cualquier
              área de agencia.
            </p>
          </div>

          <div className="card panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 14,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>Tu progreso en Bamboo</h2>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  resetDemoProgress();
                  setProgress(getDemoProgress());
                }}
              >
                Reiniciar demo
              </button>
            </div>

            <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 18 }}>
              <div className="level-badge">{level.level}</div>

              <div style={{ flex: 1 }}>
                <strong style={{ display: "block", fontSize: "1.1rem" }}>{level.name}</strong>
                <div className="muted" style={{ marginBottom: 10 }}>
                  {progress.points} XP acumulados · Próximo nivel en {nextLevel.nextLevelPoints} XP
                </div>
                <div className="progress">
                  <span style={{ width: `${nextLevel.percent}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid three-up">
            <StatCard
              label="Racha"
              value={`${demoProfile.streak_days} días`}
              hint="Mantén actividad mensual"
            />
            <StatCard
              label="Módulos completados"
              value={`${progress.completedModules.length}/${modules.length}`}
              hint="Ruta inicial Bamboo"
            />
            <StatCard
              label="Artículos publicados"
              value={String(publishedCount)}
              hint="Escribir también acelera tu crecimiento"
            />
          </div>

          <div className="card panel">
            <h2 style={{ marginTop: 0 }}>Actividades del mes</h2>

            <ul className="list-clean">
              {activities.map((activity) => {
                const claimed = progress.claimedActivities.includes(activity.id);

                return (
                  <li key={activity.id} className="item-row" style={{ alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <strong>{activity.title}</strong>
                      <div className="muted">
                        {activity.date_label} · {activity.category}
                      </div>
                      <div className="muted" style={{ marginTop: 6 }}>
                        {activity.description}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                      <span className="pill">+{activity.xp_reward} XP</span>
                      <button
                        className="btn btn-secondary"
                        disabled={claimed}
                        onClick={() => {
                          const next = claimActivityForDemo(activity.id, activity.xp_reward);
                          setProgress(next);
                        }}
                      >
                        {claimed ? "Reclamado" : "Sumar puntos"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="grid">
          <div className="card panel">
            <h2 style={{ marginTop: 0 }}>Siguiente módulo recomendado</h2>

            {nextModule ? (
              <>
                <strong>{nextModule.title}</strong>
                <p className="muted" style={{ lineHeight: 1.7 }}>
                  {nextModule.description}
                </p>
                <p style={{ lineHeight: 1.7 }}>{nextModule.takeaway}</p>
                <a href="/modules" className="btn btn-primary">
                  Continuar
                </a>
              </>
            ) : (
              <>
                <strong>Ruta inicial completada</strong>
                <p className="muted" style={{ lineHeight: 1.7 }}>
                  Ya recorriste todos los módulos de esta primera etapa. El siguiente paso es seguir
                  sumando puntos con actividades, retos y blog.
                </p>
              </>
            )}
          </div>

          <div className="card panel">
            <h2 style={{ marginTop: 0 }}>Tu actividad editorial</h2>

            <ul className="list-clean">
              {blogPosts.map((post) => {
                const claimed = progress.claimedPosts.includes(post.id);

                return (
                  <li key={post.id} className="item-row" style={{ alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <strong>{post.title}</strong>
                      <div className="muted">
                        {post.status === "published" ? "Publicado" : "Borrador"} · {post.tag}
                      </div>
                      <div className="muted" style={{ marginTop: 6 }}>
                        {post.summary}
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                      <span className="pill">+{post.xp_reward} XP</span>
                      <button
                        className="btn btn-secondary"
                        disabled={claimed}
                        onClick={() => {
                          const next = claimPostForDemo(post.id, post.xp_reward);
                          setProgress(next);
                        }}
                      >
                        {claimed ? "Acreditado" : "Acreditar"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
