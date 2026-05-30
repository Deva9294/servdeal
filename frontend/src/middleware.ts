import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const roleRoutes: Record<string, string[]> = {
  customer: ['/dashboard'],
  provider: ['/provider'],
  worker: ['/worker'],
  employer: ['/employer'],
  admin: ['/admin'],
  superadmin: ['/admin'],
};

function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));
    return decoded?.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const protectedPaths = ['/dashboard', '/provider', '/admin', '/worker', '/employer'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isProtected && token) {
    const role = getRoleFromToken(token);
    if (!role) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    const allowedPrefixes = roleRoutes[role] || [];
    const canAccess = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
    if (!canAccess) {
      const fallback = allowedPrefixes[0] || '/dashboard';
      return NextResponse.redirect(new URL(fallback, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/provider/:path*', '/admin/:path*', '/worker/:path*', '/employer/:path*'],
};
