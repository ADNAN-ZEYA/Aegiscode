export const dynamic = 'force-dynamic';

import { Bot, MessageSquare, Users, Zap } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { getAISettings, getAIAnalytics } from '@/services/chatbot.service';
import { AISettingsForm } from './ai-settings-form';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/30">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default async function AISettingsPage() {
  await requireAdmin();

  const [settings, analytics] = await Promise.all([getAISettings(), getAIAnalytics()]);

  const activeUserCount = Object.keys(analytics.userConversations).length;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 ring-1 ring-violet-500/30">
          <Bot className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Settings</h1>
          <p className="text-sm text-white/40">Configure the student AI tutor chatbot.</p>
        </div>
      </div>

      {/* Usage stats */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/20">
          Today&apos;s Usage
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Conversations Today"
            value={analytics.totalConversations}
            icon={MessageSquare}
            color="bg-violet-500/10 text-violet-400"
          />
          <StatCard
            label="Active Students"
            value={activeUserCount}
            icon={Users}
            color="bg-blue-500/10 text-blue-400"
          />
          <StatCard
            label="Daily Limit / Student"
            value={settings.dailyLimit}
            icon={Zap}
            color="bg-amber-500/10 text-amber-400"
          />
        </div>
      </div>

      {/* Settings form */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/20">
          Configuration
        </p>
        <AISettingsForm settings={settings} />
      </div>
    </div>
  );
}
