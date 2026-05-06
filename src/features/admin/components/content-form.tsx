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

export function ContentForm({ 
  onSubmit,
  initialValues
}: { 
  onSubmit?: (input: ContentInput) => Promise<unknown> | unknown;
  initialValues?: Partial<ContentInput>;
}) {
  const [markdown, setMarkdown] = useState(initialValues?.markdown || '## Start writing\n\nAdd structured educational content here.');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ContentInput>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      contentType: initialValues?.contentType || 'blog',
      title: initialValues?.title || '',
      slug: initialValues?.slug || '',
      excerpt: initialValues?.excerpt || '',
      categorySlug: initialValues?.categorySlug || '',
      tags: initialValues?.tags || '',
      markdown: initialValues?.markdown || markdown,
      status: initialValues?.status || 'draft',
      coverImage: initialValues?.coverImage || '',
      relatedContentSlugs: initialValues?.relatedContentSlugs || '',
      prerequisiteSlugs: initialValues?.prerequisiteSlugs || '',
    },
  });

  const submit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        const result = await onSubmit?.({ ...values, markdown }) as { ok?: boolean; message?: string } | undefined;
        if (result && result.ok === false) {
          setStatusMessage(result.message || 'Unable to save content.');
        } else {
          setStatusMessage('Saved successfully.');
          form.reset();
        }
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
        <div className="space-y-2">
          <Label htmlFor="prerequisiteSlugs">Prerequisite Slugs (comma separated)</Label>
          <Input id="prerequisiteSlugs" {...form.register('prerequisiteSlugs')} placeholder="intro-to-js, basic-auth" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="relatedContentSlugs">Related Slugs (comma separated)</Label>
          <Input id="relatedContentSlugs" {...form.register('relatedContentSlugs')} placeholder="advanced-auth, security-best-practices" />
        </div>
      </div>

      <RichTextEditor value={markdown} onChange={setMarkdown} />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isPending}>Save content</Button>
          {statusMessage ? <p className="text-sm text-muted-foreground">{statusMessage}</p> : null}
        </div>
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="text-sm text-destructive">
            Please fix the following validation errors:
            <ul className="list-disc pl-5 mt-1">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>{field}: {error?.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}
