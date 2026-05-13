'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Bot,
  FileUp,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Users,
  X,
} from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/content', label: 'New Content', icon: BookOpen },
  { href: '/admin/history', label: 'History & Edits', icon: BookOpen },
  { href: '/admin/pdf-upload', label: 'Upload PDF', icon: FileUp },
  { href: '/admin/courses', label: 'Courses', icon: FolderKanban },
  { href: '/admin/quizzes', label: 'Quizzes', icon: GraduationCap },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/ai-settings', label: 'AI Settings', icon: Bot },
];

interface AdminSidebarProps {
  userName: string;
  userEmail: string;
  userInitial: string;
}

export function AdminSidebar({ userName, userEmail, userInitial }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 ring-1 ring-violet-500/30">
          <Shield className="h-4 w-4 text-violet-400" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">AegisCode</p>
          <p className="text-xs text-white/40">Admin Portal</p>
        </div>
        {/* Close button — mobile only */}
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/5 hover:text-white md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 pt-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/20">
          Management
        </p>
        {adminLinks.map((link) => {
          // Exact match for /admin dashboard, prefix match for sub-sections
          const isActive =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-violet-600/20 text-white ring-1 ring-violet-500/30'
                  : 'text-white/50 hover:bg-white/5 hover:text-white',
              ].join(' ')}
            >
              <link.icon
                className={[
                  'h-4 w-4 shrink-0 transition',
                  isActive ? 'text-violet-400' : 'group-hover:text-violet-400',
                ].join(' ')}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-xs font-bold text-violet-300">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-xs text-white/40">{userEmail}</p>
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
    </>
  );

  return (
    <>
      {/* Mobile top bar (hamburger) */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-white/5 bg-[#0c0c14] px-4 md:hidden">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/5 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/20 ring-1 ring-violet-500/30">
            <Shield className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <span className="text-sm font-semibold text-white">Admin Portal</span>
        </div>
      </div>

      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#0c0c14] transition-transform duration-200',
          'md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
