import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { resolveRole } from '@/lib/user-profile';

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');
  const idToken = authorization?.split('Bearer ')[1];
  const payload = await request.json().catch(() => ({}));

  if (adminAuth && idToken) {
    const expiresIn = 1000 * 60 * 60 * 24 * 5;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ ok: true });
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
    });

    return response;
  }

  if (process.env.NODE_ENV !== 'production' && payload?.uid) {
    const role = resolveRole(payload.email);
    const response = NextResponse.json({ ok: true, role });
    response.cookies.set(
      'dev-session',
      JSON.stringify({
        uid: payload.uid,
        email: payload.email || '',
        name: payload.name || payload.email || 'User',
        image: payload.image || null,
        role,
      }),
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24 * 5,
        path: '/',
      },
    );
    return response;
  }

  return NextResponse.json({ ok: false }, { status: 400 });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('session', '', { maxAge: 0, path: '/' });
  response.cookies.set('dev-session', '', { maxAge: 0, path: '/' });
  return response;
}
