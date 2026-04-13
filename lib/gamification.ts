import type { ModuleProgress, UserBlogDraft } from "@/lib/types";

export const LEVELS = [
  { level: 1, name: "Semilla", min: 0 },
  { level: 2, name: "Brote", min: 400 },
  { level: 3, name: "Bambú", min: 900 },
  { level: 4, name: "Explorador", min: 1500 },
  { level: 5, name: "Impulsor", min: 2300 },
  { level: 6, name: "Embajador", min: 3200 },
] as const;

export const XP_RULES = [
  { label: "Crear perfil", points: 20 },
  { label: "Completar una sección", points: 10 },
  { label: "Completar ejercicio", points: 20 },
  { label: "Responder quiz correctamente", points: 30 },
  { label: "Responder quiz", points: 10 },
  { label: "Completar módulo mensual", points: 40 },
  { label: "Asistir a taller", points: 120 },
  { label: "Asistir a curso", points: 150 },
  { label: "Participar en reto", points: 200 },
  { label: "Enviar artículo a revisión", points: 20 },
  { label: "Publicar artículo en el blog", points: 250 },
] as const;

export type DemoProgress = {
  points: number;
  completedModules: string[];
  claimedActivities: string[];
  claimedPosts: string[];
  moduleProgress: ModuleProgress[];
  blogDrafts: UserBlogDraft[];
};

const STORAGE_KEY = "bamboo-demo-progress";

function createInitialProgress(): DemoProgress {
  return {
    points: 940,
    completedModules: ["m1", "m2"],
    claimedActivities: [],
    claimedPosts: [],
    moduleProgress: [
      {
        moduleId: "m1",
        completedSections: [
          "La innovación no está lejos",
          "En una agencia, el valor se siente",
          "La invitación de Bamboo",
        ],
        exerciseCompleted: true,
        quizAnswered: true,
        quizCorrect: true,
        completed: true,
        earnedPoints: 120,
        lastFeedback: "Completaste este módulo y ya acreditaste todos los puntos.",
      },
      {
        moduleId: "m2",
        completedSections: [
          "Lo que ves como normal puede ser una oportunidad",
          "Pensar distinto también es una práctica",
          "Innovar mejora cómo se vive el trabajo",
        ],
        exerciseCompleted: true,
        quizAnswered: true,
        quizCorrect: true,
        completed: true,
        earnedPoints: 120,
        lastFeedback: "Completaste este módulo y ya acreditaste todos los puntos.",
      },
    ],
    blogDrafts: [],
  };
}

function ensureProgressShape(progress: Partial<DemoProgress>): DemoProgress {
  const initial = createInitialProgress();
  return {
    points: progress.points ?? initial.points,
    completedModules: progress.completedModules ?? initial.completedModules,
    claimedActivities: progress.claimedActivities ?? initial.claimedActivities,
    claimedPosts: progress.claimedPosts ?? initial.claimedPosts,
    moduleProgress: progress.moduleProgress ?? initial.moduleProgress,
    blogDrafts: progress.blogDrafts ?? initial.blogDrafts,
  };
}

export function getLevel(points: number) {
  return [...LEVELS].reverse().find((level) => points >= level.min) ?? LEVELS[0];
}

export function progressToNextLevel(points: number) {
  const current = getLevel(points);
  const next = LEVELS.find((level) => level.level === current.level + 1);

  if (!next) {
    return {
      current,
      nextLevelPoints: current.min,
      percent: 100,
    };
  }

  const span = next.min - current.min;
  const currentSpan = points - current.min;
  const percent = Math.max(0, Math.min(100, Math.round((currentSpan / span) * 100)));

  return {
    current,
    nextLevelPoints: next.min,
    percent,
  };
}

export function getDemoProgress(): DemoProgress {
  if (typeof window === "undefined") {
    return createInitialProgress();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = createInitialProgress();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return ensureProgressShape(JSON.parse(raw) as DemoProgress);
  } catch {
    const fallback = createInitialProgress();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function saveDemoProgress(progress: DemoProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetDemoProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function upsertModuleProgress(progress: DemoProgress, updatedModule: ModuleProgress) {
  return progress.moduleProgress.some((module) => module.moduleId === updatedModule.moduleId)
    ? progress.moduleProgress.map((module) =>
        module.moduleId === updatedModule.moduleId ? updatedModule : module,
      )
    : [...progress.moduleProgress, updatedModule];
}

function getModuleProgress(progress: DemoProgress, moduleId: string): ModuleProgress | undefined {
  return progress.moduleProgress.find((module) => module.moduleId === moduleId);
}

export function completeSectionForDemo(moduleId: string, sectionHeading: string, xpReward = 10) {
  const progress = getDemoProgress();
  const current = getModuleProgress(progress, moduleId);

  if (current?.completedSections.includes(sectionHeading)) {
    return progress;
  }

  const updatedModule: ModuleProgress = {
    moduleId,
    completedSections: [...(current?.completedSections ?? []), sectionHeading],
    exerciseCompleted: current?.exerciseCompleted ?? false,
    quizAnswered: current?.quizAnswered ?? false,
    quizCorrect: current?.quizCorrect ?? false,
    completed: current?.completed ?? false,
    earnedPoints: (current?.earnedPoints ?? 0) + xpReward,
    lastFeedback: `+${xpReward} XP por completar la sección “${sectionHeading}”.`,
  };

  const next = {
    ...progress,
    points: progress.points + xpReward,
    moduleProgress: upsertModuleProgress(progress, updatedModule),
  };

  saveDemoProgress(next);
  return next;
}

export function completeExerciseForDemo(moduleId: string, xpReward = 20) {
  const progress = getDemoProgress();
  const current = getModuleProgress(progress, moduleId);

  if (current?.exerciseCompleted) {
    return progress;
  }

  const updatedModule: ModuleProgress = {
    moduleId,
    completedSections: current?.completedSections ?? [],
    exerciseCompleted: true,
    quizAnswered: current?.quizAnswered ?? false,
    quizCorrect: current?.quizCorrect ?? false,
    completed: current?.completed ?? false,
    earnedPoints: (current?.earnedPoints ?? 0) + xpReward,
    lastFeedback: `+${xpReward} XP por completar el ejercicio práctico.`,
  };

  const next = {
    ...progress,
    points: progress.points + xpReward,
    moduleProgress: upsertModuleProgress(progress, updatedModule),
  };

  saveDemoProgress(next);
  return next;
}

export function answerQuizForDemo(moduleId: string, isCorrect: boolean) {
  const progress = getDemoProgress();
  const current = getModuleProgress(progress, moduleId);

  if (current?.quizAnswered) {
    return progress;
  }

  const xpReward = isCorrect ? 30 : 10;
  const updatedModule: ModuleProgress = {
    moduleId,
    completedSections: current?.completedSections ?? [],
    exerciseCompleted: current?.exerciseCompleted ?? false,
    quizAnswered: true,
    quizCorrect: isCorrect,
    completed: current?.completed ?? false,
    earnedPoints: (current?.earnedPoints ?? 0) + xpReward,
    lastFeedback: isCorrect
      ? `+${xpReward} XP. Respuesta correcta.`
      : `+${xpReward} XP por intentarlo. Revisa la explicación y seguí avanzando.`,
  };

  const next = {
    ...progress,
    points: progress.points + xpReward,
    moduleProgress: upsertModuleProgress(progress, updatedModule),
  };

  saveDemoProgress(next);
  return next;
}

export function finalizeModuleForDemo(moduleId: string, completionBonus = 40) {
  const progress = getDemoProgress();
  const current = getModuleProgress(progress, moduleId);

  if (!current || current.completed) {
    return progress;
  }

  if (!current.exerciseCompleted || !current.quizAnswered) {
    return progress;
  }

  const updatedModule: ModuleProgress = {
    ...current,
    completed: true,
    earnedPoints: current.earnedPoints + completionBonus,
    lastFeedback: `+${completionBonus} XP por finalizar el módulo.`,
  };

  const next = {
    ...progress,
    points: progress.points + completionBonus,
    completedModules: progress.completedModules.includes(moduleId)
      ? progress.completedModules
      : [...progress.completedModules, moduleId],
    moduleProgress: upsertModuleProgress(progress, updatedModule),
  };

  saveDemoProgress(next);
  return next;
}

export function claimActivityForDemo(activityId: string, xpReward: number) {
  const progress = getDemoProgress();

  if (progress.claimedActivities.includes(activityId)) {
    return progress;
  }

  const next = {
    ...progress,
    points: progress.points + xpReward,
    claimedActivities: [...progress.claimedActivities, activityId],
  };

  saveDemoProgress(next);
  return next;
}

export function claimPostForDemo(postId: string, xpReward: number) {
  const progress = getDemoProgress();

  if (progress.claimedPosts.includes(postId)) {
    return progress;
  }

  const next = {
    ...progress,
    points: progress.points + xpReward,
    claimedPosts: [...progress.claimedPosts, postId],
  };

  saveDemoProgress(next);
  return next;
}

export function saveBlogDraftForDemo(draft: {
  id?: string;
  title: string;
  topic: string;
  summary: string;
  content: string;
  status?: UserBlogDraft["status"];
}) {
  const progress = getDemoProgress();
  const now = new Date().toISOString();
  const id = draft.id ?? `draft-${Date.now()}`;

  const nextDraft: UserBlogDraft = {
    id,
    title: draft.title,
    topic: draft.topic,
    summary: draft.summary,
    content: draft.content,
    status: draft.status ?? "draft",
    created_at: progress.blogDrafts.find((item) => item.id === id)?.created_at ?? now,
    updated_at: now,
  };

  const next = {
    ...progress,
    blogDrafts: progress.blogDrafts.some((item) => item.id === id)
      ? progress.blogDrafts.map((item) => (item.id === id ? nextDraft : item))
      : [nextDraft, ...progress.blogDrafts],
  };

  saveDemoProgress(next);
  return { progress: next, draft: nextDraft };
}

export function submitBlogDraftForDemo(draftId: string, xpReward = 20) {
  const progress = getDemoProgress();
  const draft = progress.blogDrafts.find((item) => item.id === draftId);

  if (!draft || draft.status === "submitted") {
    return progress;
  }

  const next: DemoProgress = {
    ...progress,
    points: progress.points + xpReward,
    blogDrafts: progress.blogDrafts.map((item) =>
      item.id === draftId
        ? { ...item, status: "submitted" as const, updated_at: new Date().toISOString() }
        : item,
    ),
  };

  saveDemoProgress(next);
  return next;
}
