import crypto from 'crypto';

/**
 * Google OAuth 2.0 helpers for the manual (non-Auth.js) Google sign-in flow.
 * All functions gracefully no-op / return empty when env vars are missing,
 * mirroring the existing mock-mode pattern used for AI and Razorpay.
 */

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`;

export const isGoogleConfigured = Boolean(CLIENT_ID && CLIENT_SECRET);

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

/**
 * Returns the authorization URL the user should be redirected to in order to
 * start the Google OAuth flow. Includes a state parameter for CSRF protection.
 */
export function getGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID || '',
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account'
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchanges an authorization code for an access token.
 */
export async function exchangeCodeForToken(code: string) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID || '',
      client_secret: CLIENT_SECRET || '',
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  });

  if (!res.ok) {
    throw new Error('Failed to exchange Google auth code');
  }
  return res.json();
}

/**
 * Fetches the user's profile from Google using an access token.
 */
export async function fetchGoogleUser(accessToken: string) {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch Google user profile');
  }
  return res.json();
}

/**
 * Generates a random state token for CSRF protection.
 */
export function generateOAuthState(): string {
  return crypto.randomBytes(24).toString('hex');
}
