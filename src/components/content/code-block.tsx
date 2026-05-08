'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  // Extract raw text from the code element's children
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && typeof node === 'object' && node.props && node.props.children) {
      return extractText(node.props.children);
    }
    return '';
  };

  const copyToClipboard = () => {
    const text = extractText(children);
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative my-8 overflow-hidden rounded-2xl border border-border bg-[hsl(var(--code-bg))] shadow-xl transition-colors">
      <div className="flex h-10 w-full items-center justify-between border-b border-border bg-muted/30 px-4">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
          <div className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <button
          onClick={copyToClipboard}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="relative">
        <pre className={`max-h-[60vh] overflow-x-auto overflow-y-auto p-5 text-sm leading-relaxed whitespace-pre text-[hsl(var(--code-foreground))] ${className || ''}`} {...props}>
          {children}
        </pre>
        {/* Mobile Scroll Hint Gradient */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-[hsl(var(--code-bg))] to-transparent opacity-0 transition-opacity md:hidden" />
      </div>
    </div>
  );
}
