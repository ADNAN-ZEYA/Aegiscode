import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CalloutTone = 'info' | 'warning' | 'success';

const styles = {
  info: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-100',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100',
  success: 'border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-100',
};

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
};

export function Callout({ 
  tone = 'info', 
  title, 
  children 
}: { 
  tone?: CalloutTone; 
  title?: string; 
  children: React.ReactNode 
}) {
  const Icon = icons[tone];
  return (
    <div className={cn('my-8 rounded-3xl border p-5', styles[tone])}>
      <div className="mb-2 flex items-center gap-2 font-medium">
        <Icon className="h-4 w-4" />
        {title || tone.charAt(0).toUpperCase() + tone.slice(1)}
      </div>
      <div className="text-sm leading-7 prose-p:my-0">
        {children}
      </div>
    </div>
  );
}
