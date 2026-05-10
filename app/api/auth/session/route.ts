import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';
import { resolveRole } from '@/lib/user-profile';

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');
  const idToken = authorization?.split('Bearer ')[1];
  const payload = await request.json().catch(() => ({}));

  if (adminAuth && idToken) {
    try {
      // Verify the ID token is valid before minting a session cookie
      await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 days
    let sessionCookie: string;
    try {
      sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    } catch {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

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
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  // Revoke all Firebase refresh tokens for this session so it cannot be reused
  if (sessionCookie && adminAuth) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decoded.sub);
    } catch {
      // Cookie already expired or invalid — that's fine, we'll clear it anyway
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('session', '', { maxAge: 0, path: '/', httpOnly: true });
  response.cookies.set('dev-session', '', { maxAge: 0, path: '/', httpOnly: true });
  return response;
}
