import type { AuditFields, AuthorRef, SeoFields } from '@/types/common';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export interface Quiz extends AuditFields {
  title: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  categorySlug: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  questionCount: number;
  questions: QuizQuestion[];
  seo: SeoFields;
  author: AuthorRef;
  publishedAt?: string;
  viewCount: number;
}

export interface QuizAttempt extends AuditFields {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
  completedAt: string;
}
