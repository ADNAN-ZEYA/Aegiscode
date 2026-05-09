import { Flame, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  streak: number;
  completionPercent: number;
  completedWeeks: number;
  totalWeeks: number;
  daysUntilTarget: number;
}

export function ProgressTracker({
  streak,
  completionPercent,
  completedWeeks,
  totalWeeks,
  daysUntilTarget,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-2xl">
          <TrendingUp className="h-5 w-5 text-primary" />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div
          className={`flex items-center gap-3 rounded-xl p-3 ${
            streak > 0 ? 'bg-orange-500/10' : 'bg-muted/40'
          }`}
        >
          <Flame
            className={`h-6 w-6 shrink-0 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground/50'}`}
          />
          <div>
            <p className="text-2xl font-bold leading-none">{streak}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">day streak</p>
          </div>
          {streak >= 3 && (
            <span className="ml-auto rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-600">
              🔥 On fire
            </span>
          )}
        </div>

        {totalWeeks > 0 ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Roadmap completion</span>
              <span className="font-semibold">{completionPercent}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400 transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {completedWeeks} of {totalWeeks} weeks complete
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-5 text-center">
            <p className="text-sm text-muted-foreground">
              Create a roadmap to start tracking your progress.
            </p>
          </div>
        )}

        {daysUntilTarget > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <Target className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-lg font-bold leading-none">{daysUntilTarget}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">days until target date</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
