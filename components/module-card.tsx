"use client";

import { useMemo, useState } from "react";
import type { DemoProgress } from "@/lib/gamification";
import {
  answerQuizForDemo,
  completeExerciseForDemo,
  completeSectionForDemo,
  finalizeModuleForDemo,
} from "@/lib/gamification";
import type { Module } from "@/lib/types";

export function ModuleCard({
  module,
  progress,
  onProgressChange,
}: {
  module: Module;
  progress: DemoProgress;
  onProgressChange: (next: DemoProgress) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const moduleProgress = progress.moduleProgress.find((item) => item.moduleId === module.id);
  const completedSections = moduleProgress?.completedSections ?? [];
  const exerciseCompleted = moduleProgress?.exerciseCompleted ?? false;
  const quizAnswered = moduleProgress?.quizAnswered ?? false;
  const quizCorrect = moduleProgress?.quizCorrect ?? false;
  const moduleCompleted = moduleProgress?.completed ?? progress.completedModules.includes(module.id);
  const totalSteps = module.sections.length + 2;
  const currentSteps =
    completedSections.length +
    (exerciseCompleted ? 1 : 0) +
    (quizAnswered ? 1 : 0);
  const progressPercent = Math.round((currentSteps / totalSteps) * 100);

  const moduleState = useMemo(() => {
    if (moduleCompleted) return "Completado";
    if (currentSteps > 0) return "En progreso";
    return module.status === "locked" ? "Bloqueado" : "Disponible";
  }, [currentSteps, module.status, moduleCompleted]);

  return (
    <article className="card module-card">
      <div className="row-wrap row-between">
        <div className="row-wrap gap-sm">
          <span className="tag">{module.theme}</span>
          <span className="tag">{module.month}</span>
          <span className="tag">Nivel {module.level_required}</span>
        </div>
        <span className="pill">+{moduleProgress?.earnedPoints ?? 0} XP ganados</span>
      </div>

      <div className="stack-sm">
        <h3 className="title-tight">{module.title}</h3>
        <p className="muted body-relaxed">{module.description}</p>
        <p className="body-relaxed">{module.opening}</p>
      </div>

      <div className="subpanel stack-sm">
        <div className="row-between row-wrap">
          <strong>Progreso del módulo</strong>
          <span className="muted">{progressPercent}%</span>
        </div>
        <div className="progress">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="row-wrap gap-sm">
          <span className="pill">{module.lessons} lecciones</span>
          <span className="pill">Meta +{module.xp_reward} XP</span>
          <span className="pill">Estado: {moduleState}</span>
        </div>
        {moduleProgress?.lastFeedback ? <div className="alert success">{moduleProgress.lastFeedback}</div> : null}
      </div>

      <div className="grid gap-md">
        {module.sections.map((section) => {
          const done = completedSections.includes(section.heading);

          return (
            <div key={section.heading} className="subpanel stack-sm">
              <strong>{section.heading}</strong>
              <p className="muted body-relaxed">{section.body}</p>
              <button
                className="btn btn-secondary"
                disabled={done}
                onClick={() => onProgressChange(completeSectionForDemo(module.id, section.heading, 10))}
              >
                {done ? "Leída" : "Marcar como leída (+10 XP)"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="subpanel stack-sm">
        <strong>Ejercicio práctico</strong>
        <p className="body-relaxed">{module.exercise}</p>
        <button
          className="btn btn-secondary"
          disabled={exerciseCompleted}
          onClick={() => onProgressChange(completeExerciseForDemo(module.id, 20))}
        >
          {exerciseCompleted ? "Ejercicio completado" : "Completar ejercicio (+20 XP)"}
        </button>
      </div>

      <div className="subpanel stack-sm">
        <strong>Chequeo de aprendizaje</strong>
        <p className="body-relaxed">{module.quiz.question}</p>

        <div className="answer-grid">
          {module.quiz.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = quizAnswered && index === module.quiz.correct;
            const isWrongSelected = quizAnswered && isSelected && index !== module.quiz.correct;

            return (
              <button
                key={option}
                type="button"
                className={`answer-option${isSelected ? " selected" : ""}${isCorrectOption ? " correct" : ""}${isWrongSelected ? " wrong" : ""}`}
                disabled={quizAnswered}
                onClick={() => setSelectedAnswer(index)}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="row-wrap gap-sm">
          <button
            className="btn btn-primary"
            disabled={quizAnswered || selectedAnswer === null}
            onClick={() => onProgressChange(answerQuizForDemo(module.id, selectedAnswer === module.quiz.correct))}
          >
            Responder quiz
          </button>
          {quizAnswered ? (
            <span className={`pill ${quizCorrect ? "pill-success" : "pill-warning"}`}>
              {quizCorrect ? "Respuesta correcta" : "Revisá la explicación"}
            </span>
          ) : null}
        </div>

        {quizAnswered ? <div className="alert info">{module.quiz.explanation}</div> : null}
      </div>

      <div className="subpanel accent-panel stack-sm">
        <strong>Idea fuerza</strong>
        <p className="body-relaxed">{module.takeaway}</p>
      </div>

      <div className="row-between row-wrap gap-sm">
        <div className="muted">
          Para finalizar el módulo necesitás completar el ejercicio y responder el quiz.
        </div>
        <button
          className="btn btn-primary"
          disabled={moduleCompleted || !exerciseCompleted || !quizAnswered}
          onClick={() => onProgressChange(finalizeModuleForDemo(module.id, 40))}
        >
          {moduleCompleted ? "Módulo completado" : "Finalizar módulo (+40 XP)"}
        </button>
      </div>
    </article>
  );
}
