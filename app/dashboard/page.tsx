"use client";

import Link from "next/link";
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
  const nextModuleProgress = progress.moduleProgress.find((module) => module.moduleId === nextModule?.id);
  const nextModuleSteps = nextModule
    ? nextModule.sections.length + 2
    : 0;
  const nextModuleCurrentSteps = nextModuleProgress
    ? nextModuleProgress.completedSections.length +
      (nextModuleProgress.exerciseCompleted ? 1 : 0) +
      (nextModuleProgress.quizAnswered ? 1 : 0)
    : 0;
  const nextModulePercent = nextModuleSteps
    ? Math.round((nextModuleCurrentSteps / nextModuleSteps) * 100)
    : 100;

  const editorialCount = progress.blogDrafts.length + progress.claimedPosts.length + 1;

  return (
    <main className="section">
      <div className="container dashboard-grid">
        <section className="grid gap-lg">
          <div className="card panel accent-panel stack-sm">
            <span className="pill">Hola, {demoProfile.full_name}</span>
            <h1 className="title-tight">{welcomeMessage.title}</h1>
            <p className="body-relaxed">
              Bamboo combina aprendizaje continuo, retos concretos y visibilidad del progreso para
              que cada persona crezca con más confianza, más criterio y más impacto en cualquier
              área de agencia.
            </p>
          </div>

          <div className="card panel stack-md">
            <div className="row-between row-wrap">
              <h2 className="title-tight">Tu progreso en Bamboo</h2>
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

            <div className="row-gap-lg row-start">
              <div className="level-badge">{level.level}</div>
              <div className="stack-sm grow">
                <strong className="text-lg">{level.name}</strong>
                <div className="muted">
                  {progress.points} XP acumulados · Próximo nivel en {nextLevel.nextLevelPoints} XP
                </div>
                <div className="progress">
                  <span style={{ width: `${nextLevel.percent}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid three-up">
            <StatCard label="Racha" value={`${demoProfile.streak_days} días`} hint="Mantén actividad mensual" />
            <StatCard
              label="Módulos completados"
              value={`${progress.completedModules.length}/${modules.length}`}
              hint="Ruta inicial Bamboo"
            />
            <StatCard
              label="Actividad editorial"
              value={String(editorialCount)}
              hint="Borradores, envíos y publicaciones"
            />
          </div>

          <div className="card panel stack-md">
            <h2 className="title-tight">Actividades del mes</h2>

            <ul className="list-clean">
              {activities.map((activity) => {
                const claimed = progress.claimedActivities.includes(activity.id);

                return (
                  <li key={activity.id} className="item-row item-top">
                    <div className="grow stack-xs">
                      <strong>{activity.title}</strong>
                      <div className="muted">
                        {activity.date_label} · {activity.category}
                      </div>
                      <div className="muted">{activity.description}</div>
                    </div>

                    <div className="stack-xs align-end">
                      <span className="pill">+{activity.xp_reward} XP</span>
                      <button
                        className="btn btn-secondary"
                        disabled={claimed}
                        onClick={() => setProgress(claimActivityForDemo(activity.id, activity.xp_reward))}
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

        <section className="grid gap-lg">
          <div className="card panel stack-md accent-panel">
            <span className="pill">Tu siguiente paso</span>
            {nextModule ? (
              <>
                <h2 className="title-tight">{nextModule.title}</h2>
                <p className="muted body-relaxed">{nextModule.description}</p>
                <div className="progress">
                  <span style={{ width: `${nextModulePercent}%` }} />
                </div>
                <div className="muted">Avance actual: {nextModulePercent}%</div>
                <p className="body-relaxed">{nextModule.takeaway}</p>
                <Link href="/modules" className="btn btn-primary">
                  Continuar módulo
                </Link>
              </>
            ) : (
              <>
                <h2 className="title-tight">Ruta inicial completada</h2>
                <p className="muted body-relaxed">
                  Ya recorriste todos los módulos de esta primera etapa. El siguiente paso es seguir
                  sumando puntos con actividades, retos y blog.
                </p>
              </>
            )}
          </div>

          <div className="card panel stack-md">
            <h2 className="title-tight">Tu actividad editorial</h2>

            <ul className="list-clean">
              {blogPosts.map((post) => {
                const claimed = progress.claimedPosts.includes(post.id);

                return (
                  <li key={post.id} className="item-row item-top">
                    <div className="grow stack-xs">
                      <strong>{post.title}</strong>
                      <div className="muted">
                        {post.status === "published" ? "Publicado" : "Borrador"} · {post.tag}
                      </div>
                      <div className="muted">{post.summary}</div>
                    </div>

                    <div className="stack-xs align-end">
                      <span className="pill">+{post.xp_reward} XP</span>
                      <button
                        className="btn btn-secondary"
                        disabled={claimed}
                        onClick={() => setProgress(claimPostForDemo(post.id, post.xp_reward))}
                      >
                        {claimed ? "Acreditado" : "Acreditar"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card panel stack-md">
            <h2 className="title-tight">Borradores guardados</h2>
            {progress.blogDrafts.length ? (
              <ul className="list-clean">
                {progress.blogDrafts.slice(0, 3).map((draft) => (
                  <li key={draft.id} className="item-row item-top">
                    <div className="grow stack-xs">
                      <strong>{draft.title}</strong>
                      <div className="muted">{draft.topic || "Sin tema definido"}</div>
                    </div>
                    <span className="tag">
                      {draft.status === "submitted" ? "En revisión" : "Borrador"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted body-relaxed">
                Todavía no guardaste artículos. Usa el blog para escribir, guardar y enviar a Bamboo.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
