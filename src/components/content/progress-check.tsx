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
    // Parse the content
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const parsed: MilestoneItem[] = [];

    lines.forEach(line => {
      // Try List Mode: - [id] text or * [id] text
      const listMatch = line.match(/^[\s\-\*]*\[([^\]]+)\]\s*(.+)$/);
      if (listMatch) {
        parsed.push({ id: listMatch[1].trim(), text: listMatch[2].trim() });
      } else {
        // Try Key-Value Mode: id: xxx text: yyy
        const idMatch = line.match(/id:\s*([^\s|]+)/);
        const textMatch = line.match(/text:\s*(.+)$/);
        if (idMatch && textMatch) {
          parsed.push({ id: idMatch[1].trim(), text: textMatch[1].trim() });
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
