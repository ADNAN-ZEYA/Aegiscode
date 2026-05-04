import Link from 'next/link';
import { BookOpen, GraduationCap, NotebookPen } from 'lucide-react';
import { requireAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Student dashboard</p>
        <h1 className="font-serif text-4xl">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">
          Continue learning through structured articles, study materials, courses, and revision-friendly mock tests.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-5 w-5 text-primary" />Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/courses" className="text-sm text-muted-foreground">Browse full engineering-focused courses</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><NotebookPen className="h-5 w-5 text-primary" />Study Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/study-materials" className="text-sm text-muted-foreground">Read clean online revision modules</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><BookOpen className="h-5 w-5 text-primary" />Mock Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/quizzes" className="text-sm text-muted-foreground">Practice with timed assessments</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
