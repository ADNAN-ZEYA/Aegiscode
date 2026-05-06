import { adminDb } from '@/lib/firebase/admin';
import type { UserProfile } from '@/types/user';

export async function getProfileByUsername(username: string): Promise<UserProfile | null> {
  if (!adminDb) return null;
  const snapshot = await adminDb.collection('users').where('username', '==', username).limit(1).get();
  return (snapshot.docs[0]?.data() as UserProfile) ?? null;
}

export async function listUsers(limit = 20): Promise<UserProfile[]> {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection('users').limit(limit).get();
  return snapshot.docs.map((doc) => doc.data() as UserProfile);
}
