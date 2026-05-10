'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Menu,
  Search,
  Shield,
  User2,
  X,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { clientAuth } from '@/lib/firebase/client';
import { resolveRoleFromEmail } from '@/lib/role';
import { useAuth } from '@/components/providers/auth-provider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/study-materials', label: 'Study Materials' },
  { href: '/courses', label: 'Courses' },
  { href: '/quizzes', label: 'Mock Tests' },
];

function DrawerAuth({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <Button asChild className="w-full justify-start">
          <Link href="/login" onClick={onClose}>
            Sign in
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link href="/register" onClick={onClose}>
            Create account
          </Link>
        </Button>
      </div>
    );
  }

  const role = resolveRoleFromEmail(user.email, process.env.NEXT_PUBLIC_ADMIN_EMAILS);
  const dashboardHref = role === 'admin' ? '/admin' : '/dashboard';
  const DashIcon = role === 'admin' ? Shield : User2;

  return (
    <div className="flex flex-col gap-2">
      <Button asChild variant="outline" className="w-full justify-start">
        <Link href={dashboardHref} onClick={onClose}>
          <DashIcon className="mr-2 h-4 w-4" />
          {role === 'admin' ? 'Admin panel' : 'Dashboard'}
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-destructive hover:text-destructive"
        onClick={async () => {
          onClose();
          await signOut(clientAuth!);
          router.push('/');
          router.refresh();
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  const overlay = open ? (
    <>
      {/* Full-screen backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed right-0 top-0 z-[201] flex h-full w-80 flex-col bg-background shadow-2xl"
      >
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="font-serif text-lg font-semibold">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search articles, topics…" />
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <hr className="border-border" />

          {/* Auth */}
          <DrawerAuth onClose={close} />
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && open && createPortal(overlay, document.body)}
    </>
  );
}
