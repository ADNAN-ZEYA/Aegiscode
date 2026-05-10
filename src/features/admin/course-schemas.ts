import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3),
  excerpt: z.string().min(20),
  categorySlug: z.string().min(2),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedHours: z.coerce.number().min(1),
  tags: z.string().min(2),
  status: z.enum(['draft', 'published', 'archived']),
  courseFolder: z.string().min(3),
  sourcePdfPath: z.string().min(3),
  modulesJson: z.string().min(20),
  coverImage: z.string().url().optional().or(z.literal('')),
  isPremium: z.boolean().default(false),
  price: z.coerce.number().optional(),
  courseOutcome: z.string().optional().or(z.literal('')),
});

export type CourseInput = z.infer<typeof courseSchema>;

export const moduleSchema = z.object({
  courseSlug: z.string().min(3),
  id: z.string().min(2),
  title: z.string().min(5),
  slug: z.string().min(3),
  summary: z.string().min(10),
  markdown: z.string().min(50),
  order: z.coerce.number().min(1),
  estimatedMinutes: z.coerce.number().min(1),
});

export type ModuleInput = z.infer<typeof moduleSchema>;
