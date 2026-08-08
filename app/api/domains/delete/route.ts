import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';

const schema = z.object({ customDomainId: z.string().min(1) });
export const dynamic = 'force-dynamic';

/** Remove a custom domain owned by the current user. */
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

  await prisma.customDomain.delete({ where: { id: customDomain.id } });
  return NextResponse.json({ success: true });
}
