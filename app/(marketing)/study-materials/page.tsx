import { buildMetadata } from '@/lib/seo';
import { ContentCard } from '@/components/content/content-card';
import { PaginationLink } from '@/components/content/pagination-link';
import { SearchFilters } from '@/components/content/search-filters';
import { listCategories, listStudyMaterials } from '@/services/content.service';

export const metadata = buildMetadata({
  title: 'Study Materials',
  description: 'Structured online study modules with rich sections, code blocks, tables, and inline assessments.',
  path: '/study-materials',
});

export default async function StudyMaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; cursor?: string }>;
}) {
  const params = await searchParams;
  const [categories, materials] = await Promise.all([
    listCategories(),
    listStudyMaterials({ category: params.category, query: params.q, cursor: params.cursor }),
  ]);

  const nextHref = materials.nextCursor
    ? `/study-materials?${new URLSearchParams({
        ...(params.category ? { category: params.category } : {}),
        ...(params.q ? { q: params.q } : {}),
        cursor: materials.nextCursor,
      }).toString()}`
    : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Study materials</p>
        <h1 className="font-serif text-4xl">Online modules built for completion, not downloads</h1>
      </div>
      <form className="space-y-4">
        <SearchFilters categories={categories} basePath="/study-materials" activeCategory={params.category} query={params.q} />
      </form>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {materials.items.map((item) => (
          <ContentCard key={item.slug} item={item} href={`/study-materials/${item.slug}`} />
        ))}
      </div>
      <PaginationLink href={nextHref} />
    </div>
  );
}
