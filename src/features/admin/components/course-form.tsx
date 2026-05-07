'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, type CourseInput } from '@/features/admin/course-schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const starterModules = `[
  {
    "id": "module-1",
    "title": "Module title",
    "slug": "module-title",
    "summary": "Short module summary.",
    "markdown": "## Lesson heading\\n\\nReadable text content from the admin PDF source goes here.",
    "order": 1,
    "estimatedMinutes": 30,
    "sourcePdfPath": "courses/course-slug/module-1-source.pdf"
  }
]`;

export function CourseForm({ 
  onSubmit, 
  initialValues 
}: { 
  onSubmit?: (input: CourseInput) => Promise<unknown> | unknown;
  initialValues?: Partial<CourseInput>;
}) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialValues?.title || '',
      slug: initialValues?.slug || '',
      excerpt: initialValues?.excerpt || '',
      categorySlug: initialValues?.categorySlug || '',
      level: initialValues?.level || 'beginner',
      estimatedHours: initialValues?.estimatedHours || 10,
      tags: initialValues?.tags || 'course, engineering',
      status: initialValues?.status || 'draft',
      courseFolder: initialValues?.courseFolder || 'courses/course-slug',
      sourcePdfPath: initialValues?.sourcePdfPath || 'courses/course-slug/master-source.pdf',
      modulesJson: initialValues?.modulesJson || starterModules,
      coverImage: initialValues?.coverImage || '',
      isPremium: initialValues?.isPremium || false,
      price: initialValues?.price || 0,
    },
  });

  const isPremium = form.watch('isPremium');

  const submit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        await onSubmit?.(values);
        setStatusMessage('Course saved successfully.');
      } catch (error) {
        console.error(error);
        setStatusMessage('Unable to save course.');
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
          <Label htmlFor="level">Level</Label>
          <select id="level" {...form.register('level')} className="flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm shadow-sm">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedHours">Estimated hours</Label>
          <Input id="estimatedHours" type="number" {...form.register('estimatedHours')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" {...form.register('status')} className="flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm shadow-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" {...form.register('tags')} placeholder="course, engineering, dsa" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseFolder">Course folder path</Label>
          <Input id="courseFolder" {...form.register('courseFolder')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sourcePdfPath">Master PDF source path</Label>
          <Input id="sourcePdfPath" {...form.register('sourcePdfPath')} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="coverImage">Cover image URL</Label>
          <Input id="coverImage" {...form.register('coverImage')} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" {...form.register('isPremium')} />
          Premium course
        </label>
        {isPremium ? (
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" {...form.register('price')} />
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="modulesJson">Modules JSON</Label>
        <Textarea id="modulesJson" className="min-h-[340px] font-mono text-xs" {...form.register('modulesJson')} />
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        Admin workflow: upload source PDFs into the course folder, then convert each module into readable structured text so students only consume text on the public site.
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>Save course</Button>
        {statusMessage ? <p className="text-sm text-muted-foreground">{statusMessage}</p> : null}
      </div>
    </form>
  );
}
