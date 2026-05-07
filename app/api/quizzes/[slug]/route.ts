import { NextRequest, NextResponse } from 'next/server';
import { getQuizBySlug } from '@/services/quiz.service';
import { getServerUserProfile } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const quiz = await getQuizBySlug(slug);

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Security Check: 
    // Public users can only see published quizzes.
    // Admins can see everything (draft, archived, etc.)
    const isPublished = quiz.status === 'published';
    
    if (!isPublished) {
      const user = await getServerUserProfile();
      const isAdmin = user?.role === 'admin';

      if (!isAdmin) {
        return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
      }
    }

    // Return only public data
    return NextResponse.json({
      title: quiz.title,
      questions: quiz.questions,
    });
  } catch (error) {
    console.error('API Quiz Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
