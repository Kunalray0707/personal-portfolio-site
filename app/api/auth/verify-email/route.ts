import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';

export const dynamic = 'force-dynamic';

const querySchema = z.object({ token: z.string() });

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Invalid request');

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = querySchema.parse(Object.fromEntries(url.searchParams.entries()));
    // Our token format was `${userId}.${timestamp}` in Phase 2; verify and mark emailVerified
    const [userId] = q.token.split('.');
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

    const user = await prisma.user.update({ where: { id: userId }, data: { emailVerified: new Date() } });
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}
