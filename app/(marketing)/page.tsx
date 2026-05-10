export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowRight, BookMarked, GraduationCap, SearchCheck } from 'lucide-react';
import { ContentCard } from '@/components/content/content-card';
import { CourseCard } from '@/components/course/course-card';
import { FadeIn } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { listBlogs, listStudyMaterials } from '@/services/content.service';
import { listCourses } from '@/services/course.service';
import { getServerUserProfile } from '@/lib/auth';

export default async function HomePage() {
  const [blogs, studyMaterials, courses, user] = await Promise.all([
    listBlogs({ limit: 3 }),
    listStudyMaterials({ limit: 3 }),
    listCourses({ limit: 3 }),
    getServerUserProfile(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-24 px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <FadeIn>
        <div className="space-y-8">
          <Badge className="bg-accent/15 text-foreground">Built for reading, not dumping files</Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary via-indigo-400 to-primary bg-clip-text text-transparent">Educational publishing</span> that feels like premium tech docs.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              AegisCode turns blogs, study materials, and mock tests into fast, searchable, SEO-optimized reading experiences with admin-controlled publishing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/study-materials">
                Explore Study Materials
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">Read the Blog</Link>
            </Button>
          </div>
        </div>
        </FadeIn>

        <FadeIn delay={0.08}>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: SearchCheck,
              title: 'Search-first discovery',
              copy: 'Find what you need fast with structured categories and instant filtering.',
            },
            {
              icon: BookMarked,
              title: 'Reading-focused content',
              copy: 'Progress bars, bookmarks, rich sections, and code-aware rendering.',
            },
          ].map((item) => (
            <div key={item.title} className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 p-6 shadow-soft backdrop-blur-md transition-all hover:scale-[1.02] hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <item.icon className="mb-4 h-6 w-6 text-primary transition-transform group-hover:-translate-y-1" />
              <h2 className="mb-2 font-serif text-2xl">{item.title}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{item.copy}</p>
            </div>
          ))}
        </div>
        </FadeIn>
      </section>

      {!user && (
        <FadeIn delay={0.04}>
        <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,theme(colors.primary/10),transparent)]" />
          <div className="relative flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
            <div className="flex-1 space-y-3">
              <h2 className="font-serif text-3xl">Start your personalised learning journey</h2>
              <p className="max-w-lg text-muted-foreground">
                Create a free account to access your dashboard, save bookmarks, track progress, and get AI-powered study help.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-3 sm:justify-end">
              <Button asChild size="lg">
                <Link href="/register">
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

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Latest blog posts</p>
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

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Study materials</p>
            <h2 className="font-serif text-3xl">Structured modules that are meant to be read online</h2>
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

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Course section</p>
            <h2 className="font-serif text-3xl">Text-based learning tracks for engineering students</h2>
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
                Every course is built for online reading — structured lesson text, no file downloads, fast on any connection.
                Work through each module at your own pace and bookmark anything you want to revisit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
