'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProgressCheck({ id, text }: { id: string; text: string }) {
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
        "my-4 flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-300",
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
        "text-sm font-medium leading-none",
        checked && "line-through opacity-70"
      )}>
        {text}
      </span>
    </div>
  );
}
