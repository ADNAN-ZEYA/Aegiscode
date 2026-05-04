import { adminDb } from '@/lib/firebase/admin';
import { demoUsers } from '@/lib/demo-data';
import type { UserProfile } from '@/types/user';

export async function getProfileByUsername(username: string) {
  if (adminDb) {
    const snapshot = await adminDb.collection('users').where('username', '==', username).limit(1).get();
    return snapshot.docs[0]?.data() as UserProfile | undefined;
  }

  return demoUsers.find((user) => user.username === username) ?? null;
}

export async function listUsers(limit = 20) {
  if (adminDb) {
    const snapshot = await adminDb.collection('users').limit(limit).get();
    return snapshot.docs.map((doc) => doc.data() as UserProfile);
  }

  return demoUsers.slice(0, limit);
}
