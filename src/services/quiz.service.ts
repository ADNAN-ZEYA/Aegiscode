import { adminDb } from '@/lib/firebase/admin';
import { demoQuizzes } from '@/lib/demo-data';
import type { PaginatedResult } from '@/types/common';
import type { Quiz } from '@/types/quiz';

export async function listQuizzes(limit = 12): Promise<PaginatedResult<Quiz>> {
  if (adminDb) {
    const snapshot = await adminDb
      .collection('quizzes')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(limit)
      .get();

    return {
      items: snapshot.docs.map((doc) => ({ ...(doc.data() as Quiz), slug: doc.id })),
      nextCursor: snapshot.docs.length === limit ? snapshot.docs.at(-1)?.id : undefined,
    };
  }

  return { items: demoQuizzes.slice(0, limit) };
}

export async function getQuizBySlug(slug: string) {
  if (adminDb) {
    const snapshot = await adminDb.collection('quizzes').doc(slug).get();
    if (snapshot.exists) {
      return { ...(snapshot.data() as Quiz), slug };
    }
  }

  return demoQuizzes.find((quiz) => quiz.slug === slug) ?? null;
}
