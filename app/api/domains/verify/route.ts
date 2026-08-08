import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { verifyDomainToken } from '../../../../lib/domains';

const schema = z.object({
  customDomainId: z.string().min(1),
  token: z.string().min(1)
});
export const dynamic = 'force-dynamic';

/** Verify a custom domain using the provided TXT verification token. */
export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await req.json();
  const data = schema.parse(payload);

  const customDomain = await prisma.customDomain.findUnique({
    where: { id: data.customDomainId }
  });
  if (!customDomain || customDomain.userId !== user.id) {
    return NextResponse.json({ error: 'Custom domain not found' }, { status: 404 });
  }

  if (customDomain.verified) {
    return NextResponse.json({ success: true, customDomain, alreadyVerified: true });
  }

  // In a real deployment the token would be compared against the domain's
  // actual TXT record. For this build we compare the provided token against
  // the stored fingerprint (the domain ID acts as the expected token).
  const ok = verifyDomainToken(customDomain.domain, data.token, customDomain.id);
  if (!ok) {
    return NextResponse.json({ error: 'Verification failed. Check your TXT record and try again.' }, { status: 400 });
  }

  const updated = await prisma.customDomain.update({
    where: { id: customDomain.id },
    data: { verified: true, verifiedAt: new Date() }
  });

  return NextResponse.json({ success: true, customDomain: updated });
}
