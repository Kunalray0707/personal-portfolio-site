import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ coupons });
  } catch (error: any) {
    console.error('Admin Coupons API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { code, discountPercent, maxUses, expiresAt } = await req.json();

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountPercent: parseInt(discountPercent),
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: true
      }
    });

    return NextResponse.json({ coupon });
  } catch (error: any) {
    console.error('Admin Create Coupon Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
