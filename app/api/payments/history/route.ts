import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/payments/history — list the authenticated user's payment history
export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      plan: { select: { name: true, slug: true } },
      invoice: { select: { invoiceNumber: true, pdfUrl: true } }
    }
  });

  return NextResponse.json({ payments });
}
