import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { toExportPortfolio, buildStandaloneHTML, buildGitHubMetadata } from '../../../../lib/export';

const schema = z.object({ portfolioId: z.string().min(1) });
export const dynamic = 'force-dynamic';

/**
 * Prepare a GitHub-ready export. Returns repository metadata and a base64
 * index.html so the user can push it to a new GitHub repo. In production this
 * would call the GitHub API to create a repo and push the files.
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
  const metadata = buildGitHubMetadata(exportPortfolio);
  const indexHtml = buildStandaloneHTML(exportPortfolio);

  return NextResponse.json({
    repository: metadata,
    files: {
      'index.html': Buffer.from(indexHtml).toString('base64'),
      'README.md': Buffer.from(`# ${exportPortfolio.title}\n\n${exportPortfolio.description}\n\nDeployed with Portfolio AI Pro.`).toString('base64'),
    },
    message: 'Ready to push to GitHub. Use the GitHub CLI or web UI to create a repository and upload these files.',
  });
}
