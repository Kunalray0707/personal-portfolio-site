import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from './lib/prismadb';

// Middleware protects /dashboard, /admin, and /api/protected/*
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isProtectedRoute = pathname.startsWith('/api/protected') || pathname.startsWith('/api/portfolio');

  if (isDashboardRoute || isAdminRoute || isProtectedRoute) {
    const cookie = req.cookies.get('session')?.value;
    if (!cookie) return NextResponse.redirect(new URL('/auth/login', req.url));

    // validate session
    const session = await prisma.session.findUnique({ where: { sessionToken: cookie }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) {
      // clear cookie and redirect
      const res = NextResponse.redirect(new URL('/auth/login', req.url));
      res.headers.set('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure');
      return res;
    }

    if (isAdminRoute && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // attach user id header for downstream server handlers (optional)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', session.userId);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/admin/:path*', '/api/protected/:path*', '/api/portfolio/:path*']
};
