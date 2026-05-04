'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-serif text-4xl">Something went wrong</h1>
      <p className="text-muted-foreground">The platform hit an unexpected state. You can retry safely.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
