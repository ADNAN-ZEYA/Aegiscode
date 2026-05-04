import { adminDb } from '@/lib/firebase/admin';
import { demoAnalytics } from '@/lib/demo-data';
import type { AnalyticsSnapshot } from '@/types/analytics';

export async function getAnalyticsOverview(): Promise<AnalyticsSnapshot> {
  if (!adminDb) {
    return demoAnalytics;
  }

  const snapshot = await adminDb.collection('analytics').doc('overview').get();
  return snapshot.exists ? (snapshot.data() as AnalyticsSnapshot) : demoAnalytics;
}
