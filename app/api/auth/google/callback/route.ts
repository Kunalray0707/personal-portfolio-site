import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prismadb';
import { exchangeCodeForToken, fetchGoogleUser, isGoogleConfigured } from '../../../../../lib/google';
import { createSessionAndCookie } from '../../../../../lib/session';

export const dynamic = 'force-dynamic';

// GET /api/auth/google/callback — handle Google's redirect after consent
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (!isGoogleConfigured) {
    return NextResponse.json(
      { error: 'Google OAuth is not configured.' },
      { status: 503 }
    );
  }

  if (error) {
    return NextResponse.redirect(new URL('/auth/login?error=google_denied', req.url));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL('/auth/login?error=invalid_state', req.url));
  }

  // Validate CSRF state cookie.
  const cookieHeader = req.headers.get('cookie') || '';
  const stateMatch = cookieHeader.match(/oauth_state=([^;]+)/);
  if (!stateMatch || stateMatch[1] !== state) {
    return NextResponse.redirect(new URL('/auth/login?error=state_mismatch', req.url));
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new Error('No access token returned');
    }

    const googleUser = await fetchGoogleUser(accessToken);
    const email = googleUser.email as string | undefined;
    const name = (googleUser.name as string | undefined) || googleUser.email?.split('@')[0] || 'Google User';
    const googleId = String(googleUser.id);

    if (!email) {
      return NextResponse.redirect(new URL('/auth/login?error=no_email', req.url));
    }

    // Find or create the user, and link the Google account.
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, name, emailVerified: new Date() }
      });
    }

    // Upsert the Google account link.
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: { provider: 'google', providerAccountId: googleId }
      }
    });
    if (!existingAccount) {
      await prisma.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: 'google',
          providerAccountId: googleId,
          access_token: accessToken
        }
      });
    }

    const cookie = await createSessionAndCookie(user.id, true);
    const res = NextResponse.redirect(new URL('/dashboard', req.url));
    res.headers.set('Set-Cookie', cookie);
    return res;
  } catch (err) {
    console.error('Google OAuth callback error', err);
    return NextResponse.redirect(new URL('/auth/login?error=callback_failed', req.url));
  }
}
