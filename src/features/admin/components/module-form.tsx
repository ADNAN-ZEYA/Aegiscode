'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { moduleSchema, type ModuleInput } from '@/features/admin/course-schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveModuleAction } from '@/features/admin/actions';
import { useRouter } from 'next/navigation';

export function ModuleForm({ 
  courseSlug,
  initialValues 
}: { 
  courseSlug: string;
  initialValues?: Partial<ModuleInput>;
}) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ModuleInput>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      courseSlug: courseSlug,
      id: initialValues?.id || `module-${Date.now()}`,
      title: initialValues?.title || '',
      slug: initialValues?.slug || '',
      summary: initialValues?.summary || '',
      markdown: initialValues?.markdown || '',
      order: initialValues?.order || 1,
      estimatedMinutes: initialValues?.estimatedMinutes || 30,
    },
  });

  const submit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        const result = await saveModuleAction(values);
        if (result.ok) {
          setStatusMessage('Module saved successfully.');
          router.refresh();
        } else {
          setStatusMessage(result.message || 'Unable to save module.');
        }
      } catch (error) {
        console.error(error);
        setStatusMessage('Unable to save module.');
      }
    });
  });

  return (
    <form className="space-y-6" onSubmit={submit}>
      <input type="hidden" {...form.register('courseSlug')} />
      <input type="hidden" {...form.register('id')} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Module Title</Label>
          <Input id="title" {...form.register('title')} placeholder="e.g. Introduction to React" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Module Slug</Label>
          <Input id="slug" {...form.register('slug')} placeholder="e.g. intro-to-react" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="summary">Short Summary</Label>
          <Textarea id="summary" {...form.register('summary')} className="min-h-[80px]" placeholder="Briefly describe what this module covers..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" type="number" {...form.register('order')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedMinutes">Estimated Minutes</Label>
          <Input id="estimatedMinutes" type="number" {...form.register('estimatedMinutes')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="markdown">Content (Markdown)</Label>
        <Textarea id="markdown" className="min-h-[500px] font-mono text-sm leading-relaxed" {...form.register('markdown')} placeholder="# Start writing your lesson here..." />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Module'}
        </Button>
        {statusMessage ? (
          <p className={`text-sm ${statusMessage.includes('successfully') ? 'text-emerald-600' : 'text-destructive'}`}>
            {statusMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
