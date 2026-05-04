import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { UserProfile } from '@/types/user';

export async function getServerUser() {
  const cookieStore = await cookies();
  const devSessionCookie = cookieStore.get('dev-session')?.value;
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie && devSessionCookie && process.env.NODE_ENV !== 'production') {
    try {
      return JSON.parse(devSessionCookie);
    } catch {
      return null;
    }
  }

  if (!sessionCookie || !adminAuth) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded;
  } catch {
    return null;
  }
}

export async function getServerUserProfile(): Promise<UserProfile | null> {
  const user = await getServerUser();
  if (!user) {
    return null;
  }

  if (!adminDb && process.env.NODE_ENV !== 'production') {
    return {
      uid: user.uid,
      name: user.name || user.email || 'User',
      username: user.email?.split('@')[0] || 'user',
      email: user.email || '',
      image: user.image || null,
      bio: '',
      role: user.role || 'student',
      bookmarksCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.uid,
      slug: user.email?.split('@')[0] || 'user',
      status: 'published',
      tags: ['user'],
    };
  }

  if (!adminDb) {
    return null;
  }

  const snapshot = await adminDb.collection('users').doc(user.uid).get();
  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function requireAuth() {
  const user = await getServerUserProfile();
  if (!user) {
    redirect('/admin/login');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    redirect('/');
  }
  return user;
}
