'use client';

import { useActionState, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AISettings } from '@/types/chatbot';
import { saveAISettings } from './actions';

interface Props {
  settings: AISettings;
}

export function AISettingsForm({ settings }: Props) {
  const [state, action, isPending] = useActionState(saveAISettings, null);
  const [enabled, setEnabled] = useState(settings.enabled);

  return (
    <form action={action} className="space-y-6">
      {/* Status feedback */}
      {state && (
        <div
          className={cn(
            'rounded-xl border px-4 py-3 text-sm',
            state.success
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400',
          )}
        >
          {state.message}
        </div>
      )}

      {/* Enable / Disable toggle */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Chatbot Status</p>
            <p className="mt-0.5 text-xs text-white/40">
              When disabled, students cannot start new conversations.
            </p>
          </div>

          {/* Hidden field carries the real value */}
          <input type="hidden" name="enabled" value={enabled ? 'true' : 'false'} />

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
              enabled ? 'bg-violet-500' : 'bg-white/10',
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                enabled ? 'translate-x-5' : 'translate-x-0',
              )}
            />
          </button>
        </div>

        <p
          className={cn(
            'mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium',
            enabled
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-white/5 text-white/30',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              enabled ? 'bg-emerald-400' : 'bg-white/20',
            )}
          />
          {enabled ? 'Chatbot is active' : 'Chatbot is disabled'}
        </p>
      </div>

      {/* System prompt */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-3">
        <div>
          <label htmlFor="systemPrompt" className="text-sm font-medium text-white">
            Custom Instructions
          </label>
          <p className="mt-0.5 text-xs text-white/40">
            Appended to the default system prompt. Use this to add subject-specific guidance,
            tone requirements, or topic restrictions.
          </p>
        </div>
        <textarea
          id="systemPrompt"
          name="systemPrompt"
          defaultValue={settings.systemPrompt}
          rows={5}
          placeholder="e.g. Focus on first-year undergraduate electrical engineering concepts. Always encourage the student to re-read the relevant section."
          className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
        />
      </div>

      {/* Daily limit */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-3">
        <div>
          <label htmlFor="dailyLimit" className="text-sm font-medium text-white">
            Daily Conversation Limit per Student
          </label>
          <p className="mt-0.5 text-xs text-white/40">
            Maximum number of new conversations each student can start per day. Range: 1–200.
          </p>
        </div>
        <input
          id="dailyLimit"
          name="dailyLimit"
          type="number"
          min={1}
          max={200}
          defaultValue={settings.dailyLimit}
          className="w-32 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
