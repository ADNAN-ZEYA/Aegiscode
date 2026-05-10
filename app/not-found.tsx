import Link from 'next/link';
import { FileSearch, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Page Not Found | AegisCode',
  description: 'The page you are looking for could not be found.',
  path: '/404',
});

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <FileSearch className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
          <h1 className="font-serif text-4xl">Page not found</h1>
          <p className="text-muted-foreground">
            This content may have moved, been unpublished, or never existed. Check the URL or
            start from the home page.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/study-materials">Browse study materials</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
