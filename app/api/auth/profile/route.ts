import { NextResponse } from 'next/server';
import { upsertUserProfile } from '@/lib/user-profile';

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await upsertUserProfile(payload);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
