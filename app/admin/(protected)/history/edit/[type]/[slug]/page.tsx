import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase/admin';
import { saveContentAction, saveQuizAction, saveCourseAction } from '@/features/admin/actions';
import { ContentForm } from '@/features/admin/components/content-form';
import { QuizForm } from '@/features/admin/components/quiz-form';
import { CourseForm } from '@/features/admin/components/course-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

async function getDocument(type: string, slug: string) {
  if (!adminDb) return null;
  
  if (type === 'quiz') {
    const doc = await adminDb.collection('quizzes').doc(slug).get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return doc.exists ? { id: doc.id, ...doc.data() } as any : null;
  }
  
  if (type === 'course') {
    const doc = await adminDb.collection('courses').doc(slug).get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return doc.exists ? { id: doc.id, ...doc.data() } as any : null;
  }

  // blog or studyMaterial
  const doc = await adminDb.collection('content').doc(slug).get();
  if (!doc.exists || doc.data()?.type !== type) return null;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { id: doc.id, ...doc.data() } as any;
}

export default async function AdminEditContentPage({ params }: { params: Promise<{ type: string, slug: string }> }) {
  const { type, slug } = await params;
  
  if (!['blog', 'studyMaterial', 'quiz', 'course'].includes(type)) {
    return notFound();
  }

  const docData = await getDocument(type, slug);

  if (!docData) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Editing Content</p>
        <h1 className="font-serif text-2xl sm:text-4xl">Edit: {docData.title}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
        </CardHeader>
        <CardContent>
          {type === 'quiz' && (
            <QuizForm 
              onSubmit={saveQuizAction} 
              initialValues={{
                title: docData.title,
                slug: docData.slug || slug,
                excerpt: docData.excerpt,
                categorySlug: docData.categorySlug,
                difficulty: docData.difficulty,
                durationMinutes: docData.durationMinutes,
                status: docData.status,
                questionsJson: JSON.stringify(docData.questions, null, 2),
              }} 
            />
          )}
          
          {type === 'course' && (
            <CourseForm 
              onSubmit={saveCourseAction} 
              initialValues={{
                title: docData.title,
                slug: docData.slug || slug,
                excerpt: docData.excerpt,
                categorySlug: docData.categorySlug,
                level: docData.level,
                estimatedHours: docData.estimatedHours,
                tags: Array.isArray(docData.tags) ? docData.tags.join(', ') : docData.tags || '',
                status: docData.status,
                courseFolder: docData.courseFolder,
                sourcePdfPath: docData.sourcePdfPath,
                modulesJson: JSON.stringify(docData.modules, null, 2),
                coverImage: docData.coverImage || '',
                isPremium: docData.isPremium,
                price: docData.price,
              }} 
            />
          )}

          {(type === 'blog' || type === 'studyMaterial') && (
            <ContentForm 
              onSubmit={saveContentAction} 
              initialValues={{
                contentType: type as 'blog' | 'studyMaterial',
                title: docData.title,
                slug: docData.slug || slug,
                excerpt: docData.excerpt,
                categorySlug: docData.categorySlug,
                tags: Array.isArray(docData.tags) ? docData.tags.join(', ') : docData.tags || '',
                markdown: docData.markdown,
                status: docData.status || 'draft',
                coverImage: docData.coverImage || '',
                relatedContentSlugs: docData.relations?.relatedSlugs?.join(', ') || '',
                prerequisiteSlugs: docData.relations?.prerequisiteSlugs?.join(', ') || '',
              }} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
