import type { Role } from '@/types/common';

export function resolveRoleFromEmail(email?: string | null, adminList?: string | null): Role {
  const adminEmails = (adminList ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (email && adminEmails.includes(email.toLowerCase())) {
    return 'admin';
  }

  return 'student';
}
