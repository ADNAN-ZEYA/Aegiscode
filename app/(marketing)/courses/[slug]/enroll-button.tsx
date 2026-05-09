'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { enrollInCourse } from './enroll-actions';

interface Props {
  courseId: string;
  courseTitle: string;
  isLoggedIn: boolean;
  initiallyEnrolled: boolean;
  firstModuleSlug?: string;
}

export function EnrollButton({
  courseId,
  courseTitle,
  isLoggedIn,
  initiallyEnrolled,
  firstModuleSlug,
}: Props) {
  const [enrolled, setEnrolled] = useState(initiallyEnrolled);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (enrolled) {
    return (
      <Button
        size="lg"
        onClick={() =>
          router.push(
            firstModuleSlug
              ? `/courses/${courseId}/modules/${firstModuleSlug}`
              : `/courses/${courseId}`,
          )
        }
        className="gap-2"
      >
        <CheckCircle2 className="h-4 w-4" />
        Continue Learning
      </Button>
    );
  }

  function handleEnroll() {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }
    setError('');
    startTransition(async () => {
      const result = await enrollInCourse(courseId, courseTitle);
      if (result.error) {
        setError(result.error);
      } else {
        setEnrolled(true);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button size="lg" onClick={handleEnroll} disabled={isPending} className="gap-2">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enrolling…
          </>
        ) : (
          <>
            Enroll Free
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
