import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="font-serif text-5xl">This page is not available</h1>
      <p className="text-muted-foreground">The content may have moved, been unpublished, or never existed.</p>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
