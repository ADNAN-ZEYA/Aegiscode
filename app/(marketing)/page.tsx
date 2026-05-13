// Revalidate every 5 minutes — content updates propagate quickly without
// serving a fresh Firestore query on every request.
export const revalidate = 300;

import Link from 'next/link';
import { ArrowRight, BookMarked, CheckCircle2, GraduationCap, SearchCheck, Zap } from 'lucide-react';
import { ContentCard } from '@/components/content/content-card';
import { CourseCard } from '@/components/course/course-card';
import { FadeIn } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { listBlogs, listStudyMaterials } from '@/services/content.service';
import { listCourses } from '@/services/course.service';
import { getServerUserProfile } from '@/lib/auth';
import { buildMetadata } from '@/lib/seo';
import { adminDb } from '@/lib/firebase/admin';

export const metadata = buildMetadata({
  title: 'AegisCode — Reading-First Engineering Education Platform',
  description:
    'Study materials, technical blogs, mock tests, and AI-powered learning for engineering students. Structured text-based courses for DSA, OS, DBMS, Networks, and System Design.',
});

async function getHomepageStats() {
  if (!adminDb) return { contentCount: 0, quizCount: 0, userCount: 0 };
  try {
    const [contentSnap, quizSnap, userSnap] = await Promise.all([
      adminDb.collection('content').where('status', '==', 'published').count().get(),
      adminDb.collection('quizzes').where('status', '==', 'published').count().get(),
      adminDb.collection('users').count().get(),
    ]);
    return {
      contentCount: contentSnap.data().count,
      quizCount: quizSnap.data().count,
      userCount: userSnap.data().count,
    };
  } catch {
    return { contentCount: 0, quizCount: 0, userCount: 0 };
  }
}

const FEATURES = [
  {
    icon: SearchCheck,
    title: 'Search-first discovery',
    copy: 'Find what you need fast with structured categories and instant filtering across all content types.',
  },
  {
    icon: BookMarked,
    title: 'Reading-focused content',
    copy: 'Progress bars, bookmarks, rich sections, and code-aware rendering — built for actual studying.',
  },
  {
    icon: Zap,
    title: 'AI-powered assistance',
    copy: 'Aria, your AI study assistant, reads every page with you and answers questions in context.',
  },
  {
    icon: GraduationCap,
    title: 'Structured learning tracks',
    copy: 'Curated courses take you from fundamentals to placement-readiness in focused modules.',
  },
];


export default async function HomePage() {
  const [blogs, studyMaterials, courses, user, stats] = await Promise.all([
    listBlogs({ limit: 3 }),
    listStudyMaterials({ limit: 3 }),
    listCourses({ limit: 3 }),
    getServerUserProfile(),
    getHomepageStats(),
  ]);

  const trustStats = [
    { value: stats.contentCount.toString(), label: 'Resources Published' },
    { value: stats.quizCount.toString(), label: 'Practice Quizzes' },
    { value: stats.userCount.toString(), label: 'Students' },
    { value: 'Free', label: 'Core Access' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-28 px-4 py-16 sm:px-6 lg:px-8">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <FadeIn>
          <div className="space-y-8">
            <Badge className="bg-accent/15 text-foreground">
              Free for all engineering students
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
                <span className="bg-gradient-to-r from-primary via-indigo-400 to-primary bg-clip-text text-transparent">
                  Educational publishing
                </span>{' '}
                that feels like premium tech docs.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                AegisCode turns blogs, study materials, and mock tests into fast, searchable,
                beautifully readable learning experiences. Built for engineers who want to
                actually understand the concepts — not just skim PDFs.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/study-materials">
                  Start Studying Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>


          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 p-6 shadow-soft backdrop-blur-md transition-all hover:scale-[1.02] hover:border-primary/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <item.icon className="mb-4 h-6 w-6 text-primary transition-transform group-hover:-translate-y-1" />
                <h2 className="mb-2 font-serif text-xl">{item.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── Trust stats ────────────────────────────────────────────────────── */}
      <FadeIn>
        <section className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="space-y-1 text-center">
              <p className="font-serif text-4xl font-semibold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>
      </FadeIn>

      {/* ── CTA for unauthenticated visitors ───────────────────────────────── */}
      {!user && (
        <FadeIn delay={0.04}>
          <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 p-8 sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,theme(colors.primary/10),transparent)]" />
            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center">
              <div className="flex-1 space-y-3">
                <h2 className="font-serif text-3xl">Start your personalised learning journey</h2>
                <p className="max-w-lg text-muted-foreground">
                  Create a free account to access your dashboard, save bookmarks, track progress,
                  and get AI-powered study help with Aria.
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    'Personalised study roadmaps',
                    'AI study assistant on every page',
                    'Bookmark anything, read anywhere',
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/signup">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── Blog ───────────────────────────────────────────────────────────── */}
      {blogs.items.length > 0 && (
        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Latest blog posts
              </p>
              <h2 className="font-serif text-3xl">Fresh thinking for builders and learners</h2>
            </div>
            <Button asChild variant="ghost">
              <Link href="/blog">View all</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {blogs.items.map((item) => (
              <ContentCard key={item.slug} item={item} href={`/blog/${item.slug}`} />
            ))}
          </div>
        </section>
      )}

      {/* ── Study Materials ────────────────────────────────────────────────── */}
      {studyMaterials.items.length > 0 && (
        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Study materials
              </p>
              <h2 className="font-serif text-3xl">
                Structured modules meant to be read online
              </h2>
            </div>
            <Button asChild variant="ghost">
              <Link href="/study-materials">Browse all</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {studyMaterials.items.map((item) => (
              <ContentCard key={item.slug} item={item} href={`/study-materials/${item.slug}`} />
            ))}
          </div>
        </section>
      )}

      {/* ── Courses ────────────────────────────────────────────────────────── */}
      {courses.items.length > 0 && (
        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Courses
              </p>
              <h2 className="font-serif text-3xl">
                Text-based learning tracks for engineering students
              </h2>
            </div>
            <Button asChild variant="ghost">
              <Link href="/courses">Browse all</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {courses.items.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl">How courses work here</h3>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  Every course is built for online reading — structured lesson text, no file
                  downloads, fast on any connection. Work through each module at your own pace
                  and bookmark anything you want to revisit.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
