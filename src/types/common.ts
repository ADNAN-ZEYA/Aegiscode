export type Role = 'admin' | 'student';

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface AuthorRef {
  id: string;
  name: string;
  image?: string;
  username?: string;
}

export interface SeoFields {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
}

export interface AuditFields {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  slug: string;
  status: ContentStatus;
  tags: string[];
}

export interface Category extends AuditFields {
  name: string;
  description: string;
  color: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
}
