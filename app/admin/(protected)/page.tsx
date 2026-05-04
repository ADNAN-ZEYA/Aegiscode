import Link from 'next/link';
import {
  BookMarked,
  ChartNoAxesCombined,
  Eye,
  Users,
  TrendingUp,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  Activity,
  FileText,
} from 'lucide-react';
import { getAnalyticsOverview } from '@/services/analytics.service';
import { listBlogs, listStudyMaterials } from '@/services/content.service';
import { listUsers } from '@/services/user.service';

export default async function AdminDashboardPage() {
  const [analytics, blogs, studyMaterials, users] = await Promise.all([
    getAnalyticsOverview(),
    listBlogs({ limit: 4 }),
    listStudyMaterials({ limit: 3 }),
    listUsers(5),
  ]);

  const stats = [
    {
      label: 'Views Today',
      value: analytics.viewsToday.toLocaleString(),
      icon: Eye,
      change: '+12.4%',
      up: true,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      ring: 'ring-blue-500/20',
    },
    {
      label: 'Weekly Readers',
      value: analytics.weeklyReaders.toLocaleString(),
      icon: Users,
      change: '+8.1%',
      up: true,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      ring: 'ring-violet-500/20',
    },
    {
      label: 'Saved Articles',
      value: analytics.savedArticles.toLocaleString(),
      icon: BookMarked,
      change: '+3.2%',
      up: true,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      ring: 'ring-emerald-500/20',
    },
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      icon: ChartNoAxesCombined,
      change: '-1.5%',
      up: false,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      ring: 'ring-amber-500/20',
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
        {stats.map((stat) => (
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
            <div className="mt-2 flex items-center gap-1.5">
              <TrendingUp className={`h-3 w-3 ${stat.up ? 'text-emerald-400' : 'text-red-400 rotate-180'}`} />
              <span className={`text-xs font-medium ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-white/25">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
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
              className="flex items-center gap-1 text-xs text-white/30 hover:text-violet-400 transition"
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
                      {blog.viewCount}
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
              className="flex items-center gap-1 text-xs text-white/30 hover:text-violet-400 transition"
            >
              All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {users.length > 0 ? (
              users.map((u) => (
                <div key={u.uid} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-white/60">
                    {u.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{u.name}</p>
                    <p className="truncate text-xs text-white/30">@{u.username}</p>
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
              ))
            ) : (
              <p className="text-sm text-white/30">No users yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Study materials row */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Study Materials</h2>
          </div>
          <Link
            href="/admin/pdf-upload"
            className="flex items-center gap-1 rounded-lg bg-violet-600/20 px-3 py-1.5 text-xs font-medium text-violet-400 ring-1 ring-violet-500/20 hover:bg-violet-600/30 transition"
          >
            + Upload PDF
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {studyMaterials.items.length > 0 ? (
            studyMaterials.items.map((mat) => (
              <div
                key={mat.slug}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-4"
              >
                <p className="truncate text-sm font-medium text-white">{mat.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-white/30">{mat.excerpt}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-white/25">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {mat.viewCount}
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
    </div>
  );
}
