import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware protects /dashboard, /admin, and /api/protected/*
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && !pathname.startsWith('/admin/login');
  const isProtectedRoute = pathname.startsWith('/api/protected') || pathname.startsWith('/api/portfolio');

  if (isDashboardRoute || isAdminRoute || isProtectedRoute) {
    const cookie = req.cookies.get('session')?.value;
    
    const loginUrl = isAdminRoute ? '/admin/login' : '/auth';

    if (!cookie) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL(loginUrl, req.url));
    }

    // Validate session via proxy API to avoid Edge runtime Prisma crash
    const res = await fetch(`${req.nextUrl.origin}/api/auth/verify-session`, {
      headers: { cookie: `session=${cookie}` }
    });

    if (!res.ok) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const redirectRes = NextResponse.redirect(new URL(loginUrl, req.url));
      redirectRes.headers.set('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure');
      return redirectRes;
    }

    const { userId, role } = await res.json();

    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', userId);
    
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
