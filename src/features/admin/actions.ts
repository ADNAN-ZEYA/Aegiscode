'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { contentSchema, quizSchema, type ContentInput, type QuizInput } from '@/features/admin/schemas';
import { courseSchema, type CourseInput } from '@/features/admin/course-schemas';

export async function saveContentAction(input: ContentInput) {
  const admin = await requireAdmin();
  const parsed = contentSchema.parse(input);

  if (!adminDb) {
    return { ok: false, message: 'Firebase Admin is not configured yet.' };
  }

  const collectionName = parsed.contentType === 'blog' ? 'blogs' : 'studyMaterials';
  const now = new Date().toISOString();

  await adminDb.collection(collectionName).doc(parsed.slug).set(
    {
      title: parsed.title,
      excerpt: parsed.excerpt,
      categorySlug: parsed.categorySlug,
      tags: parsed.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      markdown: parsed.markdown,
      coverImage: parsed.coverImage || null,
      status: parsed.status,
      slug: parsed.slug,
      createdBy: admin.uid,
      updatedAt: now,
      createdAt: now,
      publishedAt: parsed.status === 'published' ? now : null,
      readingTime: Math.max(3, Math.ceil(parsed.markdown.split(/\s+/).length / 220)),
      viewCount: 0,
      blocks: [],
      author: {
        id: admin.uid,
        name: admin.name,
        username: admin.username,
      },
      seo: {
        title: parsed.title,
        description: parsed.excerpt,
      },
      ...(parsed.contentType === 'studyMaterial'
        ? {
            type: 'studyMaterial',
            difficulty: 'intermediate',
            estimatedCompletionMinutes: Math.max(5, Math.ceil(parsed.markdown.split(/\s+/).length / 180)),
          }
        : { type: 'blog' }),
    },
    { merge: true },
  );

  revalidatePath('/blog');
  revalidatePath('/study-materials');
  revalidatePath('/admin/content');

  return { ok: true, message: 'Content saved successfully.' };
}

export async function saveQuizAction(input: QuizInput) {
  const admin = await requireAdmin();
  const parsed = quizSchema.parse(input);

  if (!adminDb) {
    return { ok: false, message: 'Firebase Admin is not configured yet.' };
  }

  const now = new Date().toISOString();
  const questions = JSON.parse(parsed.questionsJson);

  await adminDb.collection('quizzes').doc(parsed.slug).set(
    {
      title: parsed.title,
      excerpt: parsed.excerpt,
      categorySlug: parsed.categorySlug,
      difficulty: parsed.difficulty,
      durationMinutes: parsed.durationMinutes,
      questions,
      questionCount: Array.isArray(questions) ? questions.length : 0,
      status: parsed.status,
      slug: parsed.slug,
      createdBy: admin.uid,
      createdAt: now,
      updatedAt: now,
      publishedAt: parsed.status === 'published' ? now : null,
      viewCount: 0,
      tags: ['quiz'],
      seo: {
        title: parsed.title,
        description: parsed.excerpt,
      },
      author: {
        id: admin.uid,
        name: admin.name,
        username: admin.username,
      },
    },
    { merge: true },
  );

  revalidatePath('/quizzes');
  revalidatePath('/admin/quizzes');

  return { ok: true, message: 'Quiz saved successfully.' };
}

export async function saveCourseAction(input: CourseInput) {
  const admin = await requireAdmin();
  const parsed = courseSchema.parse(input);

  if (!adminDb) {
    return { ok: false, message: 'Firebase Admin is not configured yet.' };
  }

  const now = new Date().toISOString();
  const modules = JSON.parse(parsed.modulesJson);

  await adminDb.collection('courses').doc(parsed.slug).set(
    {
      title: parsed.title,
      excerpt: parsed.excerpt,
      categorySlug: parsed.categorySlug,
      level: parsed.level,
      estimatedHours: parsed.estimatedHours,
      tags: parsed.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      status: parsed.status,
      slug: parsed.slug,
      createdBy: admin.uid,
      createdAt: now,
      updatedAt: now,
      publishedAt: parsed.status === 'published' ? now : null,
      viewCount: 0,
      enrolledCount: 0,
      coverImage: parsed.coverImage || null,
      courseFolder: parsed.courseFolder,
      sourcePdfPath: parsed.sourcePdfPath,
      modules,
      isPremium: parsed.isPremium,
      price: parsed.isPremium ? parsed.price ?? 0 : null,
      author: {
        id: admin.uid,
        name: admin.name,
        username: admin.username,
      },
      seo: {
        title: parsed.title,
        description: parsed.excerpt,
      },
    },
    { merge: true },
  );

  revalidatePath('/courses');
  revalidatePath(`/courses/${parsed.slug}`);
  revalidatePath('/admin/courses');

  return { ok: true, message: 'Course saved successfully.' };
}
