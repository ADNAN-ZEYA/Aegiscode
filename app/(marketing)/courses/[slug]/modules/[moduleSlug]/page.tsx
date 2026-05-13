import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getCourseBySlug, getCourseModule } from '@/services/course.service';
import { ReadingProgress } from '@/components/content/reading-progress';
import { RichContentRenderer } from '@/components/content/rich-content-renderer';
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget';
import { getServerUserProfile } from '@/lib/auth';
import type { CourseModule } from '@/types/course';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}) {
  const { slug, moduleSlug } = await params;
  const [course, courseModuleData] = await Promise.all([
    getCourseBySlug(slug),
    getCourseModule(slug, moduleSlug)
  ]);
  const courseModule = courseModuleData as CourseModule | null;

  return buildMetadata({
    title: courseModule ? `${courseModule.title} | ${course?.title}` : 'Course module not found',
    description: courseModule?.summary ?? 'Module unavailable.',
    path: `/courses/${slug}/modules/${moduleSlug}`,
  });
}

export default async function CourseModulePage({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}) {
  const { slug, moduleSlug } = await params;
  const [course, courseModuleData] = await Promise.all([
    getCourseBySlug(slug),
    getCourseModule(slug, moduleSlug)
  ]);
  const courseModule = courseModuleData as CourseModule | null;

  if (!course || !courseModule) {
    notFound();
  }

  // Security Check: Only admins can see non-published content
  if (course.status !== 'published') {
    const user = await getServerUserProfile();
    if (user?.role !== 'admin') {
      notFound();
    }
  }

  return (
    <>
      <ReadingProgress />
      <ChatbotWidget />
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{course.title}</p>
          <h1 className="font-serif text-3xl sm:text-4xl">{courseModule.title}</h1>
          <p className="text-muted-foreground">{courseModule.summary}</p>
        </header>
        <RichContentRenderer markdown={courseModule.markdown} />
      </article>
    </>
  );
}
