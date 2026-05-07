import { getCourseBySlug } from '@/services/course.service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, ArrowLeft } from 'lucide-react';

export default async function AdminCourseModulesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  // Use the summaries stored in the course document
  const modules = [...(course.modules || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link 
            href="/admin/courses" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </Link>
          <h1 className="font-serif text-4xl">Modules: {course.title}</h1>
          <p className="text-muted-foreground">Manage individual lessons and content structure</p>
        </div>
        <Link href={`/admin/courses/${slug}/modules/new`}>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Add New Module
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {modules.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex h-40 flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">No modules found for this course.</p>
              <Link href={`/admin/courses/${slug}/modules/new`} className="mt-4">
                <Button variant="outline" size="sm">Create your first module</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          modules.map((module) => (
            <Card key={module.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    {module.order}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{module.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{module.summary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    {module.estimatedMinutes} min
                  </span>
                  <Link href={`/admin/courses/${slug}/modules/${module.slug}`}>
                    <Button variant="ghost" size="sm" className="group-hover:text-primary h-9 w-9 p-0">
                      <Edit2 size={18} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
