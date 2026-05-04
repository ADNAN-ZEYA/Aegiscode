import Link from 'next/link';
import { Input } from '@/components/ui/input';
import type { Category } from '@/types/common';

export function SearchFilters({
  categories,
  basePath,
  activeCategory,
  query,
}: {
  categories: Category[];
  basePath: string;
  activeCategory?: string;
  query?: string;
}) {
  return (
    <div className="space-y-4">
      <Input name="q" defaultValue={query} placeholder="Search titles, tags, and excerpts" />
      <div className="flex flex-wrap gap-2">
        <Link
          href={basePath}
          className={`rounded-full px-4 py-2 text-sm ${!activeCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`${basePath}?${new URLSearchParams({
              category: category.slug,
              ...(query ? { q: query } : {}),
            }).toString()}`}
            className={`rounded-full px-4 py-2 text-sm ${
              activeCategory === category.slug ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
