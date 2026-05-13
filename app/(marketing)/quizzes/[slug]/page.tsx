import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getQuizBySlug } from '@/services/quiz.service';
import { ViewTracker } from '@/components/content/view-tracker';
import { QuizTaker } from '@/components/quiz/quiz-taker';

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
        <h1 className="font-serif text-3xl sm:text-4xl">{quiz.title}</h1>
        <p className="text-muted-foreground">{quiz.excerpt}</p>
      </div>
      <QuizTaker questions={quiz.questions} />
    </div>
  );
}
