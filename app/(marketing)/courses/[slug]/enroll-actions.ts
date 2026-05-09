'use server';

import { revalidatePath } from 'next/cache';
import { getServerUserProfile } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function enrollInCourse(
  courseId: string,
  courseTitle: string,
): Promise<{ error?: string }> {
  try {
    const user = await getServerUserProfile();
    if (!user || !adminDb) return { error: 'Not authenticated' };

    const existing = await adminDb
      .collection('enrollments')
      .where('userId', '==', user.uid)
      .where('courseId', '==', courseId)
      .limit(1)
      .get();

    if (!existing.empty) return {};

    const now = new Date().toISOString();
    await adminDb.collection('enrollments').add({
      userId: user.uid,
      courseId,
      courseTitle,
      enrolledAt: now,
      lastAccessedAt: now,
      progress: 0,
    });

    revalidatePath(`/courses/${courseId}`);
    return {};
  } catch {
    return { error: 'Failed to enroll. Please try again.' };
  }
}
