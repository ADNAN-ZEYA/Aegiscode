import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentBlock } from '@/types/content';

const calloutStyles = {
  info: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-100',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100',
  success: 'border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-100',
};

const calloutIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
};

export function RichContentRenderer({ markdown, blocks }: { markdown: string; blocks?: ContentBlock[] }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-foreground prose-a:text-primary dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {markdown}
      </ReactMarkdown>

      {blocks?.map((block) => {
        if (block.type === 'callout') {
          const tone = block.tone ?? 'info';
          const Icon = calloutIcons[tone];
          return (
            <div key={block.id} className={cn('my-8 rounded-3xl border p-5', calloutStyles[tone])}>
              <div className="mb-2 flex items-center gap-2 font-medium">
                <Icon className="h-4 w-4" />
                {block.title}
              </div>
              <p className="m-0 text-sm leading-7">{block.content}</p>
            </div>
          );
        }

        if (block.type === 'code') {
          return (
            <pre key={block.id} className="my-8 overflow-x-auto rounded-3xl bg-slate-950 p-5 text-sm text-slate-100">
              <code>{block.content}</code>
            </pre>
          );
        }

        if (block.type === 'image' && block.image) {
          return (
            <figure key={block.id} className="my-8 overflow-hidden rounded-3xl border border-border">
              <Image
                src={block.image.src}
                alt={block.image.alt}
                width={1200}
                height={720}
                className="h-auto w-full object-cover"
              />
              {block.image.caption ? <figcaption className="p-4 text-sm text-muted-foreground">{block.image.caption}</figcaption> : null}
            </figure>
          );
        }

        if (block.type === 'table' && block.table) {
          return (
            <div key={block.id} className="my-8 overflow-hidden rounded-3xl border border-border">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    {block.table.headers.map((header) => (
                      <th key={header} className="px-4 py-3 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.table.rows.map((row) => (
                    <tr key={row.join('-')} className="border-t border-border">
                      {row.map((cell) => (
                        <td key={cell} className="px-4 py-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
