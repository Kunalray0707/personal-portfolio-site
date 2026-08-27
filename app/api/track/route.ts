import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prismadb';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { portfolioId, referrer, pathname } = body;

    if (!portfolioId) {
      return NextResponse.json({ error: 'Missing portfolioId' }, { status: 400 });
    }

    // Get IP and User-Agent
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Hash to respect privacy (avoid storing raw IPs)
    const visitorHash = crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex');

    // Basic device detection
    let device = 'desktop';
    if (/mobile/i.test(userAgent)) device = 'mobile';
    else if (/tablet/i.test(userAgent)) device = 'tablet';

    // Parse country from Vercel/Cloudflare headers if available
    const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || 'Unknown';

    // Prevent duplicate logging for the same visitor within 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingVisit = await prisma.portfolioVisit.findFirst({
      where: {
        portfolioId,
        visitorHash,
        createdAt: { gte: yesterday }
      }
    });

    if (!existingVisit) {
      await prisma.$transaction([
        prisma.portfolioVisit.create({
          data: {
            portfolioId,
            visitorHash,
            userAgent,
            device,
            country,
            referrer: referrer || null
          }
        }),
        prisma.portfolio.update({
          where: { id: portfolioId },
          data: { views: { increment: 1 } }
        })
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Tracking Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
