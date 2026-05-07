import type { AuditFields, AuthorRef, SeoFields } from '@/types/common';

export interface CourseModule {
  id: string;
  title: string;
  slug: string;
  summary: string;
  markdown: string;
  order: number;
  sourcePdfPath?: string;
  estimatedMinutes: number;
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
  modules: CourseModule[];
  courseFolder: string;
  sourcePdfPath?: string;
  isPremium: boolean;
  price?: number;
  publishedAt?: string;
  viewCount: number;
}
