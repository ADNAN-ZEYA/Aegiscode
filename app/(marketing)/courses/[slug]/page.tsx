import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { getCourseBySlug } from '@/services/course.service';
import { adminDb } from '@/lib/firebase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget';
import { getServerUserProfile } from '@/lib/auth';
import { EnrollButton } from './enroll-button';

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

  const [course, user] = await Promise.all([
    getCourseBySlug(slug),
    getServerUserProfile(),
  ]);

  if (!course) {
    notFound();
  }

  if (course.status !== 'published') {
    if (user?.role !== 'admin') {
      notFound();
    }
  }

  // Real enrollment count + check if current user is enrolled
  const [enrollmentCountSnap, userEnrollmentSnap] = await Promise.all([
    adminDb
      ?.collection('enrollments')
      .where('courseId', '==', slug)
      .count()
      .get(),
    user && adminDb
      ? adminDb
          .collection('enrollments')
          .where('userId', '==', user.uid)
          .where('courseId', '==', slug)
          .limit(1)
          .get()
      : Promise.resolve(null),
  ]);

  const enrolledCount = enrollmentCountSnap?.data().count ?? course.enrolledCount ?? 0;
  const isEnrolled = !userEnrollmentSnap?.empty;

  const sortedModules = [...(course.modules || [])].sort((a, b) => a.order - b.order);
  const firstModuleSlug = sortedModules[0]?.slug;

  return (
    <>
      <ChatbotWidget />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-5">
          <Badge>{course.level}</Badge>
          <h1 className="font-serif text-5xl">{course.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{course.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{course.modules.length} modules</span>
            <span>{course.estimatedHours} hours</span>
            <span>{enrolledCount} learner{enrolledCount !== 1 ? 's' : ''}</span>
          </div>
          <EnrollButton
            courseId={slug}
            courseTitle={course.title}
            isLoggedIn={!!user}
            initiallyEnrolled={isEnrolled}
            firstModuleSlug={firstModuleSlug}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <Card>
            <CardHeader>
              <CardTitle>Course outcome</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {course.courseOutcome ? (
                <p>{course.courseOutcome}</p>
              ) : (
                <>
                  <p>
                    This course is designed for engineering students who need cleaner revision
                    material than raw PDFs.
                  </p>
                  <p>
                    Work through each module at your own pace — structured lesson text, no file
                    downloads, fast on any connection.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {sortedModules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {module.order}. {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{module.summary}</p>
                  <p className="text-sm text-muted-foreground">{module.estimatedMinutes} min module</p>
                  <Link
                    href={`/courses/${course.slug}/modules/${module.slug}`}
                    className="text-sm font-medium text-foreground"
                  >
                    Start module
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
