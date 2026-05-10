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

  const ref = adminDb.collection('users').doc(input.uid);
  const existing = await ref.get();

  if (!existing.exists) {
    // First-time sign-up: write full profile including computed role
    await ref.set({
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
    });
  } else {
    // Subsequent logins: only sync mutable profile fields, never overwrite role
    await ref.update({
      name: input.name || existing.data()?.name || username,
      email: input.email || '',
      image: input.image ?? existing.data()?.image ?? null,
      updatedAt: now,
    });
  }

  const finalRole: Role = existing.exists
    ? ((existing.data()?.role as Role) ?? role)
    : role;

  return { ok: true, role: finalRole };
}
