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

    const [portfolios, versions] = await Promise.all([
      prisma.portfolio.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, createdAt: true }
      }),
      prisma.portfolioVersion.findMany({
        where: { portfolio: { userId } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, portfolio: { select: { title: true } }, createdAt: true, note: true }
      })
    ]);

    const activity = [
      ...portfolios.map(p => ({
        id: `portfolio-${p.id}`,
        title: 'Portfolio Created',
        description: `You created a new portfolio: "${p.title}".`,
        createdAt: p.createdAt
      })),
      ...versions.map(v => ({
        id: `version-${v.id}`,
        title: 'Version Saved',
        description: `You saved a new version of "${v.portfolio.title}". ${v.note ? `Note: ${v.note}` : ''}`,
        createdAt: v.createdAt
      }))
    ];

    activity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ activity: activity.slice(0, 10) });
  } catch (error: any) {
    console.error('User Activity Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
