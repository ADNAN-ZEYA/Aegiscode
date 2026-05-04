import { saveCourseAction } from '@/features/admin/actions';
import { CourseForm } from '@/features/admin/components/course-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRazorpayConfig } from '@/lib/payments/razorpay';

export default function AdminCoursesPage() {
  const razorpay = getRazorpayConfig();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Courses</p>
        <h1 className="font-serif text-4xl">Create structured course folders and modules</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course publishing</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm onSubmit={saveCourseAction} />
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
  );
}
