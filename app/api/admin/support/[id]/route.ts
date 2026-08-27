import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prismadb';
import { headers } from 'next/headers';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { name: true, role: true } } }
        }
      }
    });

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    return NextResponse.json({ ticket });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { status } = await req.json();

    const ticket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: { status }
    });

    return NextResponse.json({ ticket });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { message } = await req.json();

    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: params.id,
        userId: adminId,
        message
      }
    });

    return NextResponse.json({ message: newMessage });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
