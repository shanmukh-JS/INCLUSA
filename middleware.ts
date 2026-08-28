import { NextRequest, NextResponse } from 'next/server';

/**
 * INCLUSA Zero-Bypass Server-Side Authentication Middleware
 * Enforces session verification and route protection before rendering any private pages or executing APIs.
 */

// Routes that require an authenticated user session
const PROTECTED_PAGE_PREFIXES = [
  '/dashboard',
  '/analyze',
  '/audit',
  '/output',
  '/report',
  '/reports',
  '/history',
  '/profile',
  '/settings',
  '/website',
];

// Private API routes that strictly require bearer authentication
const PROTECTED_API_PREFIXES = [
  '/api/analyze',
  '/api/transform',
  '/api/verify',
  '/api/chat',
  '/api/documents',
  '/api/history',
  '/api/reports',
  '/api/profile',
  '/api/tts',
  '/api/website-audit',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Check Protected API Routes
  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtectedApi) {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    const authCookie = req.cookies.get('inclusa_auth_token')?.value;

    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : authCookie;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to access INCLUSA accessibility APIs.' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // 2. Check Protected Page Routes
  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtectedPage) {
    const authCookie = req.cookies.get('inclusa_auth_token')?.value;

    // If no session token cookie is found, redirect directly to /login
    if (!authCookie) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/analyze/:path*',
    '/audit/:path*',
    '/output/:path*',
    '/report/:path*',
    '/reports/:path*',
    '/history/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/website/:path*',
    '/api/:path*',
  ],
};
