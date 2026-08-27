import { prisma } from './prismadb';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new DB-backed session for a user and returns the serialized
 * session cookie header value. Mirrors the session-creation logic in the
 * login route so OAuth flows can reuse it consistently.
 */
export async function createSessionAndCookie(
  userId: string,
  remember = false
): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date(
    Date.now() + (remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
  );

  await prisma.session.create({
    data: { userId, sessionToken: token, expiresAt }
  });

  const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
  return `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Secure`;
}
