import { adminDb } from '@/lib/firebase/admin';

import type { Course, CourseModule } from '@/types/course';

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

  return { items: [] };
}

export async function getCourseBySlug(slug: string) {
  if (adminDb) {
    const snapshot = await adminDb.collection('courses').doc(slug).get();
    if (snapshot.exists) {
      return { ...(snapshot.data() as Course), slug };
    }
  }

  return null;
}

export async function getCourseModule(courseSlug: string, moduleSlug: string) {
  if (adminDb) {
    const snapshot = await adminDb
      .collection('courses')
      .doc(courseSlug)
      .collection('modules')
      .doc(moduleSlug)
      .get();
    
    if (snapshot.exists) {
      return { ...(snapshot.data() as CourseModule), slug: moduleSlug };
    }
  }

  return null;
}
