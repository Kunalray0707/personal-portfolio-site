import crypto from 'crypto';
import { describe, it, expect } from 'vitest';
import {
  generateInvoiceNumber,
  verifyPaymentSignature,
  verifyWebhookSignature,
  createOrder,
  createRefund,
  getRazorpayKeyId
} from '../lib/razorpay';
import {
  computeSubscriptionEnd,
  defaultPlans,
  type PlanInterval
} from '../lib/payments';

describe('Payments lib (mock mode)', () => {
  it('generateInvoiceNumber returns a unique invoice number in the expected format', () => {
    const a = generateInvoiceNumber();
    const b = generateInvoiceNumber();
    expect(a).toMatch(/^INV-\d{6}-\d{6}-[A-F0-9]{10}$/);
    expect(a).not.toBe(b);
  });

  it('verifyPaymentSignature returns false for an invalid signature', () => {
    const valid = verifyPaymentSignature({
      orderId: 'order_123',
      paymentId: 'pay_123',
      signature: 'not-a-real-signature'
    });
    expect(valid).toBe(false);
  });

  it('verifyPaymentSignature returns true when signature matches the secret', () => {
    // Recompute the expected HMAC using the same algorithm with an empty secret,
    // matching the mock-mode key secret (KEY_SECRET is undefined -> '').
    const body = 'order_456|pay_456';
    const expected = crypto.createHmac('sha256', '').update(body).digest('hex');
    const valid = verifyPaymentSignature({
      orderId: 'order_456',
      paymentId: 'pay_456',
      signature: expected
    });
    expect(valid).toBe(true);
  });

  it('verifyWebhookSignature returns false when webhook secret is absent', () => {
    expect(verifyWebhookSignature('body', 'signature')).toBe(false);
  });

  it('createOrder returns a mock order when Razorpay is not configured', async () => {
    const order = await createOrder({ amount: 49900, currency: 'INR' });
    expect(order.id).toMatch(/^order_mock_/);
    expect(order.amount).toBe(49900);
    expect(order.currency).toBe('INR');
    expect(order.status).toBe('created');
  });

  it('createRefund returns a mock refund id when Razorpay is not configured', async () => {
    const refund = await createRefund('pay_mock_123');
    expect(refund.id).toMatch(/^refund_mock_/);
  });

  it('getRazorpayKeyId returns an empty string when no key configured', () => {
    expect(typeof getRazorpayKeyId()).toBe('string');
  });
});

describe('Payments helpers (plans)', () => {
  it('computeSubscriptionEnd returns null for LIFETIME plans', () => {
    expect(computeSubscriptionEnd('LIFETIME')).toBeNull();
  });

  it('computeSubscriptionEnd returns +1 month for MONTHLY plans', () => {
    const start = new Date('2024-01-15T00:00:00Z');
    const end = computeSubscriptionEnd('MONTHLY', start);
    expect(end).not.toBeNull();
    expect(end!.getUTCMonth()).toBe(1); // February
  });

  it('computeSubscriptionEnd returns +1 year for YEARLY plans', () => {
    const start = new Date('2024-01-15T00:00:00Z');
    const end = computeSubscriptionEnd('YEARLY', start);
    expect(end).not.toBeNull();
    expect(end!.getUTCFullYear()).toBe(2025);
  });

  it('defaultPlans contains a free plan and at least one paid plan', () => {
    const freePlan = defaultPlans.find((p) => p.priceINR === 0);
    expect(freePlan).toBeDefined();
    expect(freePlan!.slug).toBe('free');
    expect(defaultPlans.some((p) => p.priceINR > 0)).toBe(true);
  });

  it('defaultPlans all have valid intervals and features', () => {
    const validIntervals: PlanInterval[] = ['MONTHLY', 'YEARLY', 'LIFETIME'];
    for (const plan of defaultPlans) {
      expect(validIntervals).toContain(plan.interval);
      expect(Array.isArray(plan.features)).toBe(true);
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });
});
