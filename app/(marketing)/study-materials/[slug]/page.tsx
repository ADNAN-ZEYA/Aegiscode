import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/content/bookmark-button';
import { ReadingProgress } from '@/components/content/reading-progress';
import { RichContentRenderer } from '@/components/content/rich-content-renderer';
import { ViewTracker } from '@/components/content/view-tracker';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { getStudyMaterialBySlug } from '@/services/content.service';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = await getStudyMaterialBySlug(slug);

  if (!material) {
    return buildMetadata({ title: 'Material not found', description: 'This study material is unavailable.' });
  }

  return buildMetadata({
    title: material.seo.title,
    description: material.seo.description,
    path: `/study-materials/${material.slug}`,
    image: material.coverImage,
  });
}

export default async function StudyMaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = await getStudyMaterialBySlug(slug);

  if (!material) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <ViewTracker slug={material.slug} type="studyMaterial" />
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{material.categorySlug.replace(/-/g, ' ')}</p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{material.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{material.author.name}</span>
            <span>{formatDate(material.publishedAt)}</span>
            <span>{material.readingTime} min read</span>
            <span>{material.estimatedCompletionMinutes} min completion</span>
          </div>
          <BookmarkButton contentId={material.slug} contentType="studyMaterial" />
        </header>
        <RichContentRenderer markdown={material.markdown} blocks={material.blocks} />
      </article>
    </>
  );
}
