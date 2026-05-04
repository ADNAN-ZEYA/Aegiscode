import type { AuditFields, AuthorRef, SeoFields } from '@/types/common';

export interface ContentBlock {
  id: string;
  type: 'markdown' | 'callout' | 'code' | 'image' | 'table' | 'quiz';
  title?: string;
  content?: string;
  language?: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
  quizId?: string;
  tone?: 'info' | 'warning' | 'success';
}

export interface ContentAttachment {
  name: string;
  storagePath: string;
  mimeType: string;
  inlinePreview?: boolean;
}

export interface BaseContent extends AuditFields {
  title: string;
  excerpt: string;
  coverImage?: string;
  categorySlug: string;
  readingTime: number;
  featured?: boolean;
  seo: SeoFields;
  author: AuthorRef;
  publishedAt?: string;
  viewCount: number;
  markdown: string;
  blocks: ContentBlock[];
  attachments?: ContentAttachment[];
}

export interface BlogPost extends BaseContent {
  type: 'blog';
}

export interface StudyMaterial extends BaseContent {
  type: 'studyMaterial';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedCompletionMinutes: number;
}
