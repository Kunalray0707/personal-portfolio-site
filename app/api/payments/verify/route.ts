import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { verifyPaymentSignature } from '../../../../lib/razorpay';
import {
  computeSubscriptionEnd,
  createInvoiceForPayment,
  isUserPremium
} from '../../../../lib/payments';

const verifySchema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().min(1),
  planId: z.string().min(1)
});

export const dynamic = 'force-dynamic';

// POST /api/payments/verify — verify signature, mark payment success,
// create invoice, activate subscription, and unlock premium.
export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = verifySchema.parse(body);

    const plan = await prisma.plan.findUnique({ where: { id: data.planId } });
    if (!plan || !plan.active) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Verify the payment signature (order + payment + signature).
    const valid = verifyPaymentSignature({
      orderId: data.orderId,
      paymentId: data.paymentId,
      signature: data.signature
    });
    if (!valid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Idempotency: if a payment with this razorpay_payment_id already exists,
    // treat it as already verified.
    const existingPayment = await prisma.payment.findUnique({
      where: { razorpayPaymentId: data.paymentId }
    });
    if (existingPayment && existingPayment.status === 'SUCCESS') {
      const premium = await isUserPremium(user.id);
      return NextResponse.json({ success: true, alreadyProcessed: true, premium });
    }

    // Determine subscription end date.
    const endDate = computeSubscriptionEnd(
      plan.interval as 'MONTHLY' | 'YEARLY' | 'LIFETIME'
    );

    // Create or find an active subscription for the user + plan.
    let subscription = await prisma.subscription.findFirst({
      where: { userId: user.id, planId: plan.id, status: 'ACTIVE' }
    });
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          planId: plan.id,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate
        }
      });
    } else if (endDate) {
      subscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'ACTIVE', startDate: new Date(), endDate }
      });
    }

    // Create the payment record.
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        planId: plan.id,
        razorpayOrderId: data.orderId,
        razorpayPaymentId: data.paymentId,
        razorpaySignature: data.signature,
        amount: plan.priceINR,
        currency: plan.currency,
        status: 'SUCCESS',
        subscriptionId: subscription.id,
        invoiceNumber: `PG-${Date.now()}-${user.id.slice(0, 4)}`
      }
    });

    // Create an invoice for the payment.
    await createInvoiceForPayment(user.id, payment.id, payment.amount, payment.currency);

    const premium = await isUserPremium(user.id);
    return NextResponse.json({ success: true, alreadyProcessed: false, premium, subscriptionId: subscription.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to verify payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
