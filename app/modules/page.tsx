"use client";

import { useMemo, useState } from "react";
import { ModuleCard } from "@/components/module-card";
import { getDemoProgress } from "@/lib/gamification";
import { modules } from "@/lib/mock-data";

export default function ModulesPage() {
  const [progress, setProgress] = useState(() => getDemoProgress());

  const completedCount = useMemo(() => progress.completedModules.length, [progress.completedModules]);
  const inProgressCount = useMemo(
    () => progress.moduleProgress.filter((module) => !module.completed).length,
    [progress.moduleProgress],
  );

  return (
    <main className="section">
      <div className="container stack-lg">
        <div className="hero-copy stack-sm">
          <span className="pill">Ruta de aprendizaje</span>
          <h1>Módulos Bamboo</h1>
          <p className="muted body-relaxed max-copy">
            Diseñados para cualquier área de una agencia. El objetivo no es solo enseñar conceptos,
            sino empujar a que cada persona gane más criterio, más valentía y más capacidad de mover
            ideas hacia adelante.
          </p>
        </div>

        <div className="grid three-up">
          <div className="card panel stack-sm">
            <strong>XP acumulados</strong>
            <span className="metric">{progress.points}</span>
            <span className="muted">Puntaje vivo en tiempo real</span>
          </div>
          <div className="card panel stack-sm">
            <strong>Módulos completados</strong>
            <span className="metric">{completedCount}</span>
            <span className="muted">de {modules.length} módulos</span>
          </div>
          <div className="card panel stack-sm">
            <strong>Módulos en progreso</strong>
            <span className="metric">{inProgressCount}</span>
            <span className="muted">avance por respuestas y ejercicios</span>
          </div>
        </div>

        <div className="module-track">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={{
                ...module,
                status: progress.completedModules.includes(module.id) ? "completed" : module.status,
              }}
              progress={progress}
              onProgressChange={setProgress}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
