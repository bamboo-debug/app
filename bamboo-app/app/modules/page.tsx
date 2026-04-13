"use client";

import { useMemo, useState } from "react";
import { ModuleCard } from "@/components/module-card";
import { modules } from "@/lib/mock-data";
import { completeModuleForDemo, getDemoProgress } from "@/lib/gamification";

export default function ModulesPage() {
  const [progress, setProgress] = useState(() => getDemoProgress());

  const completedCount = useMemo(() => progress.completedModules.length, [progress.completedModules]);

  return (
    <main className="section">
      <div className="container">
        <span className="pill">Ruta de aprendizaje</span>
        <h1>Módulos Bamboo</h1>
        <p className="muted" style={{ lineHeight: 1.8 }}>
          Diseñados para cualquier área de una agencia. El objetivo no es solo enseñar conceptos,
          sino empujar a que cada persona gane más criterio, más valentía y más capacidad de mover
          ideas hacia adelante.
        </p>

        <div className="card panel" style={{ marginTop: 24 }}>
          <strong>Progreso demo</strong>
          <p className="muted" style={{ marginBottom: 0 }}>
            {completedCount} módulos completados · {progress.points} XP acumulados
          </p>
        </div>

        <div className="module-track" style={{ marginTop: 28 }}>
          {modules.map((module) => {
            const isCompleted = progress.completedModules.includes(module.id);

            return (
              <div key={module.id} style={{ display: "grid", gap: 14 }}>
                <ModuleCard module={{ ...module, status: isCompleted ? "completed" : module.status }} />

                <div className="card panel" style={{ paddingTop: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <strong>{isCompleted ? "Ya completaste este módulo" : "Listo para sumar XP"}</strong>
                      <div className="muted">
                        {isCompleted
                          ? `Este módulo ya te acreditó +${module.xp_reward} XP`
                          : `Completarlo acredita +${module.xp_reward} XP en la demo`}
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      disabled={isCompleted}
                      onClick={() => {
                        const next = completeModuleForDemo(module.id, module.xp_reward);
                        setProgress(next);
                      }}
                    >
                      {isCompleted ? "Completado" : "Completar módulo"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
