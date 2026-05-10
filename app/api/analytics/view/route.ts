import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

const ALLOWED_TYPES = ['blog', 'studyMaterial', 'quiz', 'course'] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];

const COLLECTION_MAP: Record<AllowedType, string> = {
  blog: 'content',
  studyMaterial: 'content',
  quiz: 'quizzes',
  course: 'courses',
};

// Slugs must be URL-safe strings (alphanumeric + hyphens, max 120 chars)
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,118}[a-z0-9]$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { slug, type } = body as { slug?: unknown; type?: unknown };

  if (
    typeof slug !== 'string' ||
    typeof type !== 'string' ||
    !SLUG_RE.test(slug) ||
    !ALLOWED_TYPES.includes(type as AllowedType)
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!adminDb) {
    return NextResponse.json({ ok: true });
  }

  const collection = COLLECTION_MAP[type as AllowedType];

  // Increment only if document already exists — prevents creating phantom docs
  const ref = adminDb.collection(collection).doc(slug);
  const doc = await ref.get();
  if (!doc.exists) {
    return NextResponse.json({ ok: true });
  }

  await ref.update({ viewCount: FieldValue.increment(1) });

  return NextResponse.json({ ok: true });
}
