import { adminDb } from '@/lib/firebase/admin';
import type { Category, PaginatedResult } from '@/types/common';
import type { BlogPost, StudyMaterial } from '@/types/content';

type ContentCollection = 'content';
type ContentItem = BlogPost | StudyMaterial;

interface ListContentOptions {
  category?: string;
  query?: string;
  cursor?: string;
  limit?: number;
  type?: 'blog' | 'studyMaterial';
}

function filterContent<T extends ContentItem>(items: T[], options: ListContentOptions) {
  return items.filter((item) => {
    if (options.category && item.categorySlug !== options.category) {
      return false;
    }

    if (options.query) {
      const needle = options.query.toLowerCase();
      return (
        item.title.toLowerCase().includes(needle) ||
        item.excerpt.toLowerCase().includes(needle) ||
        item.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    }

    return true;
  });
}

async function listFromFirestore<T extends ContentItem>(
  options: ListContentOptions,
): Promise<PaginatedResult<T> | null> {
  if (!adminDb) {
    return null;
  }

  let query = adminDb
    .collection('content')
    .where('status', '==', 'published');

  if (options.type) {
    query = query.where('type', '==', options.type);
  }

  query = query.orderBy('publishedAt', 'desc').limit(options.limit ?? 6);

  if (options.category) {
    query = query.where('categorySlug', '==', options.category);
  }

  if (options.cursor) {
    const cursorDoc = await adminDb.collection('content').doc(options.cursor).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const snapshot = await query.get();
  const items = snapshot.docs.map((doc) => ({ ...(doc.data() as T), slug: doc.id }));
  const filtered = options.query ? filterContent(items, options) : items;

  return {
    items: filtered,
    nextCursor: snapshot.docs.length === (options.limit ?? 6) ? snapshot.docs.at(-1)?.id : undefined,
  };
}

export async function listBlogs(options: ListContentOptions = {}) {
  const firestoreData = await listFromFirestore<BlogPost>({ ...options, type: 'blog' });
  return firestoreData ?? { items: [] };
}

export async function listStudyMaterials(options: ListContentOptions = {}) {
  const firestoreData = await listFromFirestore<StudyMaterial>({ ...options, type: 'studyMaterial' });
  return firestoreData ?? { items: [] };
}

export async function getBlogBySlug(slug: string) {
  if (adminDb) {
    const snapshot = await adminDb.collection('content').doc(slug).get();
    if (snapshot.exists && snapshot.data()?.type === 'blog') {
      return { ...(snapshot.data() as BlogPost), slug };
    }
  }

  return null;
}

export async function getStudyMaterialBySlug(slug: string) {
  if (adminDb) {
    const snapshot = await adminDb.collection('content').doc(slug).get();
    if (snapshot.exists && snapshot.data()?.type === 'studyMaterial') {
      return { ...(snapshot.data() as StudyMaterial), slug };
    }
  }

  return null;
}

export async function listCategories(): Promise<Category[]> {
  if (adminDb) {
    const snapshot = await adminDb.collection('categories').where('status', '==', 'published').get();
    return snapshot.docs.map((doc) => doc.data() as Category);
  }

  return [];
}
