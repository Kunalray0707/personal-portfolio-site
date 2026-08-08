import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { sendForgotPasswordEmail } from '../../../../lib/email';
import { v4 as uuidv4 } from 'uuid';

const bodySchema = z.object({ email: z.string().email() });

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Invalid request');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = bodySchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: true }); // do not reveal

    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

    await sendForgotPasswordEmail(email, token);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}
