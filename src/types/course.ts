import type { AuditFields, AuthorRef, SeoFields } from '@/types/common';

export interface CourseModuleSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  order: number;
  estimatedMinutes: number;
}

export interface CourseModule extends CourseModuleSummary {
  markdown: string;
  sourcePdfPath?: string;
}

export interface Course extends AuditFields {
  title: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  coverImage?: string;
  categorySlug: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  enrolledCount: number;
  featured?: boolean;
  author: AuthorRef;
  seo: SeoFields;
  modules: CourseModuleSummary[]; // Using Summary here!
  courseFolder: string;
  sourcePdfPath?: string;
  isPremium: boolean;
  price?: number;
  publishedAt?: string;
  viewCount: number;
  courseOutcome?: string;
}
