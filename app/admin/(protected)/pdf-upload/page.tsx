import { saveContentAction } from '@/features/admin/actions';
import { PDFToContentForm } from '@/features/admin/components/pdf-to-content-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPdfUploadPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Content Conversion</p>
        <h1 className="font-serif text-4xl">Upload PDF Study Material</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Extract & Publish</CardTitle>
        </CardHeader>
        <CardContent>
          <PDFToContentForm onSubmit={saveContentAction} />
        </CardContent>
      </Card>
    </div>
  );
}
