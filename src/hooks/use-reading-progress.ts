'use client';

import { useEffect, useState } from 'react';
import { readingProgressFromScroll } from '@/lib/utils';

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setProgress(readingProgressFromScroll(window.scrollY, document.body.scrollHeight, window.innerHeight));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
