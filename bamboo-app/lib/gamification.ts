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
  { label: "Completar una lección", points: 50 },
  { label: "Aprobar quiz", points: 30 },
  { label: "Completar módulo mensual", points: 100 },
  { label: "Asistir a taller", points: 120 },
  { label: "Asistir a curso", points: 150 },
  { label: "Participar en reto", points: 200 },
  { label: "Publicar artículo en el blog", points: 250 },
] as const;

export type DemoProgress = {
  points: number;
  completedModules: string[];
  claimedActivities: string[];
  claimedPosts: string[];
};

const STORAGE_KEY = "bamboo-demo-progress";

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
    return {
      points: 940,
      completedModules: ["m1", "m2"],
      claimedActivities: [],
      claimedPosts: [],
    };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial: DemoProgress = {
      points: 940,
      completedModules: ["m1", "m2"],
      claimedActivities: [],
      claimedPosts: [],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(raw) as DemoProgress;
  } catch {
    const fallback: DemoProgress = {
      points: 940,
      completedModules: ["m1", "m2"],
      claimedActivities: [],
      claimedPosts: [],
    };
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

export function completeModuleForDemo(moduleId: string, xpReward: number) {
  const progress = getDemoProgress();

  if (progress.completedModules.includes(moduleId)) {
    return progress;
  }

  const next = {
    ...progress,
    points: progress.points + xpReward,
    completedModules: [...progress.completedModules, moduleId],
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
