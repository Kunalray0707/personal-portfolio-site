import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from './lib/prismadb';

// Middleware protects /dashboard and /api/protected/*
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/protected')) {
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

    // attach user id header for downstream server handlers (optional)
    req.headers.set('x-user-id', session.userId);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*', '/api/portfolio/:path*']
};
