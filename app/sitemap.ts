import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { listBlogs, listStudyMaterials } from '@/services/content.service';
import { listQuizzes } from '@/services/quiz.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, materials, quizzes] = await Promise.all([
    listBlogs({ limit: 50 }).catch(() => ({ items: [] })),
    listStudyMaterials({ limit: 50 }).catch(() => ({ items: [] })),
    listQuizzes(50).catch(() => ({ items: [] })),
  ]);

  const staticRoutes = ['', '/blog', '/study-materials', '/quizzes'].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...blogs.items.map((post) => ({ url: `${siteConfig.url}/blog/${post.slug}`, lastModified: new Date(post.updatedAt) })),
    ...materials.items.map((item) => ({ url: `${siteConfig.url}/study-materials/${item.slug}`, lastModified: new Date(item.updatedAt) })),
    ...quizzes.items.map((quiz) => ({ url: `${siteConfig.url}/quizzes/${quiz.slug}`, lastModified: new Date(quiz.updatedAt) })),
  ];
}
