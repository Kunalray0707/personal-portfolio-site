import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { verifyWebhookSignature } from '../../../../lib/razorpay';
import { createInvoiceForPayment } from '../../../../lib/payments';

export const dynamic = 'force-dynamic';

/**
 * POST /api/payments/webhook
 *
 * Razorpay webhook handler. Verifies the webhook signature, then processes
 * payment/subscription events. In mock mode (no webhook secret configured),
 * the handler still accepts events so the flow is testable locally.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';

  const secretConfigured = Boolean(process.env.RAZORPAY_WEBHOOK_SECRET);
  if (secretConfigured && !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const eventType = event?.event || '';
  const payload = event?.payload || {};

  try {
    switch (eventType) {
      case 'payment.captured': {
        const paymentEntity = payload.payment?.entity;
        const paymentId = paymentEntity?.id as string | undefined;
        if (!paymentId) break;

        // Find the payment by razorpay_payment_id (or order id fallback).
        let payment = await prisma.payment.findUnique({
          where: { razorpayPaymentId: paymentId }
        });
        if (!payment) {
          const orderId = paymentEntity.order_id as string | undefined;
          payment = orderId
            ? await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } })
            : null;
        }

        if (payment && payment.status !== 'SUCCESS') {
          const updated = await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCESS',
              method: paymentEntity.method || payment.method,
              razorpayPaymentId: paymentId
            }
          });
          // Create an invoice if one doesn't exist yet.
          await createInvoiceForPayment(
            updated.userId,
            updated.id,
            updated.amount,
            updated.currency
          );
        }
        break;
      }

      case 'payment.failed': {
        const paymentEntity = payload.payment?.entity;
        const paymentId = paymentEntity?.id as string | undefined;
        if (!paymentId) break;
        const payment = await prisma.payment.findUnique({
          where: { razorpayPaymentId: paymentId }
        });
        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED' }
          });
        }
        break;
      }

      case 'subscription.charged': {
        const subEntity = payload.subscription?.entity;
        const subId = subEntity?.id as string | undefined;
        if (!subId) break;
        const subscription = await prisma.subscription.findFirst({
          where: { razorpaySubscriptionId: subId }
        });
        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'ACTIVE' }
          });
        }
        break;
      }

      case 'subscription.cancelled': {
        const subEntity = payload.subscription?.entity;
        const subId = subEntity?.id as string | undefined;
        if (!subId) break;
        const subscription = await prisma.subscription.findFirst({
          where: { razorpaySubscriptionId: subId }
        });
        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'CANCELLED' }
          });
        }
        break;
      }

      case 'refund.processed': {
        const refundEntity = payload.refund?.entity;
        const paymentId = refundEntity?.payment_id as string | undefined;
        if (!paymentId) break;
        const payment = await prisma.payment.findUnique({
          where: { razorpayPaymentId: paymentId }
        });
        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'REFUNDED',
              refundId: refundEntity?.id || payment.refundId,
              refundedAt: new Date()
            }
          });
        }
        break;
      }

      default:
        // Unknown events are acknowledged without error.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
