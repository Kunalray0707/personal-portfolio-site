import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prismadb';
import { headers } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { active } = await req.json();

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: { active }
    });

    return NextResponse.json({ coupon });
  } catch (error: any) {
    console.error('Admin Update Coupon Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.coupon.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Delete Coupon Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
