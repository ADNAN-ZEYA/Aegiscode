import Link from 'next/link';
import { adminDb } from '@/lib/firebase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, FileText, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

async function getHistory() {
  if (!adminDb) return [];
  
  const [contentSnap, coursesSnap, quizzesSnap] = await Promise.all([
    adminDb.collection('content').orderBy('createdAt', 'desc').limit(20).get(),
    adminDb.collection('courses').orderBy('createdAt', 'desc').limit(20).get(),
    adminDb.collection('quizzes').orderBy('createdAt', 'desc').limit(20).get(),
  ]);

  const items = [
    ...contentSnap.docs.map(d => ({ id: d.id, contentType: d.data().type || 'blog', ...d.data() })),
    ...coursesSnap.docs.map(d => ({ id: d.id, contentType: 'course', ...d.data() })),
    ...quizzesSnap.docs.map(d => ({ id: d.id, contentType: 'quiz', ...d.data() })),
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return items;
}

export default async function AdminHistoryPage() {
  const history = await getHistory();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Management</p>
        <h1 className="font-serif text-4xl">Content History</h1>
        <p className="mt-2 text-muted-foreground">View and edit your previously created content.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No content found. Start by creating a new post!
            </div>
          ) : (
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {history.map((item: any) => (
                <div key={`${item.contentType}-${item.id}`} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {item.contentType === 'blog' ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">{item.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge 
                          className={`px-1.5 py-0 text-[10px] uppercase ${item.status === 'published' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                        >
                          {item.status}
                        </Badge>
                        <span className="capitalize">{item.contentType.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span>•</span>
                        <span>{item.categorySlug}</span>
                        <span>•</span>
                        <span>
                          {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/history/edit/${item.contentType}/${item.id}`}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-primary hover:text-primary-foreground">
                      <Edit className="h-4 w-4" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
