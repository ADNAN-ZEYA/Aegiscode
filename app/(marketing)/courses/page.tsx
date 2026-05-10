export const revalidate = 300;

import { buildMetadata } from '@/lib/seo';
import { listCategories } from '@/services/content.service';
import { listCourses } from '@/services/course.service';
import { SearchFilters } from '@/components/content/search-filters';
import { PaginationLink } from '@/components/content/pagination-link';
import { CourseCard } from '@/components/course/course-card';

export const metadata = buildMetadata({
  title: 'Courses',
  description: 'Engineering-focused courses built from structured text lessons, with PDF source material managed privately by admins.',
  path: '/courses',
});

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; cursor?: string }>;
}) {
  const params = await searchParams;
  const [categories, courses] = await Promise.all([
    listCategories(),
    listCourses({ category: params.category, query: params.q, cursor: params.cursor }),
  ]);

  const nextHref = courses.nextCursor
    ? `/courses?${new URLSearchParams({
        ...(params.category ? { category: params.category } : {}),
        ...(params.q ? { q: params.q } : {}),
        cursor: courses.nextCursor,
      }).toString()}`
    : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Courses</p>
        <h1 className="font-serif text-4xl">Structured learning tracks for engineering students</h1>
        <p className="max-w-3xl text-muted-foreground">
          Admins can manage PDF source material privately, while students read clean lesson modules online in a revision-friendly format.
        </p>
      </div>
      <form className="space-y-4">
        <SearchFilters categories={categories} basePath="/courses" activeCategory={params.category} query={params.q} />
      </form>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.items.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
      <PaginationLink href={nextHref} />
    </div>
  );
}
