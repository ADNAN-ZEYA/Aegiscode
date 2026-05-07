import { AlertTriangle, CheckCircle2, Info, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CalloutTone = 'info' | 'warning' | 'success' | 'tip';

const styles = {
  info: 'border-blue-500/30 bg-blue-500/5 text-blue-900 dark:text-blue-100',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100',
  tip: 'border-violet-500/30 bg-violet-500/10 text-violet-900 dark:text-violet-100',
};

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  tip: Lightbulb,
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
  const Icon = icons[tone] || Info;
  const styleClass = styles[tone] || styles.info;

  return (
    <div className={cn('my-8 rounded-3xl border p-5', styleClass)}>
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
