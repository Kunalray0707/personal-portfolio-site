import { prisma } from './prismadb';
import { generateInvoiceNumber } from './razorpay';

// Shared payment/plan helper functions used across API routes.

export type PlanInterval = 'MONTHLY' | 'YEARLY' | 'LIFETIME';

/**
 * Computes the subscription end date for a given plan interval.
 * Returns null for LIFETIME plans (no expiry).
 */
export function computeSubscriptionEnd(
  interval: PlanInterval,
  startDate: Date = new Date()
): Date | null {
  if (interval === 'LIFETIME') return null;
  const end = new Date(startDate);
  if (interval === 'MONTHLY') {
    end.setMonth(end.getMonth() + 1);
  } else if (interval === 'YEARLY') {
    end.setFullYear(end.getFullYear() + 1);
  }
  return end;
}

/**
 * Returns the default plan catalog. Used to seed the Plan table on first run
 * so pricing pages work immediately even without a database migration history.
 */
export const defaultPlans = [
  {
    slug: 'free',
    name: 'Free',
    description: 'Start building your portfolio with essential tools.',
    priceINR: 0,
    interval: 'LIFETIME' as PlanInterval,
    features: [
      '1 portfolio',
      'Community templates',
      'Basic AI tools',
      'Public portfolio URL'
    ]
  },
  {
    slug: 'pro-monthly',
    name: 'Pro',
    description: 'Everything you need to grow your professional brand.',
    priceINR: 49900, // ₹499.00 in paise
    interval: 'MONTHLY' as PlanInterval,
    features: [
      'Unlimited portfolios',
      'All 25 premium templates',
      'Advanced AI tools',
      'Custom domains',
      'Password protection',
      'Priority support'
    ]
  },
  {
    slug: 'pro-yearly',
    name: 'Pro Yearly',
    description: 'Save 20% with an annual Pro subscription.',
    priceINR: 479000, // ₹4,790.00 in paise (20% off)
    interval: 'YEARLY' as PlanInterval,
    features: [
      'Everything in Pro',
      '2 months free',
      'Priority support',
      'Early access to features'
    ]
  },
  {
    slug: 'lifetime',
    name: 'Lifetime',
    description: 'One-time payment. Pro features forever.',
    priceINR: 1499000, // ₹14,990.00 in paise
    interval: 'LIFETIME' as PlanInterval,
    features: [
      'Everything in Pro',
      'One-time payment',
      'Forever access',
      'Lifetime updates',
      'Priority support'
    ]
  }
];

/**
 * Ensures the default plans exist in the database. Idempotent - won't overwrite
 * existing plans. Called from the plans route on startup.
 */
export async function seedPlans(): Promise<void> {
  for (const plan of defaultPlans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: {
        slug: plan.slug,
        name: plan.name,
        description: plan.description,
        priceINR: plan.priceINR,
        interval: plan.interval,
        features: JSON.stringify(plan.features),
        active: true
      }
    });
  }
}

/**
 * Returns whether a user currently has an active premium subscription.
 * A subscription is considered active if it exists and (for finite plans)
 * hasn't expired yet.
 */
export async function isUserPremium(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });
  if (!subscription) return false;
  if (subscription.endDate && subscription.endDate < new Date()) return false;
  return true;
}

/**
 * Creates an invoice record for a successful payment.
 */
export async function createInvoiceForPayment(
  userId: string,
  paymentId: string,
  amount: number,
  currency: string
) {
  const existing = await prisma.invoice.findUnique({ where: { paymentId } });
  if (existing) return existing;

  return prisma.invoice.create({
    data: {
      userId,
      paymentId,
      invoiceNumber: generateInvoiceNumber(),
      amount,
      currency,
      status: 'PAID'
    }
  });
}
