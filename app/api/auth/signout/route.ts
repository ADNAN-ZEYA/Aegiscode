import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  response.cookies.set('session', '', { maxAge: 0, path: '/' });
  response.cookies.set('dev-session', '', { maxAge: 0, path: '/' });
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  response.cookies.set('session', '', { maxAge: 0, path: '/' });
  response.cookies.set('dev-session', '', { maxAge: 0, path: '/' });
  return response;
}
