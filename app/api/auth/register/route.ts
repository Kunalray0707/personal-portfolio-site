import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../../../../lib/email';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Invalid request');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = bodySchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 });

    const hash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({ data: { email: data.email, passwordHash: hash, name: data.name } });

    // send verification email (async, non-blocking)
    if (user.email) sendVerificationEmail(user.email, user.id).catch((err) => console.error('verification email error', err));

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}
