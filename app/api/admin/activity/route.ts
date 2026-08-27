import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

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

    const [recentUsers, recentPortfolios] = await Promise.all([
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true }
      }),
      prisma.portfolio.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, createdAt: true, user: { select: { name: true, email: true } } }
      })
    ]);

    const activity = [
      ...recentUsers.map(u => ({
        id: `user-${u.id}`,
        type: 'USER_JOINED',
        title: 'New user joined',
        description: `${u.name || u.email || 'A user'} created an account.`,
        createdAt: u.createdAt
      })),
      ...recentPortfolios.map(p => ({
        id: `portfolio-${p.id}`,
        type: 'PORTFOLIO_CREATED',
        title: 'Portfolio created',
        description: `${p.user?.name || p.user?.email || 'A user'} created "${p.title}".`,
        createdAt: p.createdAt
      }))
    ];

    activity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ activity: activity.slice(0, 15) });
  } catch (error: any) {
    console.error('Admin Activity Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
