'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quizSchema, type QuizInput } from '@/features/admin/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const starterQuestions = `[
  {
    "id": "q1",
    "prompt": "Which pattern handles async burst traffic?",
    "options": ["CDN", "Queue", "Hydration", "Tree shaking"],
    "answerIndex": 1,
    "explanation": "Queues smooth spikes and decouple workloads."
  }
]`;

export function QuizForm({ onSubmit }: { onSubmit?: (input: QuizInput) => Promise<unknown> | unknown }) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<QuizInput>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      categorySlug: '',
      difficulty: 'beginner',
      durationMinutes: 10,
      status: 'draft',
      questionsJson: starterQuestions,
    },
  });

  const submit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        await onSubmit?.(values);
        setStatusMessage('Quiz saved successfully.');
      } catch (error) {
        console.error(error);
        setStatusMessage('Unable to save quiz.');
      }
    });
  });

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register('title')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register('slug')} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" {...form.register('excerpt')} className="min-h-[100px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categorySlug">Category</Label>
          <Input id="categorySlug" {...form.register('categorySlug')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            id="difficulty"
            {...form.register('difficulty')}
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm shadow-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duration (minutes)</Label>
          <Input id="durationMinutes" type="number" {...form.register('durationMinutes')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            {...form.register('status')}
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm shadow-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="questionsJson">Questions JSON</Label>
        <Textarea id="questionsJson" className="min-h-[320px] font-mono text-xs" {...form.register('questionsJson')} />
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>Save quiz</Button>
        {statusMessage ? <p className="text-sm text-muted-foreground">{statusMessage}</p> : null}
      </div>
    </form>
  );
}
