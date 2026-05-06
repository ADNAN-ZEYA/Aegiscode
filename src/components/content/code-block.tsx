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
    <div className="group relative my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14] shadow-xl">
      <div className="flex h-10 w-full items-center justify-between border-b border-white/5 bg-white/[0.02] px-4">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <button
          onClick={copyToClipboard}
          className="flex h-6 w-6 items-center justify-center rounded-md text-white/30 transition hover:bg-white/10 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="relative">
        <pre className={`max-h-[60vh] overflow-x-auto overflow-y-auto p-5 text-sm leading-relaxed text-slate-100 ${className || ''}`} {...props}>
          {children}
        </pre>
        {/* Mobile Scroll Hint Gradient */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-[#0c0c14] to-transparent opacity-0 transition-opacity md:hidden" />
      </div>
    </div>
  );
}
