import Link from 'next/link';
import { BookOpenText } from 'lucide-react';

const year = new Date().getFullYear();

const LINKS = {
  explore: [
    { href: '/blog', label: 'Engineering Blog' },
    { href: '/study-materials', label: 'Study Materials' },
    { href: '/courses', label: 'Courses' },
    { href: '/quizzes', label: 'Mock Tests' },
  ],
  students: [
    { href: '/signup', label: 'Create free account' },
    { href: '/login', label: 'Sign in' },
    { href: '/dashboard', label: 'My dashboard' },
  ],
  topics: [
    { href: '/study-materials?category=dsa', label: 'Data Structures & Algorithms' },
    { href: '/study-materials?category=os', label: 'Operating Systems' },
    { href: '/study-materials?category=dbms', label: 'DBMS' },
    { href: '/study-materials?category=networks', label: 'Computer Networks' },
    { href: '/study-materials?category=system-design', label: 'System Design' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.1fr]">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <BookOpenText className="h-4 w-4" />
              </span>
              <span className="font-serif text-lg font-semibold">AegisCode</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A reading-first learning platform built for engineering students — concepts explained
              clearly, revised quickly, and practiced properly.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Trusted by thousands of engineering students preparing for placements and competitive
              exams.
            </p>
          </div>

          {/* Explore */}
          <nav className="space-y-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Explore</p>
            <ul className="space-y-2.5">
              {LINKS.explore.map((l) => (
                <li key={l.href}>
                  <Link className="transition hover:text-foreground" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Students */}
          <nav className="space-y-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">For Students</p>
            <ul className="space-y-2.5">
              {LINKS.students.map((l) => (
                <li key={l.href}>
                  <Link className="transition hover:text-foreground" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Topics */}
          <nav className="space-y-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Topics</p>
            <ul className="space-y-2.5">
              {LINKS.topics.map((l) => (
                <li key={l.href}>
                  <Link className="transition hover:text-foreground" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {year} AegisCode. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="transition hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
