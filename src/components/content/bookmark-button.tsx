'use client';

import { useState, useTransition } from 'react';
import { Bookmark } from 'lucide-react';
import { toggleBookmark } from '@/services/bookmark.service';
import { Button } from '@/components/ui/button';

export function BookmarkButton({ contentId, contentType }: { contentId: string; contentType: 'blog' | 'studyMaterial' }) {
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={saved ? 'secondary' : 'outline'}
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            const nextState = await toggleBookmark(contentId, contentType);
            setSaved(nextState);
          } catch (error) {
            console.error(error);
          }
        })
      }
    >
      <Bookmark className="h-4 w-4" />
      {saved ? 'Saved' : 'Bookmark'}
    </Button>
  );
}
