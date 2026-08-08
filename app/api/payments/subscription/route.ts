import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { isUserPremium } from '../../../../lib/payments';

export const dynamic = 'force-dynamic';

// GET /api/payments/subscription — returns the current user's subscription
// status and whether premium features are unlocked.
export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const premium = await isUserPremium(user.id);

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    include: { plan: { select: { name: true, slug: true, interval: true } } }
  });

  return NextResponse.json({
    premium,
    subscription: subscription
      ? {
          id: subscription.id,
          planName: subscription.plan.name,
          planSlug: subscription.plan.slug,
          interval: subscription.plan.interval,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate
        }
      : null
  });
}
