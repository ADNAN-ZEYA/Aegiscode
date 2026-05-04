import Link from 'next/link';
import { Clock3, ListChecks } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildMetadata } from '@/lib/seo';
import { listQuizzes } from '@/services/quiz.service';

export const metadata = buildMetadata({
  title: 'Mock Tests',
  description: 'Timed quizzes and revision checks for technical learners.',
  path: '/quizzes',
});

export default async function QuizzesPage() {
  const quizzes = await listQuizzes();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Mock tests</p>
        <h1 className="font-serif text-4xl">Practice with fast, focused assessments</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {quizzes.items.map((quiz) => (
          <Card key={quiz.slug}>
            <CardHeader>
              <CardTitle>
                <Link href={`/quizzes/${quiz.slug}`}>{quiz.title}</Link>
              </CardTitle>
              <CardDescription>{quiz.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><ListChecks className="h-4 w-4" />{quiz.questionCount} questions</p>
              <p className="flex items-center gap-2"><Clock3 className="h-4 w-4" />{quiz.durationMinutes} minutes</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
