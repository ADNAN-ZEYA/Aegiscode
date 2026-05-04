import { adminDb } from '@/lib/firebase/admin';
import { resolveRoleFromEmail } from '@/lib/role';
import type { Role } from '@/types/common';

export function resolveRole(email?: string | null): Role {
  return resolveRoleFromEmail(email, process.env.ADMIN_EMAILS);
}

export async function upsertUserProfile(input: {
  uid: string;
  email?: string | null;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}) {
  const now = new Date().toISOString();
  const role = resolveRole(input.email);
  const username = input.username || input.email?.split('@')[0] || input.uid.slice(0, 8);

  if (!adminDb) {
    return {
      ok: true,
      role,
      profile: {
        uid: input.uid,
        name: input.name || username,
        username,
        email: input.email || '',
        image: input.image || null,
        bio: '',
        role,
        bookmarksCount: 0,
        createdAt: now,
        updatedAt: now,
        createdBy: input.uid,
        slug: username,
        status: 'published',
        tags: ['user'],
      },
    };
  }

  await adminDb.collection('users').doc(input.uid).set(
    {
      uid: input.uid,
      name: input.name || username,
      username,
      email: input.email || '',
      image: input.image || null,
      bio: '',
      role,
      bookmarksCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: input.uid,
      slug: username,
      status: 'published',
      tags: ['user'],
    },
    { merge: true },
  );

  return { ok: true, role };
}
