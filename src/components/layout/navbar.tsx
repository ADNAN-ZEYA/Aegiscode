import Link from 'next/link';
import { BookOpenText, Search } from 'lucide-react';
import { AuthControls } from '@/components/layout/auth-controls';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Input } from '@/components/ui/input';

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/study-materials', label: 'Study Materials' },
  { href: '/courses', label: 'Courses' },
  { href: '/quizzes', label: 'Mock Tests' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <BookOpenText className="h-5 w-5" />
            </span>
            <span className="font-serif text-xl">AegisCode</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search articles, topics, or tests" />
          </div>
          <ThemeToggle />
          <AuthControls />
        </div>

        {/* Mobile-only: theme toggle + hamburger */}
        <div className="relative z-50 flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
