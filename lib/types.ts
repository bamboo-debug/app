export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  area: string;
  level: number;
  level_name: string;
  points: number;
  streak_days: number;
  next_level_points: number;
};

export type ModuleSection = { heading: string; body: string };
export type LessonQuiz = { question: string; options: string[]; correct: number; explanation: string };
export type Module = {
  id: string;
  slug: string;
  title: string;
  description: string;
  month: string;
  level_required: number;
  xp_reward: number;
  lessons: number;
  status: 'available' | 'locked' | 'completed';
  theme: string;
  opening: string;
  sections: ModuleSection[];
  exercise: string;
  takeaway: string;
  quiz: LessonQuiz;
};
export type Activity = {
  id: string;
  title: string;
  category: 'taller' | 'curso' | 'blog' | 'reto' | 'evento';
  date_label: string;
  xp_reward: number;
  status: 'upcoming' | 'completed';
  description: string;
};
export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  excerpt: string;
  author: string;
  tag: string;
  status: 'draft' | 'published';
  xp_reward: number;
};
export type LeaderboardEntry = { id: string; name: string; area: string; points: number; level_name: string };
export type WelcomeMessage = { title: string; body: string[]; cta: string };
export type ClubSignupPayload = { firstName: string; lastName: string; email: string; phone: string; agency: string; area: string };

export type ModuleProgress = {
  moduleId: string;
  completedSections: string[];
  exerciseCompleted: boolean;
  quizAnswered: boolean;
  quizCorrect: boolean;
  completed: boolean;
  earnedPoints: number;
  lastFeedback?: string;
};

export type UserBlogDraft = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  content: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type BlogSubmissionPayload = {
  title: string;
  topic: string;
  summary: string;
  content: string;
  status: 'draft' | 'submitted';
};
