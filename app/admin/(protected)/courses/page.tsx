import { saveCourseAction } from '@/features/admin/actions';
import { CourseForm } from '@/features/admin/components/course-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRazorpayConfig } from '@/lib/payments/razorpay';
import { listCourses } from '@/services/course.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default async function AdminCoursesPage() {
  const razorpay = getRazorpayConfig();
  const { items: courses } = await listCourses({ limit: 100 }); // Admin list shows all

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Courses</p>
        <h1 className="font-serif text-2xl sm:text-4xl">Course Management</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create / Edit Main Course</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm onSubmit={saveCourseAction} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Existing Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.slug} className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-xs text-muted-foreground">{course.modules?.length || 0} modules · {course.status}</p>
                    </div>
                    <Link href={`/admin/courses/${course.slug}/modules`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <BookOpen size={14} />
                        Manage Modules
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payments readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Razorpay is scaffolded for future premium courses.</p>
              <p>Key configured: {razorpay.keyId ? 'Yes' : 'No'}</p>
              <p>Secret configured: {razorpay.hasSecret ? 'Yes' : 'No'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
