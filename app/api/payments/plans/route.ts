import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { seedPlans } from '../../../../lib/payments';

export const dynamic = 'force-dynamic';

// GET /api/payments/plans — list all active plans (public)
export async function GET() {
  try {
    // Ensure the default plan catalog exists on first run.
    await seedPlans();

    const plans = await prisma.plan.findMany({
      where: { active: true },
      orderBy: { priceINR: 'asc' }
    });

    return NextResponse.json({ plans });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load plans';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
