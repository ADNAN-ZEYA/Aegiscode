import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/content/bookmark-button';
import { ReadingProgress } from '@/components/content/reading-progress';
import { RichContentRenderer } from '@/components/content/rich-content-renderer';
import { ViewTracker } from '@/components/content/view-tracker';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { getBlogBySlug } from '@/services/content.service';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: 'Post not found',
      description: 'The requested article does not exist.',
    });
  }

  return buildMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <ViewTracker slug={post.slug} type="blog" />
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{post.categorySlug.replace(/-/g, ' ')}</p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{post.author.name}</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>{post.readingTime} min read</span>
            <span>{post.viewCount.toLocaleString()} views</span>
          </div>
          <BookmarkButton contentId={post.slug} contentType="blog" />
        </header>
        <RichContentRenderer markdown={post.markdown} blocks={post.blocks} />
      </article>
    </>
  );
}
