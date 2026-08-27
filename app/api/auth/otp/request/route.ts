import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../../lib/prismadb';
import { sendSms } from '../../../../../lib/sms';
// Note: If you want to actually send emails, you would import a sendEmail function here.
// For this MVP, we will simulate it.
import { randomInt } from 'crypto';

const bodySchema = z.object({ identifier: z.string().min(5) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier } = bodySchema.parse(body);

    const isEmail = identifier.includes('@');

    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Find or create user
    let user = await prisma.user.findFirst({
      where: isEmail ? { email: identifier } : { phone: identifier }
    });

    if (!user) {
      user = await prisma.user.create({
        data: isEmail ? { email: identifier } : { phone: identifier }
      });
    }

    // We use the 'phone' column in OTP table as a generic 'identifier' to avoid schema changes
    await prisma.oTP.create({
      data: { phone: identifier, code, expiresAt, userId: user.id }
    });

    if (isEmail) {
      // Simulate sending email
      console.log(`[EMAIL] To: ${identifier}, Code: ${code}`);
    } else {
      await sendSms(identifier, `Your Portfolio AI Pro login code is ${code}. It expires in 5 minutes.`);
    }

    // For local testing convenience (since DB is offline for user), return code in response so they don't get stuck
    return NextResponse.json({ ok: true, dev_code: code });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to request OTP' }, { status: 400 });
  }
}
