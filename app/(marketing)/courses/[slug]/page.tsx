import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { getCourseBySlug } from '@/services/course.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getServerUserProfile } from '@/lib/auth';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  return buildMetadata({
    title: course?.seo.title ?? 'Course not found',
    description: course?.seo.description ?? 'Course unavailable.',
    path: `/courses/${slug}`,
    image: course?.coverImage,
  });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
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
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Badge>{course.level}</Badge>
        <h1 className="font-serif text-5xl">{course.title}</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{course.excerpt}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>{course.modules.length} modules</span>
          <span>{course.estimatedHours} hours</span>
          <span>{course.enrolledCount} learners</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader>
            <CardTitle>Course outcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>This course is designed for engineering students who need cleaner revision material than raw PDFs.</p>
            <p>Admins keep the original PDF privately as source material, while students read the structured lesson text online.</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {course.modules
            .sort((left, right) => left.order - right.order)
            .map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle className="text-2xl">{module.order}. {module.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{module.summary}</p>
                  <p className="text-sm text-muted-foreground">{module.estimatedMinutes} min module</p>
                  <Link href={`/courses/${course.slug}/modules/${module.slug}`} className="text-sm font-medium text-foreground">
                    Start module
                  </Link>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
