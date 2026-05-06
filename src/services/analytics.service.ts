import { adminDb } from '@/lib/firebase/admin';
import type { AnalyticsSnapshot } from '@/types/analytics';

const empty: AnalyticsSnapshot = {
  viewsToday: 0,
  weeklyReaders: 0,
  savedArticles: 0,
  completionRate: 0,
};

export async function getAnalyticsOverview(): Promise<AnalyticsSnapshot> {
  if (!adminDb) return empty;

  const snapshot = await adminDb.collection('analytics').doc('overview').get();
  return snapshot.exists ? (snapshot.data() as AnalyticsSnapshot) : empty;
}
