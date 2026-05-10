export const dynamic = 'force-dynamic';

import { getServerUserProfile } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { SignInPrompt } from './components/sign-in-prompt';
import { RoadmapSection } from './components/roadmap-section';
import { TodaysSchedule } from './components/todays-schedule';
import { ProgressTracker } from './components/progress-tracker';
import { BookmarksSection } from './components/bookmarks-section';
import { QuizScoresSection } from './components/quiz-scores-section';
import { EnrolledCoursesSection } from './components/enrolled-courses-section';
import type { RoadmapData, ProgressDoc } from './actions';

/** Safely converts a Firestore Timestamp, Date, or ISO string to an ISO string. */
function toISO(val: unknown): string | undefined {
  if (!val) return undefined;
  if (typeof val === 'string') return val;
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'object' && 'toDate' in (val as object)) {
    return (val as { toDate(): Date }).toDate().toISOString();
  }
  return undefined;
}

function calculateStreak(progressDocs: ProgressDoc[]): number {
  if (!progressDocs.length) return 0;
  const progressMap = new Map(progressDocs.map((p) => [p.date, p]));

  const cursor = new Date();
  const todayStr = cursor.toISOString().split('T')[0];

  // If nothing studied today, start counting from yesterday
  if (!progressMap.get(todayStr)?.completedTasks?.length) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const dateStr = cursor.toISOString().split('T')[0];
    const doc = progressMap.get(dateStr);
    if (!doc?.completedTasks?.length) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default async function DashboardPage() {
  const user = await getServerUserProfile();

  if (!user) {
    return <SignInPrompt />;
  }

  const today = new Date().toISOString().split('T')[0];

  const [roadmapDoc, bookmarksSnap, quizAttemptsSnap, progressSnap, enrollmentsSnap] =
    await Promise.all([
      adminDb
        ?.collection('users')
        .doc(user.uid)
        .collection('roadmap')
        .doc('current')
        .get(),
      adminDb
        ?.collection('bookmarks')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .limit(6)
        .get(),
      adminDb
        ?.collection('quizAttempts')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get(),
      adminDb
        ?.collection('users')
        .doc(user.uid)
        .collection('progress')
        .orderBy('date', 'desc')
        .limit(60)
        .get(),
      adminDb
        ?.collection('enrollments')
        .where('userId', '==', user.uid)
        .orderBy('lastAccessedAt', 'desc')
        .limit(6)
        .get(),
    ]);

  const roadmap = (roadmapDoc?.exists ? roadmapDoc.data() : null) as RoadmapData | null;
  const progressDocs = (progressSnap?.docs.map((d) => d.data()) ?? []) as ProgressDoc[];
  const todayProgress = progressDocs.find((p) => p.date === today) ?? null;
  const quizAttempts = quizAttemptsSnap?.docs.map((d) => {
    const data = d.data();
    return { ...data, createdAt: toISO(data.createdAt) };
  }) ?? [];

  // Hydrate bookmarks with content title/excerpt via parallel fetches
  const bookmarkDocs = bookmarksSnap?.docs.map((d) => d.data()) ?? [];
  const bookmarkContents =
    bookmarkDocs.length > 0 && adminDb
      ? await Promise.all(
          bookmarkDocs.map((b) =>
            adminDb!
              .collection('content')
              .doc(b.contentId as string)
              .get(),
          ),
        )
      : [];

  const bookmarks = bookmarkDocs.map((b, i) => ({
    contentId: b.contentId as string,
    contentType: b.contentType as 'blog' | 'studyMaterial',
    createdAt: b.createdAt as string,
    title:
      (bookmarkContents[i]?.data()?.title as string | undefined) ??
      (bookmarkContents[i]?.id as string | undefined) ??
      (b.contentId as string),
    slug: bookmarkContents[i]?.id ?? (b.contentId as string),
    excerpt: (bookmarkContents[i]?.data()?.excerpt as string) ?? '',
  }));

  // Hydrate enrollments with course data
  const enrollmentDocs = enrollmentsSnap?.docs.map((d) => d.data()) ?? [];
  const enrolledCourseIds = enrollmentDocs.map((e) => e.courseId as string);
  const courseDocs =
    enrolledCourseIds.length > 0 && adminDb
      ? await Promise.all(
          enrolledCourseIds.map((id) => adminDb!.collection('courses').doc(id).get()),
        )
      : [];

  const enrolledCourses = enrollmentDocs.map((e, i) => ({
    slug: courseDocs[i]?.id ?? (e.courseId as string),
    title: (courseDocs[i]?.data()?.title as string) ?? 'Untitled Course',
    level: courseDocs[i]?.data()?.level as string | undefined,
    progress: e.progress as number | undefined,
    lastAccessedAt: e.lastAccessedAt as string | undefined,
  }));

  const streak = calculateStreak(progressDocs);
  const completedWeeks = roadmap?.completedWeeks?.length ?? 0;
  const totalWeeks = roadmap?.weeks?.length ?? 0;
  const completionPercent =
    totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;
  const daysUntilTarget = roadmap?.targetDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(roadmap.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const firstName = user.name?.split(' ')[0] ?? 'Student';

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Student dashboard
        </p>
        <h1 className="font-serif text-4xl">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground">
          Track your progress, continue learning, and stay on schedule.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <RoadmapSection initialRoadmap={roadmap} />
          <TodaysSchedule roadmap={roadmap} todayProgress={todayProgress} today={today} />
        </div>

        <div className="space-y-6">
          <ProgressTracker
            streak={streak}
            completionPercent={completionPercent}
            completedWeeks={completedWeeks}
            totalWeeks={totalWeeks}
            daysUntilTarget={daysUntilTarget}
          />
          <QuizScoresSection attempts={quizAttempts} />
        </div>
      </div>

      <EnrolledCoursesSection courses={enrolledCourses} />
      <BookmarksSection bookmarks={bookmarks} />
    </div>
  );
}
