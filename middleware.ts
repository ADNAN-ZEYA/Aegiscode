import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// In-process rate limiter (Edge-compatible, resets on cold start)
// For production scale replace with Upstash Redis + @upstash/ratelimit
// ---------------------------------------------------------------------------
interface RateBucket {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateBucket>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

/**
 * Returns true when the request should be BLOCKED (limit exceeded).
 * windowMs = sliding window in ms, max = max requests per window.
 */
function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > max) return true;

  return false;
}

// Prune stale entries every ~500 requests to avoid memory growth
let pruneCounter = 0;
function maybePrune() {
  if (++pruneCounter % 500 !== 0) return;
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore) {
    if (now > bucket.resetAt) rateLimitStore.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Route config
// ---------------------------------------------------------------------------
const RATE_LIMITS: { pattern: RegExp; max: number; windowMs: number }[] = [
  // Auth endpoints — strict: 10 attempts per 15 min per IP
  { pattern: /^\/api\/auth\/session$/, max: 10, windowMs: 15 * 60 * 1000 },
  { pattern: /^\/api\/auth\/profile$/, max: 10, windowMs: 15 * 60 * 1000 },
  // AI chat — 30 requests per minute per IP (daily user limit is enforced in the handler)
  { pattern: /^\/api\/chat$/, max: 30, windowMs: 60 * 1000 },
  // General API — 120 requests per minute per IP
  { pattern: /^\/api\//, max: 120, windowMs: 60 * 1000 },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  maybePrune();

  // ── Admin route protection ────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('session')?.value;
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── IP-based rate limiting ────────────────────────────────────────────────
  const ip = getClientIp(request);

  for (const rule of RATE_LIMITS) {
    if (rule.pattern.test(pathname)) {
      const key = `${ip}:${pathname}`;
      if (isRateLimited(key, rule.max, rule.windowMs)) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests. Please slow down.' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil(rule.windowMs / 1000)),
            },
          },
        );
      }
      break; // first matching rule wins
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/:path*',
    '/api/chat',
    '/api/analytics/:path*',
    '/api/admin/:path*',
  ],
};
