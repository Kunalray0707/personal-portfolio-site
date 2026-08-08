import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import bcrypt from 'bcryptjs';

const bodySchema = z.object({ token: z.string(), password: z.string().min(8) });

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Invalid request');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = bodySchema.parse(body);

    const vt = await prisma.verificationToken.findUnique({ where: { token } });
    if (!vt || vt.expires < new Date()) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: vt.identifier } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const hash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });

    // remove token
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}
