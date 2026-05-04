import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getCourseBySlug } from '@/services/course.service';
import { ReadingProgress } from '@/components/content/reading-progress';
import { RichContentRenderer } from '@/components/content/rich-content-renderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}) {
  const { slug, moduleSlug } = await params;
  const course = await getCourseBySlug(slug);
  const module = course?.modules.find((item) => item.slug === moduleSlug);

  return buildMetadata({
    title: module ? `${module.title} | ${course?.title}` : 'Course module not found',
    description: module?.summary ?? 'Module unavailable.',
    path: `/courses/${slug}/modules/${moduleSlug}`,
  });
}

export default async function CourseModulePage({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}) {
  const { slug, moduleSlug } = await params;
  const course = await getCourseBySlug(slug);
  const module = course?.modules.find((item) => item.slug === moduleSlug);

  if (!course || !module) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{course.title}</p>
          <h1 className="font-serif text-4xl">{module.title}</h1>
          <p className="text-muted-foreground">{module.summary}</p>
        </header>
        <RichContentRenderer markdown={module.markdown} />
      </article>
    </>
  );
}
