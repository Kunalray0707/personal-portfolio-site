import { NextResponse } from 'next/server';
import { z } from 'zod';
import archiver from 'archiver';
import type { ArchiverError } from 'archiver';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { toExportPortfolio, buildStandaloneHTML, buildVercelManifest } from '../../../../lib/export';

const schema = z.object({ portfolioId: z.string().min(1) });
export const dynamic = 'force-dynamic';

/**
 * Generate a deployable static bundle (as a zip) along with a deployment
 * payload. The returned JSON includes a base64-encoded zip so the client can
 * hand it off to Vercel/GitHub without an extra round trip.
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

  const archive = archiver('zip', { zlib: { level: 9 } });
  const chunks: Buffer[] = [];
  archive.on('data', (chunk: Buffer) => chunks.push(chunk));

  const done = new Promise<void>((resolve, reject) => {
    archive.on('end', () => resolve());
    archive.on('error', (err: ArchiverError) => reject(err));
  });

  archive.append(buildStandaloneHTML(exportPortfolio), { name: 'index.html' });
  archive.append(JSON.stringify(buildVercelManifest(exportPortfolio), null, 2), { name: 'vercel.json' });
  archive.append('Deploy this static bundle to Vercel, Netlify, or any static host.', { name: 'README.txt' });

  await archive.finalize();
  await done;

  const buffer = Buffer.concat(chunks);
  return NextResponse.json({
    projectName: `portfolio-${exportPortfolio.slug}`,
    bundleBase64: buffer.toString('base64'),
    fileCount: 3,
    readme: 'Upload the generated files to your hosting provider of choice.',
  });
}
