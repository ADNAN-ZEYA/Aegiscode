import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1fr] lg:px-8">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-semibold">AegisCode</h3>
          <p className="text-sm text-muted-foreground">
            A reading-first learning platform built for engineering students who want concepts explained clearly,
            revised quickly, and practiced properly.
          </p>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Explore</p>
          <div className="space-y-2">
            <Link className="block transition hover:text-foreground" href="/blog">Engineering Blog</Link>
            <Link className="block transition hover:text-foreground" href="/study-materials">Study Materials</Link>
            <Link className="block transition hover:text-foreground" href="/courses">Courses</Link>
            <Link className="block transition hover:text-foreground" href="/quizzes">Mock Tests</Link>
          </div>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">For Students</p>
          <div className="space-y-2">
            <Link className="block transition hover:text-foreground" href="/signup">Create account</Link>
            <Link className="block transition hover:text-foreground" href="/login">Continue learning</Link>
            <Link className="block transition hover:text-foreground" href="/courses">Structured text-based courses</Link>
            <Link className="block transition hover:text-foreground" href="/study-materials">Revision-friendly reading</Link>
          </div>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Why AegisCode</p>
          <div className="space-y-2">
            <p>Readable even on low bandwidth connections.</p>
            <p>Focused on engineering concepts, revision, and practice.</p>
            <p>Structured online content instead of scattered file downloads.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
