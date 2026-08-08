import { NextResponse } from 'next/server';
import { z } from 'zod';
import archiver from 'archiver';
import type { ArchiverError } from 'archiver';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { toExportPortfolio, buildStandaloneHTML, buildJSONExport, buildVercelManifest } from '../../../../lib/export';

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

  const archive = archiver('zip', { zlib: { level: 9 } });
  const chunks: Buffer[] = [];
  archive.on('data', (chunk: Buffer) => chunks.push(chunk));

  const done = new Promise<void>((resolve, reject) => {
    archive.on('end', () => resolve());
    archive.on('error', (err: ArchiverError) => reject(err));
  });

  archive.append(buildStandaloneHTML(exportPortfolio), { name: 'index.html' });
  archive.append(JSON.stringify(buildVercelManifest(exportPortfolio), null, 2), { name: 'vercel.json' });
  archive.append(buildJSONExport(exportPortfolio), { name: 'portfolio.json' });
  archive.append('This is a static export of your portfolio. Deploy the contained files to any static/vercel host.', { name: 'README.txt' });

  await archive.finalize();
  await done;

  const buffer = Buffer.concat(chunks);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${exportPortfolio.slug}.zip"`
    }
  });
}
