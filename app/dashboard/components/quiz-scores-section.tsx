import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuizAttempt {
  quizId?: string;
  quizTitle?: string;
  score?: number;
  totalQuestions?: number;
  createdAt?: string;
}

interface Props {
  attempts: QuizAttempt[];
}

function scoreBadgeClass(pct: number): string {
  if (pct >= 80) return 'bg-green-500/15 text-green-700';
  if (pct >= 60) return 'bg-yellow-500/15 text-yellow-700';
  return 'bg-red-500/15 text-red-700';
}

export function QuizScoresSection({ attempts }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-2xl">
          <Trophy className="h-5 w-5 text-primary" />
          Recent Quiz Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attempts.length === 0 ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>
            <Link
              href="/quizzes"
              className="inline-block text-xs font-medium text-primary hover:underline"
            >
              Browse quizzes →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {attempts.map((attempt, i) => {
              const pct =
                attempt.totalQuestions && attempt.score !== undefined
                  ? Math.round((attempt.score / attempt.totalQuestions) * 100)
                  : (attempt.score ?? 0);
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{attempt.quizTitle ?? 'Quiz'}</p>
                    <p className="text-xs text-muted-foreground">
                      {attempt.createdAt
                        ? formatDistanceToNow(new Date(attempt.createdAt), { addSuffix: true })
                        : '—'}
                    </p>
                  </div>
                  <Badge className={`shrink-0 font-bold ${scoreBadgeClass(pct)}`}>
                    {pct}%
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
