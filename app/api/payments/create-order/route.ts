import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { createOrder } from '../../../../lib/razorpay';

const orderSchema = z.object({
  planId: z.string().min(1)
});

export const dynamic = 'force-dynamic';

// POST /api/payments/create-order — create a Razorpay order for a plan
export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = orderSchema.parse(body);

    const plan = await prisma.plan.findUnique({ where: { id: data.planId } });
    if (!plan || !plan.active) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
    if (plan.priceINR <= 0) {
      return NextResponse.json({ error: 'This plan is free and does not require payment' }, { status: 400 });
    }

    const order = await createOrder({
      amount: plan.priceINR,
      currency: plan.currency,
      receipt: `plan_${plan.slug}_${user.id.slice(0, 8)}`
    });

    return NextResponse.json({
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      plan,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || ''
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
