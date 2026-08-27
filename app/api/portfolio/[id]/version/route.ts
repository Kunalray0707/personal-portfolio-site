import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../../lib/prismadb';
import { getCurrentUser } from '../../../../../lib/auth';

const versionSchema = z.object({
  snapshot: z.any(),
  note: z.string().max(120).optional()
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const portfolio = await prisma.portfolio.findUnique({ where: { id: params.id } });
  if (!portfolio || portfolio.userId !== user.id) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  const data = versionSchema.parse(await req.json());

  const version = await prisma.portfolioVersion.create({
    data: {
      portfolioId: params.id,
      snapshot: JSON.stringify(data.snapshot),
      note: data.note || ''
    }
  });

  return NextResponse.json({ version });
}
