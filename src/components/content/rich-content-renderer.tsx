import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { QuizTaker } from '../quiz/quiz-taker';
import { Callout } from './callout';
import { CodeBlock } from './code-block';
import { CodePlayground } from './code-playground';
import { ProgressCheck } from './progress-check';
import type { ContentBlock } from '@/types/content';

export function RichContentRenderer({ markdown, blocks }: { markdown: string; blocks?: ContentBlock[] }) {
  return (
    <div className="prose prose-base md:prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-a:text-primary dark:prose-invert prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          pre: ({ node, ...props }) => <CodeBlock {...props} />,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';

            // Interactive Quiz Shortcode: ```quiz slug-here ```
            if (lang === 'quiz') {
              const slug = String(children).trim();
              return <QuizTaker slug={slug} />;
            }

            // Interactive Callout Shortcode: ```callout:tone content-here ```
            if (lang.startsWith('callout:')) {
              const tone = lang.split(':')[1] as 'info' | 'warning' | 'success';
              return <Callout tone={tone}>{children}</Callout>;
            }

            // Live Code Playground: ```playground html-here ```
            if (lang === 'playground') {
              return <CodePlayground code={String(children)} />;
            }

            // Progress Milestone: ```progress id:1 text:Setup ``` or list mode
            if (lang === 'progress') {
              return <ProgressCheck content={String(children)} />;
            }

            const isInline = !match && !className?.includes('hljs');
            if (isInline) {
              return <code className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.875em] font-medium text-primary" {...props}>{children}</code>;
            }
            return <code className={className} {...props}>{children}</code>;
          }
        }}
      >
        {markdown}
      </ReactMarkdown>

      {blocks?.map((block) => {
        if (block.type === 'callout') {
          return (
            <Callout key={block.id} tone={block.tone as 'info' | 'warning' | 'success'} title={block.title}>
              {block.content}
            </Callout>
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
