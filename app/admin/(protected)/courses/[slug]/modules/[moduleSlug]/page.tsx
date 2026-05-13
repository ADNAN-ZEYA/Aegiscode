import { getCourseBySlug, getCourseModule } from '@/services/course.service';
import { notFound } from 'next/navigation';
import { ModuleForm } from '@/features/admin/components/module-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AdminModuleEditPage({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}) {
  const { slug, moduleSlug } = await params;
  
  const [course, moduleData] = await Promise.all([
    getCourseBySlug(slug),
    getCourseModule(slug, moduleSlug)
  ]);

  if (!course || !moduleData) {
    notFound();
  }

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
        <h1 className="font-serif text-2xl sm:text-4xl">Edit Module</h1>
        <p className="text-muted-foreground">Course: {course.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ModuleForm 
            courseSlug={slug} 
            initialValues={moduleData} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
