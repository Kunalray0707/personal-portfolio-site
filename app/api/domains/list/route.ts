import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

/** List all custom domains owned by the current user. */
export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const domains = await prisma.customDomain.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      domain: true,
      verified: true,
      verifiedAt: true,
      createdAt: true,
      portfolioId: true,
      portfolio: { select: { title: true, slug: true } },
    },
  });

  return NextResponse.json({ domains });
}
