export const dynamic = 'force-dynamic';

import { buildMetadata } from '@/lib/seo';
import { ContentCard } from '@/components/content/content-card';
import { PaginationLink } from '@/components/content/pagination-link';
import { SearchFilters } from '@/components/content/search-filters';
import { listBlogs, listCategories } from '@/services/content.service';

export const metadata = buildMetadata({
  title: 'AegisCode Blog',
  description: 'Technical essays, engineering guides, and educational publishing designed for reading.',
  path: '/blog',
});

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; cursor?: string }>;
}) {
  const params = await searchParams;
  const [categories, data] = await Promise.all([
    listCategories(),
    listBlogs({ category: params.category, query: params.q, cursor: params.cursor }),
  ]);

  const nextHref = data.nextCursor
    ? `/blog?${new URLSearchParams({
        ...(params.category ? { category: params.category } : {}),
        ...(params.q ? { q: params.q } : {}),
        cursor: data.nextCursor,
      }).toString()}`
    : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Blog</p>
        <h1 className="font-serif text-4xl">Long-form technical publishing</h1>
        <p className="max-w-3xl text-muted-foreground">
          Read educational essays, architecture notes, and engineering explainers inside a reading-focused interface optimized for SEO and mobile devices.
        </p>
      </div>
      <form className="space-y-4">
        <SearchFilters categories={categories} basePath="/blog" activeCategory={params.category} query={params.q} />
      </form>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.items.map((item) => (
          <ContentCard key={item.slug} item={item} href={`/blog/${item.slug}`} />
        ))}
      </div>
      <PaginationLink href={nextHref} />
    </div>
  );
}
