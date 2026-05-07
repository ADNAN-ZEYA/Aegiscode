import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/content/bookmark-button';
import { ReadingProgress } from '@/components/content/reading-progress';
import { RichContentRenderer } from '@/components/content/rich-content-renderer';
import { ViewTracker } from '@/components/content/view-tracker';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { getStudyMaterialBySlug, getBasicContentBySlugs } from '@/services/content.service';
import { getServerUserProfile } from '@/lib/auth';

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

  // Security Check: Only admins can see non-published content
  if (material.status !== 'published') {
    const user = await getServerUserProfile();
    if (user?.role !== 'admin') {
      notFound();
    }
  }

  const [prerequisites, related] = await Promise.all([
    material.relations?.prerequisiteSlugs?.length 
      ? getBasicContentBySlugs(material.relations.prerequisiteSlugs) 
      : Promise.resolve([]),
    material.relations?.relatedSlugs?.length 
      ? getBasicContentBySlugs(material.relations.relatedSlugs) 
      : Promise.resolve([])
  ]);

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

        {prerequisites.length > 0 && (
          <div className="mb-12 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Prerequisites
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">Before reading this, make sure you understand:</p>
            <ul className="flex flex-col gap-2">
              {prerequisites.map((pre) => (
                <li key={pre.slug}>
                  <a href={`/${pre.type === 'studyMaterial' ? 'study-materials' : 'blog'}/${pre.slug}`} className="group flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500/50 group-hover:bg-primary" />
                    {pre.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <RichContentRenderer markdown={material.markdown} blocks={material.blocks} />

        {related.length > 0 && (
          <div className="mt-16 rounded-3xl border border-border bg-muted/30 p-8">
            <h3 className="mb-6 text-xl font-semibold">Keep learning</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((rel) => (
                <a 
                  key={rel.slug} 
                  href={`/${rel.type === 'studyMaterial' ? 'study-materials' : 'blog'}/${rel.slug}`}
                  className="flex flex-col justify-between rounded-xl border border-border bg-background p-5 transition hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {rel.type === 'studyMaterial' ? 'Study Material' : 'Blog'}
                    </span>
                    <h4 className="font-medium text-foreground line-clamp-2">{rel.title}</h4>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
