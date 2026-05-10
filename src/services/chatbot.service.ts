import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import type { AISettings, AIAnalytics } from '@/types/chatbot';

const DEFAULT_SETTINGS: AISettings = {
  enabled: true,
  systemPrompt: '',
  dailyLimit: 20,
  roadmapEnabled: true,
  roadmapSystemPrompt: '',
  plannerEnabled: true,
  maxRoadmapWeeks: 12,
};

const EMPTY_ANALYTICS: AIAnalytics = {
  date: '',
  totalConversations: 0,
  userConversations: {},
};

export async function getAISettings(): Promise<AISettings> {
  if (!adminDb) return DEFAULT_SETTINGS;

  const doc = await adminDb.collection('settings').doc('ai').get();
  if (!doc.exists) return DEFAULT_SETTINGS;

  return { ...DEFAULT_SETTINGS, ...(doc.data() as Partial<AISettings>) };
}

export async function updateAISettings(settings: Partial<AISettings>): Promise<void> {
  if (!adminDb) return;
  await adminDb.collection('settings').doc('ai').set(settings, { merge: true });
}

export async function getAIAnalytics(): Promise<AIAnalytics> {
  if (!adminDb) return EMPTY_ANALYTICS;

  const doc = await adminDb.collection('analytics').doc('ai').get();
  const today = new Date().toISOString().split('T')[0];

  if (!doc.exists) return { ...EMPTY_ANALYTICS, date: today };

  const data = doc.data() as AIAnalytics;

  // Reset counts if the stored date is from a previous day
  if (data.date !== today) {
    return { date: today, totalConversations: 0, userConversations: {} };
  }

  return data;
}

export async function getUserDailyCount(uid: string): Promise<number> {
  const analytics = await getAIAnalytics();
  return analytics.userConversations[uid] ?? 0;
}

export async function incrementConversation(uid: string): Promise<void> {
  if (!adminDb) return;

  const today = new Date().toISOString().split('T')[0];
  const ref = adminDb.collection('analytics').doc('ai');
  const doc = await ref.get();

  if (!doc.exists || (doc.data() as AIAnalytics).date !== today) {
    await ref.set({
      date: today,
      totalConversations: 1,
      userConversations: { [uid]: 1 },
    });
  } else {
    await ref.update({
      totalConversations: FieldValue.increment(1),
      [`userConversations.${uid}`]: FieldValue.increment(1),
    });
  }
}
