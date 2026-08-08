import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { toExportPortfolio, buildStandaloneHTML } from '../../../../lib/export';

const schema = z.object({ portfolioId: z.string().min(1) });
export const dynamic = 'force-dynamic';

/**
 * PDF export.
 *
 * The HTML is built with a print-optimized stylesheet (see lib/export.ts
 * `@media print` rules). In production this response body can be rendered to
 * a real PDF via a headless browser (e.g. Puppeteer) or a PDF service. For
 * this build we return a print-ready HTML document that the browser can save
 * as PDF via "Print to PDF", which requires no additional heavyweight deps.
 */
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
      'Content-Disposition': `inline; filename="${exportPortfolio.slug}.pdf.html"`
    }
  });
}
