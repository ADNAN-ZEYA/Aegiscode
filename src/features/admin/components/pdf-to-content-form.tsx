'use client';

import { useState, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentInput, contentSchema } from '@/features/admin/schemas';
import { RichTextEditor } from '@/features/admin/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUp, Loader2 } from 'lucide-react';

export function PDFToContentForm({ onSubmit }: { onSubmit?: (input: ContentInput) => Promise<unknown> | unknown }) {
  const [markdown, setMarkdown] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ContentInput>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      contentType: 'studyMaterial',
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setStatusMessage('Please upload a valid PDF file.');
      return;
    }

    setIsExtracting(true);
    setStatusMessage('Extracting text from PDF...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract PDF');
      }

      const data = await response.json();
      setMarkdown(data.text || '');
      
      // Auto-fill title based on filename
      if (!form.getValues('title')) {
        const titleFromName = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
        form.setValue('title', titleFromName);
        form.setValue('slug', titleFromName.toLowerCase().replace(/\s+/g, '-'));
      }
      
      setStatusMessage('PDF text extracted successfully! You can now format it.');
    } catch (error) {
      console.error(error);
      setStatusMessage('Error extracting PDF text. Ensure you are an admin and the file is valid.');
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const submit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        const result = await onSubmit?.({ ...values, markdown }) as { ok?: boolean; message?: string } | undefined;
        if (result && result.ok === false) {
          setStatusMessage(result.message || 'Unable to save content.');
        } else {
          setStatusMessage('Saved successfully as Study Material.');
        }
      } catch (error) {
        console.error(error);
        setStatusMessage('Unable to save content.');
      }
    });
  });

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div className="rounded-xl border-2 border-dashed border-border bg-muted/50 p-8 text-center">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {isExtracting ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <FileUp className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Upload PDF Study Material</h3>
            <p className="text-sm text-muted-foreground">
              Select a PDF to extract its text and convert it to readable study material.
            </p>
          </div>
          <Button 
            type="button" 
            variant="secondary" 
            disabled={isExtracting}
            onClick={() => fileInputRef.current?.click()}
          >
            {isExtracting ? 'Extracting...' : 'Select PDF File'}
          </Button>
        </div>
      </div>

      {markdown && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <input type="hidden" {...form.register('contentType')} value="studyMaterial" />
            
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
              <Textarea id="excerpt" {...form.register('excerpt')} className="min-h-[100px]" placeholder="Brief description of this study material" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categorySlug">Topic / Category Slug</Label>
              <Input id="categorySlug" {...form.register('categorySlug')} placeholder="e.g., dsa, operating-system" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" {...form.register('tags')} placeholder="trees, graphs, algorithms" />
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
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover image URL</Label>
              <Input id="coverImage" {...form.register('coverImage')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Extracted Content (Edit to Format)</Label>
            <RichTextEditor value={markdown} onChange={setMarkdown} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isPending}>Save Study Material</Button>
              {statusMessage && (
                <p className={`text-sm ${statusMessage.includes('Error') || statusMessage.includes('Unable') || statusMessage.includes('not configured') ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {statusMessage}
                </p>
              )}
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
        </>
      )}
    </form>
  );
}
