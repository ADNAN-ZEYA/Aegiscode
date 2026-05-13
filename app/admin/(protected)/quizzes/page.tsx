import { saveQuizAction } from '@/features/admin/actions';
import { QuizForm } from '@/features/admin/components/quiz-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminQuizzesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Assessments</p>
        <h1 className="font-serif text-2xl sm:text-4xl">Create and manage mock tests</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <QuizForm onSubmit={saveQuizAction} />
        </CardContent>
      </Card>
    </div>
  );
}
