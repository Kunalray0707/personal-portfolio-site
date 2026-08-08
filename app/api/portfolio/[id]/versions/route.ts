import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prismadb';
import { getCurrentUser } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const portfolio = await prisma.portfolio.findUnique({ where: { id: params.id } });
  if (!portfolio || portfolio.userId !== user.id) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  const versions = await prisma.portfolioVersion.findMany({
    where: { portfolioId: params.id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ versions });
}
