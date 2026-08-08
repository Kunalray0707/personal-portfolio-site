import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional()
});

function serializeSessionCookie(token: string, maxAgeSeconds: number) {
  const cookie = `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}; Secure`;
  return cookie;
}

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Invalid request');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = bodySchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.passwordHash) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + (data.remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000));

    await prisma.session.create({ data: { userId: user.id, sessionToken: token, expiresAt } });

    const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    const cookie = serializeSessionCookie(token, maxAge);

    return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' } });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}
