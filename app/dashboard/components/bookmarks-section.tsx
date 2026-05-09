import Link from 'next/link';
import { BookMarked, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Bookmark {
  contentId: string;
  contentType: 'blog' | 'studyMaterial';
  createdAt: string;
  title: string;
  slug: string;
  excerpt: string;
}

interface Props {
  bookmarks: Bookmark[];
}

export function BookmarksSection({ bookmarks }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 font-serif text-2xl">
            <BookMarked className="h-5 w-5 text-primary" />
            Bookmarks
          </CardTitle>
          {bookmarks.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {bookmarks.length} saved
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
            <BookMarked className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">No bookmarks yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tap the bookmark icon while reading a blog or study material to save it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((b) => {
              const href =
                b.contentType === 'blog'
                  ? `/blog/${b.slug}`
                  : `/study-materials/${b.slug}`;
              return (
                <Link
                  key={b.contentId}
                  href={href}
                  className="group flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-soft"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="bg-primary/10 px-1.5 py-0 text-[10px] uppercase text-primary">
                      {b.contentType === 'blog' ? 'Blog' : 'Study Material'}
                    </Badge>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="text-sm font-medium leading-snug">{b.title}</p>
                  {b.excerpt && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{b.excerpt}</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
