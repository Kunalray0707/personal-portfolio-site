import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const sessionToken = match[1];
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  return NextResponse.json({ userId: session.userId, role: session.user.role });
}
