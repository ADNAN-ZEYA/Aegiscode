import { getCourseBySlug } from '@/services/course.service';
import { notFound } from 'next/navigation';
import { ModuleForm } from '@/features/admin/components/module-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AdminNewModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  // Auto-calculate the next order number
  const nextOrder = (course.modules?.length || 0) + 1;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Link 
          href={`/admin/courses/${slug}/modules`} 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Modules
        </Link>
        <h1 className="font-serif text-4xl">Add New Module</h1>
        <p className="text-muted-foreground">Course: {course.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ModuleForm 
            courseSlug={slug} 
            initialValues={{ order: nextOrder }} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
