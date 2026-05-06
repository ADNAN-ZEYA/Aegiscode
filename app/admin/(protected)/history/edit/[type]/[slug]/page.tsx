import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase/admin';
import { saveContentAction } from '@/features/admin/actions';
import { ContentForm } from '@/features/admin/components/content-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentInput } from '@/features/admin/schemas';

export const dynamic = 'force-dynamic';

async function getContent(type: string, slug: string) {
  if (!adminDb) return null;
  const collectionName = type === 'blog' ? 'blogs' : 'studyMaterials';
  const doc = await adminDb.collection(collectionName).doc(slug).get();
  if (!doc.exists) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { id: doc.id, ...doc.data() } as any;
}

export default async function AdminEditContentPage({ params }: { params: Promise<{ type: string, slug: string }> }) {
  const { type, slug } = await params;
  
  if (type !== 'blog' && type !== 'studyMaterial') {
    return notFound();
  }

  const content = await getContent(type, slug);

  if (!content) {
    return notFound();
  }

  const initialValues: Partial<ContentInput> = {
    contentType: type,
    title: content.title,
    slug: content.slug || slug,
    excerpt: content.excerpt,
    categorySlug: content.categorySlug,
    tags: Array.isArray(content.tags) ? content.tags.join(', ') : content.tags || '',
    markdown: content.markdown,
    status: content.status || 'draft',
    coverImage: content.coverImage || '',
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Editing Content</p>
        <h1 className="font-serif text-4xl">Edit: {content.title}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentForm onSubmit={saveContentAction} initialValues={initialValues} />
        </CardContent>
      </Card>
    </div>
  );
}
