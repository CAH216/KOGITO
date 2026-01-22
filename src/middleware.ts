import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that we want to explicitly log or protect
const SENSITIVE_PATHS = ['/admin', '/auth', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Simple logging for sensitive routes access
  // We can't use prisma here normally (Edge Runtime limitations usually apply to middleware in Vercel)
  // But for local node server it works. 
  // IMPORTANT: Database calls in middleware are generally bad practice due to latency.
  // Instead, we just log to console which our logger picks up (or we could use an API route).
  // For this implementation, we will skip DB logging in middleware to avoid slowing down every request,
  // but we can log unique admin accesses.
  
  if (pathname.startsWith('/admin')) {
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      console.log(`[SECURITY] Admin Access: ${pathname} from IP ${ip}`);
  }

  // Auth checking is handled by NextAuth middleware usually, or per-page.
  // We just pass through.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
