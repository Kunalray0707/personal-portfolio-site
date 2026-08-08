import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { toExportPortfolio, buildStandaloneHTML } from '../../../../lib/export';

const schema = z.object({ portfolioId: z.string().min(1) });
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await req.json();
  const data = schema.parse(payload);

  const portfolio = await prisma.portfolio.findUnique({ where: { id: data.portfolioId } });
  if (!portfolio || portfolio.userId !== user.id) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  const exportPortfolio = toExportPortfolio(portfolio);
  const html = buildStandaloneHTML(exportPortfolio);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${exportPortfolio.slug}.html"`
    }
  });
}
