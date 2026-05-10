'use client';

import { useActionState, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AISettings } from '@/types/chatbot';
import { saveAISettings } from './actions';

interface Props {
  settings: AISettings;
}

function Toggle({
  name,
  checked,
  onChange,
  activeLabel,
  inactiveLabel,
}: {
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <input type="hidden" name={name} value={checked ? 'true' : 'false'} />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
          checked ? 'bg-violet-500' : 'bg-white/10',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium',
          checked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30',
        )}
      >
        <span
          className={cn('h-1.5 w-1.5 rounded-full', checked ? 'bg-emerald-400' : 'bg-white/20')}
        />
        {checked ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20">{label}</p>
  );
}

export function AISettingsForm({ settings }: Props) {
  const [state, action, isPending] = useActionState(saveAISettings, null);

  const [enabled, setEnabled] = useState(settings.enabled);
  const [roadmapEnabled, setRoadmapEnabled] = useState(settings.roadmapEnabled ?? true);
  const [plannerEnabled, setPlannerEnabled] = useState(settings.plannerEnabled ?? true);

  return (
    <form action={action} className="space-y-8">
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

      {/* ── Chatbot ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader label="Chatbot" />

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Chatbot Status</p>
              <p className="mt-0.5 text-xs text-white/40">
                When disabled, students cannot start new conversations.
              </p>
            </div>
            <Toggle
              name="enabled"
              checked={enabled}
              onChange={setEnabled}
              activeLabel="Chatbot is active"
              inactiveLabel="Chatbot is disabled"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-3">
          <div>
            <label htmlFor="systemPrompt" className="text-sm font-medium text-white">
              Custom Instructions
            </label>
            <p className="mt-0.5 text-xs text-white/40">
              Appended to the default system prompt. Add subject-specific guidance, tone
              requirements, or topic restrictions.
            </p>
          </div>
          <textarea
            id="systemPrompt"
            name="systemPrompt"
            defaultValue={settings.systemPrompt}
            rows={5}
            placeholder="e.g. Focus on first-year undergraduate CS concepts. Always encourage the student to re-read the relevant section before answering."
            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
          />
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-3">
          <div>
            <label htmlFor="dailyLimit" className="text-sm font-medium text-white">
              Daily Conversation Limit per Student
            </label>
            <p className="mt-0.5 text-xs text-white/40">
              Maximum new conversations each student can start per day. Range: 1–200.
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
      </div>

      {/* ── Study Roadmap ────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader label="Study Roadmap" />

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Roadmap Feature</p>
              <p className="mt-0.5 text-xs text-white/40">
                When disabled, the &quot;Create My Roadmap&quot; section is hidden for all students.
              </p>
            </div>
            <Toggle
              name="roadmapEnabled"
              checked={roadmapEnabled}
              onChange={setRoadmapEnabled}
              activeLabel="Roadmap is active"
              inactiveLabel="Roadmap is disabled"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-3">
          <div>
            <label htmlFor="roadmapSystemPrompt" className="text-sm font-medium text-white">
              Roadmap Generation Instructions
            </label>
            <p className="mt-0.5 text-xs text-white/40">
              Extra instructions appended when generating student roadmaps. Leave blank to use the
              default prompt.
            </p>
          </div>
          <textarea
            id="roadmapSystemPrompt"
            name="roadmapSystemPrompt"
            defaultValue={settings.roadmapSystemPrompt ?? ''}
            rows={4}
            placeholder="e.g. Always prioritise AegisCode study materials over external links. Include at least two GFG practice links per week."
            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
          />
        </div>
      </div>

      {/* ── Daily Planner ────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeader label="Daily Planner" />

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Daily Planner Feature</p>
              <p className="mt-0.5 text-xs text-white/40">
                When disabled, the &quot;Today&apos;s Schedule&quot; section is hidden from the
                student dashboard.
              </p>
            </div>
            <Toggle
              name="plannerEnabled"
              checked={plannerEnabled}
              onChange={setPlannerEnabled}
              activeLabel="Planner is active"
              inactiveLabel="Planner is disabled"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 space-y-3">
          <div>
            <label htmlFor="maxRoadmapWeeks" className="text-sm font-medium text-white">
              Maximum Roadmap Length (weeks)
            </label>
            <p className="mt-0.5 text-xs text-white/40">
              Students cannot generate roadmaps longer than this. Range: 1–52.
            </p>
          </div>
          <input
            id="maxRoadmapWeeks"
            name="maxRoadmapWeeks"
            type="number"
            min={1}
            max={52}
            defaultValue={settings.maxRoadmapWeeks ?? 12}
            className="w-32 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
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
