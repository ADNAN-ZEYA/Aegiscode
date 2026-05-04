import { adminDb } from '@/lib/firebase/admin';
import { demoBlogs, demoCategories, demoStudyMaterials } from '@/lib/demo-data';
import type { Category, PaginatedResult } from '@/types/common';
import type { BlogPost, StudyMaterial } from '@/types/content';

type ContentCollection = 'blogs' | 'studyMaterials';
type ContentItem = BlogPost | StudyMaterial;

interface ListContentOptions {
  category?: string;
  query?: string;
  cursor?: string;
  limit?: number;
}

function paginate<T extends { slug: string }>(items: T[], cursor?: string, limit = 6): PaginatedResult<T> {
  const startIndex = cursor ? items.findIndex((item) => item.slug === cursor) + 1 : 0;
  const pageItems = items.slice(startIndex, startIndex + limit);
  const last = pageItems.at(-1);

  return {
    items: pageItems,
    nextCursor: pageItems.length === limit && last ? last.slug : undefined,
  };
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
  collectionName: ContentCollection,
  options: ListContentOptions,
): Promise<PaginatedResult<T> | null> {
  if (!adminDb) {
    return null;
  }

  let query = adminDb
    .collection(collectionName)
    .where('status', '==', 'published')
    .orderBy('publishedAt', 'desc')
    .limit(options.limit ?? 6);

  if (options.category) {
    query = query.where('categorySlug', '==', options.category);
  }

  if (options.cursor) {
    const cursorDoc = await adminDb.collection(collectionName).doc(options.cursor).get();
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
  const firestoreData = await listFromFirestore<BlogPost>('blogs', options);
  if (firestoreData) {
    return firestoreData;
  }

  return paginate(filterContent(demoBlogs, options), options.cursor, options.limit);
}

export async function listStudyMaterials(options: ListContentOptions = {}) {
  const firestoreData = await listFromFirestore<StudyMaterial>('studyMaterials', options);
  if (firestoreData) {
    return firestoreData;
  }

  return paginate(filterContent(demoStudyMaterials, options), options.cursor, options.limit);
}

export async function getBlogBySlug(slug: string) {
  if (adminDb) {
    const snapshot = await adminDb.collection('blogs').doc(slug).get();
    if (snapshot.exists) {
      return { ...(snapshot.data() as BlogPost), slug };
    }
  }

  return demoBlogs.find((item) => item.slug === slug) ?? null;
}

export async function getStudyMaterialBySlug(slug: string) {
  if (adminDb) {
    const snapshot = await adminDb.collection('studyMaterials').doc(slug).get();
    if (snapshot.exists) {
      return { ...(snapshot.data() as StudyMaterial), slug };
    }
  }

  return demoStudyMaterials.find((item) => item.slug === slug) ?? null;
}

export async function listCategories(): Promise<Category[]> {
  if (adminDb) {
    const snapshot = await adminDb.collection('categories').where('status', '==', 'published').get();
    return snapshot.docs.map((doc) => doc.data() as Category);
  }

  return demoCategories;
}
