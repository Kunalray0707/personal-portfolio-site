import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prismadb';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const portfolioId = searchParams.get('portfolioId');

    const whereClause: any = { portfolio: { userId } };
    if (portfolioId) {
      whereClause.portfolioId = portfolioId;
    }

    // Date calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Aggregate Visits in the last 30 days
    const visits = await prisma.portfolioVisit.findMany({
      where: {
        ...whereClause,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        createdAt: true,
        visitorHash: true,
        device: true,
        referrer: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    // Process data for charts
    const dailyData: Record<string, { views: number, unique: Set<string> }> = {};
    const deviceData: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    const referrerData: Record<string, number> = {};

    visits.forEach(v => {
      // Format date as YYYY-MM-DD
      const dateStr = v.createdAt.toISOString().split('T')[0];
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { views: 0, unique: new Set() };
      }
      
      dailyData[dateStr].views += 1;
      dailyData[dateStr].unique.add(v.visitorHash);

      // Device
      if (v.device) deviceData[v.device] = (deviceData[v.device] || 0) + 1;

      // Referrer
      if (v.referrer) {
        let domain = 'Direct';
        try {
          domain = new URL(v.referrer).hostname;
        } catch { }
        referrerData[domain] = (referrerData[domain] || 0) + 1;
      }
    });

    const chartData = Object.keys(dailyData).map(date => ({
      date,
      views: dailyData[date].views,
      visitors: dailyData[date].unique.size
    }));

    const deviceChart = Object.keys(deviceData)
      .filter(k => deviceData[k] > 0)
      .map(name => ({ name, value: deviceData[name] }));

    const referrerChart = Object.keys(referrerData)
      .sort((a, b) => referrerData[b] - referrerData[a])
      .slice(0, 5) // top 5
      .map(name => ({ name, value: referrerData[name] }));

    const totalViews = visits.length;
    const totalUnique = new Set(visits.map(v => v.visitorHash)).size;

    return NextResponse.json({
      totalViews,
      totalUnique,
      chartData,
      deviceChart,
      referrerChart
    });
  } catch (error: any) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
