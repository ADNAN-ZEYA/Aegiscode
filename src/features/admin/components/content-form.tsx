'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentInput, contentSchema } from '@/features/admin/schemas';
import { RichTextEditor } from '@/features/admin/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ContentForm({ onSubmit }: { onSubmit?: (input: ContentInput) => Promise<unknown> | unknown }) {
  const [markdown, setMarkdown] = useState('## Start writing\n\nAdd structured educational content here.');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ContentInput>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      contentType: 'blog',
      title: '',
      slug: '',
      excerpt: '',
      categorySlug: '',
      tags: '',
      markdown,
      status: 'draft',
      coverImage: '',
    },
  });

  const submit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        await onSubmit?.({ ...values, markdown });
        setStatusMessage('Saved successfully.');
      } catch (error) {
        console.error(error);
        setStatusMessage('Unable to save content.');
      }
    });
  });

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contentType">Content type</Label>
          <select
            id="contentType"
            {...form.register('contentType')}
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm shadow-sm"
          >
            <option value="blog">Blog</option>
            <option value="studyMaterial">Study Material</option>
          </select>
        </div>
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
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" {...form.register('tags')} placeholder="firebase, seo, nextjs" />
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
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="coverImage">Cover image URL</Label>
          <Input id="coverImage" {...form.register('coverImage')} />
        </div>
      </div>

      <RichTextEditor value={markdown} onChange={setMarkdown} />

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>Save content</Button>
        {statusMessage ? <p className="text-sm text-muted-foreground">{statusMessage}</p> : null}
      </div>
    </form>
  );
}
