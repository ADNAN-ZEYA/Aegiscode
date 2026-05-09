'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Loader2,
  Map,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveRoadmap, markWeekComplete } from '../actions';
import type { RoadmapData } from '../actions';

const TOPICS = [
  'DSA',
  'Operating Systems',
  'DBMS',
  'Computer Networks',
  'Web Development',
  'System Design',
];

interface Props {
  initialRoadmap: RoadmapData | null;
}

export function RoadmapSection({ initialRoadmap }: Props) {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(initialRoadmap);
  const [showForm, setShowForm] = useState(!initialRoadmap);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const [topic, setTopic] = useState('DSA');
  const [targetDate, setTargetDate] = useState('');
  const [dailyHours, setDailyHours] = useState(3);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateStr = minDate.toISOString().split('T')[0];

  async function handleGenerate() {
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

      const prompt = `You are a structured study roadmap generator for engineering students.

Generate a ${weeks}-week study roadmap for the topic: ${topic}
- Daily study time available: ${dailyHours} hour${dailyHours > 1 ? 's' : ''}
- Start date: ${today}
- Target completion: ${targetDate}

Respond with ONLY a valid JSON object — no markdown, no code fences, no explanation before or after:
{"title":"string","totalWeeks":${weeks},"weeks":[{"week":1,"title":"string","topics":["specific topic 1","specific topic 2","specific topic 3","specific topic 4"]}]}

Rules:
- 3 to 5 specific, actionable topics per week
- Progressive difficulty from foundations to advanced
- Realistic for ${dailyHours}h/day
- Week titles should be thematic (e.g. "Arrays & Recursion", not "Week 1")`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          pageContext: { title: 'Study Roadmap Generator', content: '' },
          isNewConversation: false,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Failed to generate roadmap. Please try again.');
      }

      const data = await res.json() as { content: string };
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
        topic,
        title: parsed.title || `${topic} Study Roadmap`,
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

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-2xl">
            <Map className="h-5 w-5 text-primary" />
            {roadmap ? 'Regenerate Roadmap' : 'Create Your Study Roadmap'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tell us what you want to learn and we&apos;ll build a personalised week-by-week plan.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">What do you want to learn?</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
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
              <span className="truncate">{roadmap.title}</span>
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {roadmap.totalWeeks} weeks &middot; {roadmap.dailyHours}h/day &middot; Target:{' '}
              {new Date(roadmap.targetDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
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
            return (
              <div
                key={week.week}
                className={`rounded-xl border transition-colors ${
                  isCompleted
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-muted/30'
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Wk {week.week}
                      </span>
                      <span
                        className={`truncate text-sm font-medium ${
                          isCompleted ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {week.title}
                      </span>
                    </div>
                  </div>
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
                </div>

                {isExpanded && (
                  <div className="border-t border-border/50 px-4 pb-3 pt-2">
                    <ul className="space-y-1.5">
                      {week.topics.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                          {t}
                        </li>
                      ))}
                    </ul>
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
