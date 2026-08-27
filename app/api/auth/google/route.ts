import { NextResponse } from 'next/server';
import { generateOAuthState, getGoogleAuthUrl, isGoogleConfigured } from '../../../../lib/google';

export const dynamic = 'force-dynamic';

// GET /api/auth/google — redirect the user to Google's OAuth consent screen
export async function GET() {
  if (!isGoogleConfigured) {
    return NextResponse.json(
      { error: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' },
      { status: 503 }
    );
  }

  const state = generateOAuthState();
  const url = getGoogleAuthUrl(state);

  const res = NextResponse.json({ url });
  // Store the state in an httpOnly, short-lived cookie for CSRF protection.
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/'
  });
  return res;
}
