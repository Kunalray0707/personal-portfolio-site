import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../../lib/prismadb';
import { sendSms } from '../../../../../lib/sms';
import { randomInt } from 'crypto';

const bodySchema = z.object({ phone: z.string().min(6) });

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Invalid request');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = bodySchema.parse(body);

    // generate 6-digit code
    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // upsert user by phone (do not create email)
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone } });
    }

    await prisma.oTP.create({ data: { phone, code, expiresAt, userId: user.id } });

    await sendSms(phone, `Your Portfolio AI Pro login code is ${code}. It expires in 5 minutes.`);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}
