import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  const body = await request.json();
  const { slug, type } = body as { slug?: string; type?: string };

  if (!slug || !type || !adminDb) {
    return NextResponse.json({ ok: true });
  }

  const collectionMap = {
    blog: 'content',
    studyMaterial: 'content',
    quiz: 'quizzes',
  } as const;

  const collectionName = collectionMap[type as keyof typeof collectionMap];
  if (!collectionName) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await adminDb.collection(collectionName).doc(slug).set(
    {
      viewCount: FieldValue.increment(1),
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  return NextResponse.json({ ok: true });
}
