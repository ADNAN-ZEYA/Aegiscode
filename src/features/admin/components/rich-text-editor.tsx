'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RichContentRenderer } from '@/components/content/rich-content-renderer';

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Tabs defaultValue="write">
      <TabsList>
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write">
        <Textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-[420px]" />
      </TabsContent>
      <TabsContent value="preview">
        <div className="rounded-3xl border border-border p-6">
          <RichContentRenderer markdown={value} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
