import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { BlogPost, StudyMaterial } from '@/types/content';

export function ContentCard({ item, href }: { item: BlogPost | StudyMaterial; href: string }) {
  return (
    <Card className="group relative h-full overflow-hidden border-border/50 bg-background/50 backdrop-blur-md transition-all hover:scale-[1.02] hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between gap-4">
          <Badge>{item.categorySlug.replace(/-/g, ' ')}</Badge>
          <span className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</span>
        </div>
        <CardTitle className="text-xl">
          <Link href={href} className="transition hover:text-primary">
            {item.title}
          </Link>
        </CardTitle>
        <CardDescription>{item.excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="relative flex items-center justify-between text-sm text-muted-foreground">
        <span>{item.readingTime} min read</span>
        <Link href={href} className="inline-flex items-center gap-1 font-medium text-foreground">
          Read now
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
