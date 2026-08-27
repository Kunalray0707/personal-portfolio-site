import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: userId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          plan: { select: { name: true } }
        }
      }),
      prisma.payment.count()
    ]);

    return NextResponse.json({
      payments,
      pagination: { total, pages: Math.ceil(total / limit), page }
    });
  } catch (error: any) {
    console.error('Admin Payments API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
