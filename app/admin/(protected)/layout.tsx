export const dynamic = 'force-dynamic';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileUp,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
} from 'lucide-react';
import { requireAdmin } from '@/lib/auth';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/content', label: 'New Content', icon: BookOpen },
  { href: '/admin/history', label: 'History & Edits', icon: BookOpen },
  { href: '/admin/pdf-upload', label: 'Upload PDF', icon: FileUp },
  { href: '/admin/courses', label: 'Courses', icon: FolderKanban },
  { href: '/admin/quizzes', label: 'Quizzes', icon: GraduationCap },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[#08080f]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/5 bg-[#0c0c14]">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 ring-1 ring-violet-500/30">
            <Shield className="h-4 w-4 text-violet-400" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">AegisCode</p>
            <p className="text-xs text-white/40">Admin Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 pt-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/20">
            Management
          </p>
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white"
            >
              <link.icon className="h-4 w-4 shrink-0 transition group-hover:text-violet-400" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-xs font-bold text-violet-300">
              {user.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-white/40">{user.email}</p>
            </div>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                title="Sign out"
                className="text-white/30 transition hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 overflow-x-hidden">
        <div className="min-h-screen p-8 text-white">
          {children}
        </div>
      </main>
    </div>
  );
}
