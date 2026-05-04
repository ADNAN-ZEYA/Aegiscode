import Link from 'next/link';
import { ArrowUpRight, FileText, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Course } from '@/types/course';

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group relative h-full overflow-hidden border-border/50 bg-background/50 backdrop-blur-md transition-all hover:scale-[1.02] hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between gap-4">
          <Badge>{course.level}</Badge>
          <span className="text-xs text-muted-foreground">{course.estimatedHours} hrs</span>
        </div>
        <CardTitle className="text-xl">
          <Link href={`/courses/${course.slug}`} className="transition hover:text-primary">
            {course.title}
          </Link>
        </CardTitle>
        <CardDescription>{course.excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />{course.modules.length} modules</span>
          <span className="flex items-center gap-2"><FileText className="h-4 w-4" />Text-first delivery</span>
        </div>
        <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
          Explore course
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
