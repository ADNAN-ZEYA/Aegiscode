import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PaginationLink({ href }: { href?: string }) {
  if (!href) {
    return null;
  }

  return (
    <Button variant="outline" asChild>
      <Link href={href}>Load more</Link>
    </Button>
  );
}
