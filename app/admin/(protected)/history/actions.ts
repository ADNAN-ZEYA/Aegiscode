'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function deleteContentItem(contentType: string, id: string): Promise<void> {
  await requireAdmin();

  if (!adminDb) return;

  const collectionName =
    contentType === 'course' ? 'courses' :
    contentType === 'quiz'   ? 'quizzes' :
                               'content';

  await adminDb.collection(collectionName).doc(id).delete();
  revalidatePath('/admin/history');
}
