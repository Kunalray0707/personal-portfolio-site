import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/session=([^;]+)/);
    if (!match) return NextResponse.json({ user: null });

    const token = match[1];
    const session = await prisma.session.findUnique({ where: { sessionToken: token }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) return NextResponse.json({ user: null });

    const { user } = session;
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null });
  }
}
