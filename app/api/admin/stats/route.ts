import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parallelize queries
    const [
      totalUsers,
      totalPortfolios,
      activeSubscriptions,
      payments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.portfolio.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS' }
      })
    ]);

    const totalRevenue = (payments._sum.amount || 0) / 100; // Assuming amount is in paise/cents

    return NextResponse.json({
      totalUsers,
      totalPortfolios,
      activeSubscriptions,
      totalRevenue
    });
  } catch (error: any) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
