'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MilestoneItem {
  id: string;
  text: string;
}

export function ProgressCheck({ content }: { content: string }) {
  const [items, setItems] = useState<MilestoneItem[]>([]);

  useEffect(() => {
    // Split on both literal \n and actual newlines
    const lines = content.split(/\\n|\n/).filter(line => line.trim().startsWith('-'));
    const parsed: MilestoneItem[] = [];

    lines.forEach((line, index) => {
      // Extract text after the dash
      const text = line.trim().substring(1).trim();
      if (text) {
        // Use the text or a hash as ID if no bracketed ID is found
        const idMatch = text.match(/^\[([^\]]+)\]\s*(.+)$/);
        if (idMatch) {
          parsed.push({ id: idMatch[1].trim(), text: idMatch[2].trim() });
        } else {
          parsed.push({ id: `item-${index}`, text: text });
        }
      }
    });

    if (parsed.length === 0 && content.trim()) {
      parsed.push({ id: 'default', text: content.trim() });
    }

    setItems(parsed);
  }, [content]);

  return (
    <div className="my-8 space-y-3">
      {items.map((item) => (
        <MilestoneRow key={item.id} id={item.id} text={item.text} />
      ))}
    </div>
  );
}

function MilestoneRow({ id, text }: { id: string; text: string }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`progress-${id}`);
    if (saved === 'true') {
      setChecked(true);
    }
  }, [id]);

  const toggle = () => {
    const newState = !checked;
    setChecked(newState);
    localStorage.setItem(`progress-${id}`, String(newState));
  };

  return (
    <div 
      onClick={toggle}
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-300",
        checked 
          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-100" 
          : "border-border bg-muted/20 text-muted-foreground hover:border-primary/30"
      )}
    >
      <div className="shrink-0">
        {checked ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        ) : (
          <Circle className="h-6 w-6 text-muted-foreground/30" />
        )}
      </div>
      <span className={cn(
        "text-sm font-medium leading-tight",
        checked && "line-through opacity-70"
      )}>
        {text}
      </span>
    </div>
  );
}
