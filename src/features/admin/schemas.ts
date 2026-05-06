import { z } from 'zod';

export const contentSchema = z.object({
  contentType: z.enum(['blog', 'studyMaterial']),
  title: z.string().min(5),
  slug: z.string().min(3),
  excerpt: z.string().min(20),
  categorySlug: z.string().min(2),
  tags: z.string().min(2),
  markdown: z.string().min(50),
  status: z.enum(['draft', 'published', 'archived']),
  coverImage: z.string().url().optional().or(z.literal('')),
  relatedContentSlugs: z.string().optional(),
  prerequisiteSlugs: z.string().optional(),
});

export type ContentInput = z.infer<typeof contentSchema>;

export const quizSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3),
  excerpt: z.string().min(20),
  categorySlug: z.string().min(2),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  durationMinutes: z.coerce.number().min(1),
  questionsJson: z.string().min(20),
  status: z.enum(['draft', 'published', 'archived']),
});

export type QuizInput = z.infer<typeof quizSchema>;
