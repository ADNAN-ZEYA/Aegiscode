'use client';

import { useEffect } from 'react';

export function ViewTracker({ slug, type }: { slug: string; type: 'blog' | 'studyMaterial' | 'quiz' }) {
  useEffect(() => {
    void fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, type }),
    });
  }, [slug, type]);

  return null;
}
