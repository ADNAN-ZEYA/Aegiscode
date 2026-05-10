'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, BookOpenText } from 'lucide-react';
import { AuthControls } from '@/components/layout/auth-controls';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Input } from '@/components/ui/input';

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/study-materials', label: 'Study Materials' },
  { href: '/courses', label: 'Courses' },
  { href: '/quizzes', label: 'Mock Tests' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs border-l border-border bg-background px-6 py-5 shadow-xl md:hidden">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 font-semibold"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <BookOpenText className="h-4 w-4" />
                </span>
                <span className="font-serif text-lg">AegisCode</span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mt-5">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search articles, topics, or tests" />
            </div>

            {/* Nav links */}
            <nav className="mt-6 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth + theme */}
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <span className="text-xs text-muted-foreground">Toggle theme</span>
              </div>
              <AuthControls />
            </div>
          </div>
        </>
      )}
    </>
  );
}
