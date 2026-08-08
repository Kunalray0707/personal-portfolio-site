import crypto from 'crypto';

// Razorpay client configuration.
// When RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not provided, the app runs in
// a local mock/sandbox mode so payment flows can be tested end-to-end without
// live credentials. This mirrors the existing AI mock-mode pattern.

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export const isRazorpayConfigured = Boolean(KEY_ID && KEY_SECRET);

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
};

type RazorpayClient = {
  orders: {
    create: (params: {
      amount: number;
      currency: string;
      receipt?: string;
      notes?: Record<string, string>;
    }) => Promise<RazorpayOrder>;
  };
  refunds: {
    create: (params: { payment_id: string; amount?: number }) => Promise<{ id: string }>;
  };
};

// Lazy-loaded Razorpay client. Only initialized when credentials are present.
function getClient(): RazorpayClient | null {
  if (!isRazorpayConfigured) return null;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Razorpay = require('razorpay');
  return new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET }) as RazorpayClient;
}

/**
 * Generates a unique, timestamped invoice number.
 * Format: INV-YYYYMM-HHMMSS-XXXX (14-char random suffix).
 */
export function generateInvoiceNumber(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const suffix = crypto.randomBytes(5).toString('hex').toUpperCase();
  return `INV-${yyyy}${mm}-${hh}${min}${ss}-${suffix}`;
}

/**
 * Creates a Razorpay order in paise.
 * In mock mode, returns a deterministic fake order so the flow can be tested.
 */
export async function createOrder(params: {
  amount: number; // paise
  currency?: string;
  receipt?: string;
}): Promise<RazorpayOrder> {
  const client = getClient();
  if (!client) {
    // Mock order - matches Razorpay response shape.
    return {
      id: `order_mock_${Date.now()}`,
      amount: params.amount,
      currency: params.currency || 'INR',
      receipt: params.receipt || '',
      status: 'created'
    };
  }
  return client.orders.create({
    amount: params.amount,
    currency: params.currency || 'INR',
    receipt: params.receipt,
    notes: {}
  });
}

/**
 * Verifies a Razorpay payment signature (order_id + payment_id + signature).
 * Returns true when the signature is valid.
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const body = `${params.orderId}|${params.paymentId}`;
  const expected = crypto
    .createHmac('sha256', KEY_SECRET || '')
    .update(body)
    .digest('hex');
  return expected === params.signature;
}

/**
 * Verifies a Razorpay webhook signature.
 * Returns true when the signature is valid.
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');
  try {
    // Razorpay sends signature as base64-encoded HMAC. Compare in constant time.
    const expectedBase64 = Buffer.from(expected, 'hex').toString('base64');
    const a = Buffer.from(expectedBase64);
    const b = Buffer.from(signature);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Initiates a refund for a payment. In mock mode, returns a fake refund id.
 */
export async function createRefund(paymentId: string, amount?: number): Promise<{ id: string }> {
  const client = getClient();
  if (!client) {
    return { id: `refund_mock_${Date.now()}` };
  }
  return client.refunds.create({ payment_id: paymentId, amount });
}

/**
 * Returns the key id for the client-side Razorpay checkout.
 */
export function getRazorpayKeyId(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || KEY_ID || '';
}
