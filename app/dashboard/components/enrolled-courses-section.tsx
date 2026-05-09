import Link from 'next/link';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EnrolledCourse {
  slug: string;
  title: string;
  level?: string;
  progress?: number;
  lastAccessedAt?: string;
}

interface Props {
  courses: EnrolledCourse[];
}

function levelBadgeClass(level?: string): string {
  if (level === 'beginner') return 'bg-green-500/15 text-green-700';
  if (level === 'intermediate') return 'bg-yellow-500/15 text-yellow-700';
  if (level === 'advanced') return 'bg-red-500/15 text-red-700';
  return 'bg-muted text-muted-foreground';
}

export function EnrolledCoursesSection({ courses }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 font-serif text-2xl">
            <GraduationCap className="h-5 w-5 text-primary" />
            Enrolled Courses
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/courses">Browse all</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
            <GraduationCap className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">No courses started yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Explore text-based learning tracks built for engineering students.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/courses">
                Browse Courses
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-2">
                  {course.level && (
                    <Badge className={`px-1.5 py-0 text-[10px] uppercase ${levelBadgeClass(course.level)}`}>
                      {course.level}
                    </Badge>
                  )}
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
                <p className="text-sm font-medium leading-snug">{course.title}</p>
                {course.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
