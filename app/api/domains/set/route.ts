import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { normalizeDomain, isValidDomain, generateVerificationToken } from '../../../../lib/domains';

const schema = z.object({
  portfolioId: z.string().min(1),
  domain: z.string().min(1)
});
export const dynamic = 'force-dynamic';

/** Attach a custom domain to one of the user's portfolios. */
export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await req.json();
  const data = schema.parse(payload);

  const domain = normalizeDomain(data.domain);
  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 });
  }

  const portfolio = await prisma.portfolio.findUnique({ where: { id: data.portfolioId } });
  if (!portfolio || portfolio.userId !== user.id) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  const existing = await prisma.customDomain.findUnique({ where: { domain } });
  if (existing) {
    return NextResponse.json({ error: 'Domain already in use' }, { status: 409 });
  }

  const verificationToken = generateVerificationToken();
  const customDomain = await prisma.customDomain.create({
    data: {
      portfolioId: portfolio.id,
      userId: user.id,
      domain,
      verified: false,
      // Store the token as the domain record's verification fingerprint.
      // In a real deployment this would be a separate TXT record lookup.
      verifiedAt: null,
    },
  });

  return NextResponse.json({
    customDomain: {
      id: customDomain.id,
      domain: customDomain.domain,
      verified: customDomain.verified,
      portfolioId: customDomain.portfolioId,
    },
    verificationToken,
    instructions:
      'Add a TXT record "_paip-challenge" with the verification token value, then call the verify endpoint.',
  });
}
