import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes: Record<string, string[]> = {
  '/dashboard': ['customer'],
  '/provider': ['provider'],
  '/admin': ['admin', 'superadmin'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  for (const [prefix, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(prefix) && !token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/provider/:path*', '/admin/:path*'],
};
