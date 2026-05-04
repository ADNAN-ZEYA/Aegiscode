import { adminDb } from '@/lib/firebase/admin';
import { demoCourses } from '@/lib/demo-data';
import type { PaginatedResult } from '@/types/common';
import type { Course } from '@/types/course';

function paginate(items: Course[], cursor?: string, limit = 6): PaginatedResult<Course> {
  const startIndex = cursor ? items.findIndex((item) => item.slug === cursor) + 1 : 0;
  const pageItems = items.slice(startIndex, startIndex + limit);
  return {
    items: pageItems,
    nextCursor: pageItems.length === limit ? pageItems.at(-1)?.slug : undefined,
  };
}

export async function listCourses({
  query,
  category,
  cursor,
  limit = 6,
}: {
  query?: string;
  category?: string;
  cursor?: string;
  limit?: number;
} = {}) {
  if (adminDb) {
    let firestoreQuery = adminDb
      .collection('courses')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(limit);

    if (category) {
      firestoreQuery = firestoreQuery.where('categorySlug', '==', category);
    }

    if (cursor) {
      const cursorDoc = await adminDb.collection('courses').doc(cursor).get();
      if (cursorDoc.exists) {
        firestoreQuery = firestoreQuery.startAfter(cursorDoc);
      }
    }

    const snapshot = await firestoreQuery.get();
    const items = snapshot.docs.map((doc) => ({ ...(doc.data() as Course), slug: doc.id }));
    const filtered = query
      ? items.filter((item) => {
          const needle = query.toLowerCase();
          return item.title.toLowerCase().includes(needle) || item.excerpt.toLowerCase().includes(needle);
        })
      : items;

    return {
      items: filtered,
      nextCursor: snapshot.docs.length === limit ? snapshot.docs.at(-1)?.id : undefined,
    };
  }

  const filtered = demoCourses.filter((course) => {
    if (category && course.categorySlug !== category) return false;
    if (query) {
      const needle = query.toLowerCase();
      return course.title.toLowerCase().includes(needle) || course.excerpt.toLowerCase().includes(needle);
    }
    return true;
  });
  return paginate(filtered, cursor, limit);
}

export async function getCourseBySlug(slug: string) {
  if (adminDb) {
    const snapshot = await adminDb.collection('courses').doc(slug).get();
    if (snapshot.exists) {
      return { ...(snapshot.data() as Course), slug };
    }
  }

  return demoCourses.find((course) => course.slug === slug) ?? null;
}
