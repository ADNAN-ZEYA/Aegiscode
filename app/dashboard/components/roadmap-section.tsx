'use client';

import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Code,
  ExternalLink,
  Loader2,
  Map,
  Play,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveRoadmap, markWeekComplete } from '../actions';
import type { RoadmapData, RoadmapResource } from '../actions';

const RESOURCE_META: Record<
  RoadmapResource['type'],
  { label: string; icon: React.ElementType; className: string }
> = {
  aegiscode: { label: 'AegisCode', icon: BookOpen, className: 'text-primary bg-primary/10' },
  youtube:   { label: 'YouTube',   icon: Play,     className: 'text-red-500 bg-red-500/10' },
  gfg:       { label: 'GFG',       icon: Code,     className: 'text-green-600 bg-green-500/10' },
  leetcode:  { label: 'LeetCode',  icon: Code,     className: 'text-orange-500 bg-orange-500/10' },
};

const SYSTEM_PROMPT = `You are a study roadmap generator for AegisCode, an educational platform. Based on the student's goal, create a personalized week-by-week study plan.

For each week include:
- Topics to cover
- Specific AegisCode resources if relevant (DSA, OS, DBMS, Networks, Web Dev, System Design)
- YouTube links for topics not on AegisCode
- GFG/LeetCode links for practice problems

Return response as JSON with this structure (no markdown, no code fences, only the raw JSON object):
{"title":"string","totalWeeks":number,"weeks":[{"week":1,"title":"string","topics":["topic1","topic2"],"resources":[{"type":"aegiscode","title":"Resource title","url":"/study-materials/slug"},{"type":"youtube","title":"Video title","url":"https://youtube.com/..."},{"type":"leetcode","title":"Practice problems","url":"https://leetcode.com/..."}],"dailyHours":number}]}`;

interface Props {
  initialRoadmap: RoadmapData | null;
}

export function RoadmapSection({ initialRoadmap }: Props) {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(initialRoadmap);
  const [showForm, setShowForm] = useState(!initialRoadmap);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const [goal, setGoal] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [dailyHours, setDailyHours] = useState(3);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateStr = minDate.toISOString().split('T')[0];

  async function handleGenerate() {
    if (!goal.trim()) {
      setError('Please describe your learning goal.');
      return;
    }
    if (!targetDate) {
      setError('Please select a target completion date.');
      return;
    }
    setError('');
    setGenerating(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const weeks = Math.max(
        1,
        Math.ceil(
          (new Date(targetDate).getTime() - new Date(today).getTime()) /
            (7 * 24 * 60 * 60 * 1000),
        ),
      );

      const userMessage = `${SYSTEM_PROMPT}

Student goal: ${goal.trim()}
Start date: ${today}
Target completion: ${targetDate}
Daily study hours: ${dailyHours}h/day
Total weeks available: ${weeks}

Generate a ${weeks}-week roadmap. Include 3–5 topics per week and 2–4 relevant resources per week. Be specific and progressive.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }],
          pageContext: { title: 'Study Roadmap Generator', content: '' },
          isNewConversation: false,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error || 'Failed to generate roadmap. Please try again.',
        );
      }

      const data = (await res.json()) as { content: string };
      let parsed: Partial<RoadmapData>;

      try {
        const raw = data.content
          .replace(/^```(?:json)?\s*/m, '')
          .replace(/\s*```$/m, '')
          .trim();
        parsed = JSON.parse(raw);
      } catch {
        throw new Error('Could not parse the generated roadmap. Please try again.');
      }

      if (!Array.isArray(parsed.weeks) || parsed.weeks.length === 0) {
        throw new Error('Generated roadmap was empty. Please try again.');
      }

      const newRoadmap: RoadmapData = {
        goal: goal.trim(),
        title: parsed.title || `Study Roadmap`,
        targetDate,
        dailyHours,
        startDate: today,
        totalWeeks: parsed.totalWeeks || weeks,
        completedWeeks: roadmap?.completedWeeks ?? [],
        weeks: parsed.weeks,
      };

      const result = await saveRoadmap(newRoadmap);
      if (result.error) throw new Error(result.error);

      setRoadmap(newRoadmap);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleWeekToggle(weekNumber: number, checked: boolean) {
    if (!roadmap) return;
    const updatedCompleted = checked
      ? [...(roadmap.completedWeeks ?? []), weekNumber]
      : (roadmap.completedWeeks ?? []).filter((w) => w !== weekNumber);
    setRoadmap({ ...roadmap, completedWeeks: updatedCompleted });
    await markWeekComplete(weekNumber, checked);
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-2xl">
            <Map className="h-5 w-5 text-primary" />
            {roadmap ? 'Regenerate Roadmap' : 'Create Your Study Roadmap'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Describe your goal and we&apos;ll build a week-by-week plan with curated resources.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">What do you want to learn or achieve?</label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. I want to crack Amazon SDE interview, I want to learn web development, I want to clear GATE CS"
              rows={3}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Be specific — the more detail you give, the better your roadmap will be.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target completion date</label>
            <input
              type="date"
              value={targetDate}
              min={minDateStr}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Daily hours available</label>
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-semibold text-primary">
                {dailyHours}h / day
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 hour</span>
              <span>8 hours</span>
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={generating} className="flex-1">
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating roadmap…
                </>
              ) : (
                'Generate My Roadmap'
              )}
            </Button>
            {roadmap && (
              <Button variant="outline" onClick={() => setShowForm(false)} disabled={generating}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Display ─────────────────────────────────────────────────────────────────
  if (!roadmap) return null;

  const completedCount = roadmap.completedWeeks?.length ?? 0;
  const totalWeeks = roadmap.weeks.length;
  const progress = totalWeeks > 0 ? Math.round((completedCount / totalWeeks) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 font-serif text-2xl">
              <Map className="h-5 w-5 shrink-0 text-primary" />
              <span className="break-words whitespace-normal min-w-0">{roadmap.title}</span>
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {roadmap.totalWeeks} weeks &middot; {roadmap.dailyHours}h/day &middot; Target:{' '}
              {new Date(roadmap.targetDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            {roadmap.goal && (
              <p className="mt-1.5 line-clamp-2 text-xs italic text-muted-foreground/70">
                &ldquo;{roadmap.goal}&rdquo;
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {completedCount} of {totalWeeks} weeks complete
            </span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {roadmap.weeks.map((week) => {
            const isCompleted = (roadmap.completedWeeks ?? []).includes(week.week);
            const isExpanded = expandedWeek === week.week;
            const hasResources = (week.resources?.length ?? 0) > 0;

            return (
              <div
                key={week.week}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  isCompleted ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3 p-3">
                  <button
                    onClick={() => handleWeekToggle(week.week, !isCompleted)}
                    className="shrink-0 transition-colors hover:text-primary"
                    title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Wk {week.week}
                      </span>
                      <span
                        className={`min-w-0 break-words whitespace-normal text-sm font-medium leading-snug ${
                          isCompleted ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {week.title}
                      </span>
                    </div>
                  </div>

                  {(week.topics.length > 0 || hasResources) && (
                    <button
                      onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="border-t border-border/50 px-3 pb-4 pt-3 space-y-4">
                    {week.topics.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Topics
                        </p>
                        <ul className="space-y-1">
                          {week.topics.map((t, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                              <span className="min-w-0 break-words">{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {hasResources && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Resources
                        </p>
                        <div className="space-y-1.5">
                          {week.resources!.map((resource, i) => {
                            const meta = RESOURCE_META[resource.type] ?? RESOURCE_META.aegiscode;
                            const Icon = meta.icon;
                            const isExternal = resource.url.startsWith('http');
                            return (
                              <a
                                key={i}
                                href={resource.url}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="flex min-w-0 items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-2.5 py-2 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                              >
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${meta.className}`}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                </span>
                                <span className="min-w-0 flex-1 truncate text-xs font-medium">
                                  {resource.title}
                                </span>
                                {isExternal && (
                                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/50" />
                                )}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
