'use server';

import { revalidatePath } from 'next/cache';
import { getServerUserProfile } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export interface RoadmapWeek {
  week: number;
  title: string;
  topics: string[];
}

export interface RoadmapData {
  topic: string;
  title: string;
  targetDate: string;
  dailyHours: number;
  startDate: string;
  totalWeeks: number;
  completedWeeks: number[];
  weeks: RoadmapWeek[];
  savedAt?: string;
}

export interface ProgressDoc {
  date: string;
  completedTasks: string[];
  updatedAt?: string;
}

export async function saveRoadmap(roadmapData: RoadmapData): Promise<{ error?: string }> {
  try {
    const user = await getServerUserProfile();
    if (!user || !adminDb) return { error: 'Not authenticated' };

    await adminDb
      .collection('users')
      .doc(user.uid)
      .collection('roadmap')
      .doc('current')
      .set({ ...roadmapData, savedAt: new Date().toISOString() });

    revalidatePath('/dashboard');
    return {};
  } catch {
    return { error: 'Failed to save roadmap' };
  }
}

export async function updateDayProgress(date: string, completedTasks: string[]): Promise<{ error?: string }> {
  try {
    const user = await getServerUserProfile();
    if (!user || !adminDb) return { error: 'Not authenticated' };

    await adminDb
      .collection('users')
      .doc(user.uid)
      .collection('progress')
      .doc(date)
      .set({ date, completedTasks, updatedAt: new Date().toISOString() }, { merge: true });

    revalidatePath('/dashboard');
    return {};
  } catch {
    return { error: 'Failed to update progress' };
  }
}

export async function markWeekComplete(weekNumber: number, completed: boolean): Promise<{ error?: string }> {
  try {
    const user = await getServerUserProfile();
    if (!user || !adminDb) return { error: 'Not authenticated' };

    const roadmapRef = adminDb
      .collection('users')
      .doc(user.uid)
      .collection('roadmap')
      .doc('current');

    const doc = await roadmapRef.get();
    if (!doc.exists) return { error: 'No roadmap found' };

    const completedWeeks: number[] = (doc.data()?.completedWeeks as number[]) || [];

    if (completed && !completedWeeks.includes(weekNumber)) {
      completedWeeks.push(weekNumber);
    } else if (!completed) {
      const idx = completedWeeks.indexOf(weekNumber);
      if (idx > -1) completedWeeks.splice(idx, 1);
    }

    await roadmapRef.update({ completedWeeks });
    revalidatePath('/dashboard');
    return {};
  } catch {
    return { error: 'Failed to update week' };
  }
}
