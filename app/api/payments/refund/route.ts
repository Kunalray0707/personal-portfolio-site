import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { createRefund } from '../../../../lib/razorpay';

const refundSchema = z.object({
  paymentId: z.string().min(1).optional(),
  amount: z.number().positive().optional()
});

export const dynamic = 'force-dynamic';

// POST /api/payments/refund — initiate a refund for a user's payment
export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = refundSchema.parse(body);

    // If no paymentId is provided, target the user's most recent SUCCESS payment.
    let payment;
    if (data.paymentId) {
      payment = await prisma.payment.findUnique({
        where: { id: data.paymentId }
      });
    } else {
      payment = await prisma.payment.findFirst({
        where: { userId: user.id, status: 'SUCCESS' },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (!payment || payment.userId !== user.id) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    if (payment.status === 'REFUNDED') {
      return NextResponse.json({ error: 'Payment already refunded' }, { status: 400 });
    }
    if (!payment.razorpayPaymentId) {
      return NextResponse.json({ error: 'Payment has no Razorpay reference' }, { status: 400 });
    }

    const refund = await createRefund(payment.razorpayPaymentId, data.amount);

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        refundId: refund.id,
        refundedAt: new Date(),
        status: 'REFUNDED'
      }
    });

    return NextResponse.json({ success: true, refundId: refund.id, payment: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to process refund';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
