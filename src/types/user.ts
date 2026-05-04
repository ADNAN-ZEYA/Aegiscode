import type { AuditFields, Role } from '@/types/common';

export interface UserProfile extends AuditFields {
  uid: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
  role: Role;
  bookmarksCount: number;
}
