import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../../lib/prismadb';
import { createSessionAndCookie } from '../../../../../lib/session';

const bodySchema = z.object({
  identifier: z.string().min(5),
  code: z.string().length(6)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, code } = bodySchema.parse(body);

    const otp = await prisma.oTP.findFirst({
      where: { phone: identifier, code, used: false },
      orderBy: { createdAt: 'desc' }
    });

    if (!otp || !otp.userId) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    if (otp.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Code expired' }, { status: 400 });
    }

    // Mark as used
    await prisma.oTP.update({ where: { id: otp.id }, data: { used: true } });

    // Login user
    const cookieHeader = await createSessionAndCookie(otp.userId, true);
    
    const response = NextResponse.json({ ok: true });
    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }
}
