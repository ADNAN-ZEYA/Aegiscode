'use client';

import { useState, useTransition } from 'react';
import { CalendarDays, CheckSquare, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateDayProgress } from '../actions';
import type { RoadmapData, ProgressDoc } from '../actions';

interface Props {
  roadmap: RoadmapData | null;
  todayProgress: ProgressDoc | null;
  today: string;
}

export function TodaysSchedule({ roadmap, todayProgress, today }: Props) {
  const [completedTasks, setCompletedTasks] = useState<string[]>(
    todayProgress?.completedTasks ?? [],
  );
  const [, startTransition] = useTransition();

  const todayDate = new Date(today + 'T00:00:00');
  const dayOfWeek = todayDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dateDisplay = todayDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (!roadmap) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-2xl">
            <CalendarDays className="h-5 w-5 text-primary" />
            Today&apos;s Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-border bg-muted/20 py-8 text-center">
            <CalendarDays className="mx-auto mb-3 h-7 w-7 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Create your study roadmap above to see today&apos;s tasks.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const startDate = new Date(roadmap.startDate + 'T00:00:00');
  const daysDiff = Math.floor(
    (todayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const currentWeekNum = Math.min(Math.floor(daysDiff / 7) + 1, roadmap.weeks.length);
  const currentWeek = roadmap.weeks.find((w) => w.week === currentWeekNum);

  const totalTasks = currentWeek?.topics.length ?? 0;
  const completedCount = completedTasks.length;
  const completionPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  function toggleTask(taskId: string) {
    const updated = completedTasks.includes(taskId)
      ? completedTasks.filter((t) => t !== taskId)
      : [...completedTasks, taskId];
    setCompletedTasks(updated);
    startTransition(async () => {
      await updateDayProgress(today, updated);
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="flex items-center gap-2 font-serif text-2xl">
            <CalendarDays className="h-5 w-5 text-primary" />
            Today&apos;s Schedule
          </CardTitle>
          <div className="shrink-0 text-right">
            <p className="text-sm font-medium">{dayOfWeek}</p>
            <p className="text-xs text-muted-foreground">{dateDisplay}</p>
          </div>
        </div>

        {currentWeek && (
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Week {currentWeekNum} &middot; {currentWeek.title}
              </span>
              <span className={completionPct === 100 ? 'font-semibold text-primary' : ''}>
                {completionPct}% done
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!currentWeek ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 py-6 text-center">
            <p className="text-sm font-medium text-primary">
              🎉 You&apos;ve completed all weeks!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentWeek.topics.map((topicText, i) => {
              const taskId = `week${currentWeekNum}-topic${i}`;
              const done = completedTasks.includes(taskId);
              return (
                <button
                  key={taskId}
                  onClick={() => toggleTask(taskId)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                    done
                      ? 'border-primary/20 bg-primary/5 text-muted-foreground'
                      : 'border-border hover:border-primary/30 hover:bg-muted/40'
                  }`}
                >
                  {done ? (
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Square className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={`text-sm leading-relaxed ${done ? 'line-through' : ''}`}>
                    {topicText}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
