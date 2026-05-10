import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { listBlogs, listStudyMaterials } from '@/services/content.service';
import { listCourses } from '@/services/course.service';
import { listQuizzes } from '@/services/quiz.service';

export const revalidate = 3600; // regenerate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, materials, courses, quizzes] = await Promise.all([
    listBlogs({ limit: 200 }).catch(() => ({ items: [] })),
    listStudyMaterials({ limit: 200 }).catch(() => ({ items: [] })),
    listCourses({ limit: 200 }).catch(() => ({ items: [] })),
    listQuizzes(200).catch(() => ({ items: [] })),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteConfig.url}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteConfig.url}/study-materials`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteConfig.url}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteConfig.url}/quizzes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  return [
    ...staticRoutes,
    ...blogs.items.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...materials.items.map((m) => ({
      url: `${siteConfig.url}/study-materials/${m.slug}`,
      lastModified: new Date(m.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...courses.items.map((c) => ({
      url: `${siteConfig.url}/courses/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...quizzes.items.map((q) => ({
      url: `${siteConfig.url}/quizzes/${q.slug}`,
      lastModified: new Date(q.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
