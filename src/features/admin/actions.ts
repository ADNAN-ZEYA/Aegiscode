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

  const now = new Date().toISOString();

  await adminDb.collection('content').doc(parsed.slug).set(
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
      relations: {
        relatedSlugs: parsed.relatedContentSlugs ? parsed.relatedContentSlugs.split(',').map(s => s.trim()).filter(Boolean) : [],
        prerequisiteSlugs: parsed.prerequisiteSlugs ? parsed.prerequisiteSlugs.split(',').map(s => s.trim()).filter(Boolean) : [],
      },
      type: parsed.contentType,
      ...(parsed.contentType === 'studyMaterial'
        ? {
            difficulty: 'intermediate',
            estimatedCompletionMinutes: Math.max(5, Math.ceil(parsed.markdown.split(/\s+/).length / 180)),
          }
        : {}),
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

  // Use a batch to save the course and all modules atomically
  const batch = adminDb.batch();
  const courseRef = adminDb.collection('courses').doc(parsed.slug);

  // 1. Prepare the module summaries (metadata only, no heavy markdown)
  const moduleSummaries = modules.map((m: any) => ({
    id: m.id,
    title: m.title,
    slug: m.slug,
    summary: m.summary,
    order: m.order,
    estimatedMinutes: m.estimatedMinutes,
  }));

  // 2. Set the main course document
  batch.set(courseRef, {
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
    modules: moduleSummaries, // Only summaries here!
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
  }, { merge: true });

  // 3. Save each module to the sub-collection
  modules.forEach((m: any) => {
    const moduleRef = courseRef.collection('modules').doc(m.slug);
    batch.set(moduleRef, {
      ...m,
      courseId: parsed.slug,
      updatedAt: now,
      createdAt: now,
    }, { merge: true });
  });

  await batch.commit();

  revalidatePath('/courses');
  revalidatePath(`/courses/${parsed.slug}`);
  revalidatePath('/admin/courses');

  return { ok: true, message: 'Course saved successfully.' };
}
