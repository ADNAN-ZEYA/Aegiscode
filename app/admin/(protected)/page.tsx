export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Eye,
  FileText,
  GraduationCap,
  HelpCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import { AggregateField } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { listBlogs, listStudyMaterials } from '@/services/content.service';
import { listCourses } from '@/services/course.service';
import { listQuizzes } from '@/services/quiz.service';
import { listUsers } from '@/services/user.service';

// ---------------------------------------------------------------------------
// Stats — computed from live Firestore data via aggregate queries
// ---------------------------------------------------------------------------
async function getDashboardStats() {
  const empty = { totalViews: 0, totalStudents: 0, totalBookmarks: 0, publishedCount: 0 };
  if (!adminDb) return empty;

  try {
    const [
      contentViews, courseViews, quizViews,
      studentCount,
      bookmarkSum,
      publishedContent, publishedCourses, publishedQuizzes,
    ] = await Promise.all([
      adminDb.collection('content').aggregate({ v: AggregateField.sum('viewCount') }).get(),
      adminDb.collection('courses').aggregate({ v: AggregateField.sum('viewCount') }).get(),
      adminDb.collection('quizzes').aggregate({ v: AggregateField.sum('viewCount') }).get(),
      adminDb.collection('users').where('role', '==', 'student').count().get(),
      adminDb.collection('users').aggregate({ b: AggregateField.sum('bookmarksCount') }).get(),
      adminDb.collection('content').where('status', '==', 'published').count().get(),
      adminDb.collection('courses').where('status', '==', 'published').count().get(),
      adminDb.collection('quizzes').where('status', '==', 'published').count().get(),
    ]);

    return {
      totalViews:
        (contentViews.data().v ?? 0) +
        (courseViews.data().v ?? 0) +
        (quizViews.data().v ?? 0),
      totalStudents: studentCount.data().count,
      totalBookmarks: bookmarkSum.data().b ?? 0,
      publishedCount:
        publishedContent.data().count +
        publishedCourses.data().count +
        publishedQuizzes.data().count,
    };
  } catch {
    return empty;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function AdminDashboardPage() {
  const [stats, blogs, studyMaterials, courses, quizzes, users] = await Promise.all([
    getDashboardStats(),
    listBlogs({ limit: 4 }),
    listStudyMaterials({ limit: 3 }),
    listCourses({ limit: 3 }),
    listQuizzes(4),
    listUsers(5),
  ]);

  const statCards = [
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      sub: 'across all content',
      icon: Eye,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      ring: 'ring-blue-500/20',
      up: true,
    },
    {
      label: 'Students',
      value: stats.totalStudents.toLocaleString(),
      sub: 'registered accounts',
      icon: Users,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      ring: 'ring-violet-500/20',
      up: true,
    },
    {
      label: 'Bookmarks',
      value: stats.totalBookmarks.toLocaleString(),
      sub: 'saved by students',
      icon: BookMarked,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      ring: 'ring-emerald-500/20',
      up: true,
    },
    {
      label: 'Published',
      value: stats.publishedCount.toLocaleString(),
      sub: 'content items live',
      icon: TrendingUp,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      ring: 'ring-amber-500/20',
      up: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Admin Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Editorial Operations</h1>
        <p className="mt-1 text-sm text-white/40">Track content, readers, and platform performance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/40">{stat.label}</p>
              <div className={`rounded-lg p-2 ring-1 ${stat.bg} ${stat.ring}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-1.5 text-xs text-white/25">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Main content grid — blogs + users */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent blogs */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Recent Blog Posts</h2>
            </div>
            <Link
              href="/admin/content"
              className="flex items-center gap-1 text-xs text-white/30 transition hover:text-violet-400"
            >
              Manage <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {blogs.items.length > 0 ? (
              blogs.items.map((blog) => (
                <div
                  key={blog.slug}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{blog.title}</p>
                    <p className="mt-0.5 truncate text-xs text-white/30">{blog.categorySlug}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-3 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {blog.viewCount.toLocaleString()}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        blog.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-white/5 text-white/30'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
                <FileText className="mx-auto h-6 w-6 text-white/20" />
                <p className="mt-2 text-sm text-white/30">No blog posts yet</p>
                <Link href="/admin/content" className="mt-2 inline-block text-xs text-violet-400 hover:underline">
                  Create your first post →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent users */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-white">Recent Users</h2>
            </div>
            <Link
              href="/admin/users"
              className="flex items-center gap-1 text-xs text-white/30 transition hover:text-violet-400"
            >
              All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {users.length > 0 ? (
              users.map((u) => {
                const displayName = u.name || u.email?.split('@')[0] || 'Unknown';
                const displayHandle = u.username || u.email?.split('@')[0] || '—';
                const initial = displayName.charAt(0).toUpperCase();
                return (
                  <div key={u.uid} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-white/60">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{displayName}</p>
                      <p className="truncate text-xs text-white/30">@{displayHandle}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        u.role === 'admin'
                          ? 'bg-violet-500/10 text-violet-400'
                          : 'bg-white/5 text-white/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-white/30">No users yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Study materials */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Study Materials</h2>
          </div>
          <Link
            href="/admin/pdf-upload"
            className="flex items-center gap-1 rounded-lg bg-violet-600/20 px-3 py-1.5 text-xs font-medium text-violet-400 ring-1 ring-violet-500/20 transition hover:bg-violet-600/30"
          >
            + Upload PDF
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {studyMaterials.items.length > 0 ? (
            studyMaterials.items.map((mat) => (
              <div key={mat.slug} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <p className="truncate text-sm font-medium text-white">{mat.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-white/30">{mat.excerpt}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-white/25">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {mat.viewCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" /> {mat.readingTime} min
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-white/10 py-8 text-center">
              <GraduationCap className="mx-auto h-6 w-6 text-white/20" />
              <p className="mt-2 text-sm text-white/30">No study materials yet.</p>
              <Link href="/admin/pdf-upload" className="mt-2 inline-block text-xs text-violet-400 hover:underline">
                Upload your first PDF →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quizzes */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Recent Quizzes</h2>
          </div>
          <Link
            href="/admin/quizzes"
            className="flex items-center gap-1 text-xs text-white/30 transition hover:text-violet-400"
          >
            Manage <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quizzes.items.length > 0 ? (
            quizzes.items.map((quiz) => (
              <div key={quiz.slug} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <p className="truncate text-sm font-medium text-white">{quiz.title}</p>
                <p className="mt-0.5 truncate text-xs text-white/30">{quiz.categorySlug}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-white/25">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {quiz.viewCount.toLocaleString()}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      quiz.difficulty === 'hard'
                        ? 'bg-red-500/10 text-red-400'
                        : quiz.difficulty === 'medium'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-white/10 py-8 text-center">
              <HelpCircle className="mx-auto h-6 w-6 text-white/20" />
              <p className="mt-2 text-sm text-white/30">No quizzes yet.</p>
              <Link href="/admin/quizzes" className="mt-2 inline-block text-xs text-violet-400 hover:underline">
                Create your first quiz →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Courses */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Recent Courses</h2>
          </div>
          <Link
            href="/admin/courses"
            className="flex items-center gap-1 text-xs text-white/30 transition hover:text-violet-400"
          >
            Manage <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.items.length > 0 ? (
            courses.items.map((course) => (
              <div key={course.slug} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <p className="truncate text-sm font-medium text-white">{course.title}</p>
                <p className="mt-0.5 truncate text-xs text-white/30">{course.categorySlug}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-white/25">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {course.enrolledCount.toLocaleString()} enrolled
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      course.level === 'advanced'
                        ? 'bg-red-500/10 text-red-400'
                        : course.level === 'intermediate'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {course.level}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-white/10 py-8 text-center">
              <BookOpen className="mx-auto h-6 w-6 text-white/20" />
              <p className="mt-2 text-sm text-white/30">No courses yet.</p>
              <Link href="/admin/courses" className="mt-2 inline-block text-xs text-violet-400 hover:underline">
                Create your first course →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
