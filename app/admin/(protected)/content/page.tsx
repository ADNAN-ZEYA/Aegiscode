import { saveContentAction } from '@/features/admin/actions';
import { ContentForm } from '@/features/admin/components/content-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContentPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Publishing</p>
        <h1 className="font-serif text-2xl sm:text-4xl">Create blogs and study materials</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New content entry</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentForm onSubmit={saveContentAction} />
        </CardContent>
      </Card>
    </div>
  );
}
