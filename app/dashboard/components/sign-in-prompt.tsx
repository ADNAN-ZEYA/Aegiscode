import Link from 'next/link';
import { ArrowRight, BookMarked, GraduationCap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SignInPrompt() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-2xl space-y-10 text-center">
        <div className="flex justify-center gap-4">
          {[
            { Icon: GraduationCap, rotate: '-rotate-6' },
            { Icon: Target, rotate: 'rotate-0' },
            { Icon: BookMarked, rotate: 'rotate-6' },
          ].map(({ Icon, rotate }, i) => (
            <div
              key={i}
              className={`${rotate} rounded-2xl bg-primary/10 p-4 text-primary shadow-soft`}
            >
              <Icon className="h-7 w-7" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
            Your learning journey{' '}
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-primary bg-clip-text text-transparent">
              starts here
            </span>
          </h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            Get a personalised AI study roadmap, track daily progress, save bookmarks, and review your quiz scores — all in one place.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register">
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {[
            'AI-powered roadmap',
            'Daily study schedule',
            'Progress tracking',
            'Bookmarks',
            'Quiz history',
          ].map((label) => (
            <span
              key={label}
              className="rounded-full border border-border bg-muted/40 px-3 py-1 text-sm text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
