import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../../lib/prismadb';
import { v4 as uuidv4 } from 'uuid';

const bodySchema = z.object({ phone: z.string(), code: z.string(), remember: z.boolean().optional() });

function serializeSessionCookie(token: string, maxAgeSeconds: number) {
  const cookie = `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}; Secure`;
  return cookie;
}

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Invalid request');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = bodySchema.parse(body);

    const otp = await prisma.oTP.findFirst({ where: { phone: data.phone, code: data.code, used: false } });
    if (!otp || !otp.userId) return NextResponse.json({ error: 'Invalid code' }, { status: 400 });

    if (otp.expiresAt < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 400 });

    // mark used
    await prisma.oTP.update({ where: { id: otp.id }, data: { used: true } });

    const user = await prisma.user.findUnique({ where: { id: otp.userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

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
