import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getQuizBySlug } from '@/services/quiz.service';
import { ViewTracker } from '@/components/content/view-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  return buildMetadata({
    title: quiz?.seo.title ?? 'Quiz not found',
    description: quiz?.seo.description ?? 'Quiz unavailable.',
    path: `/quizzes/${slug}`,
  });
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
      <ViewTracker slug={quiz.slug} type="quiz" />
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{quiz.categorySlug.replace(/-/g, ' ')}</p>
        <h1 className="font-serif text-4xl">{quiz.title}</h1>
        <p className="text-muted-foreground">{quiz.excerpt}</p>
      </div>
      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-xl">{index + 1}. {question.prompt}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option) => (
                <label key={option} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 text-sm">
                  <input type="radio" name={question.id} value={option} className="mt-1" />
                  <span>{option}</span>
                </label>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
