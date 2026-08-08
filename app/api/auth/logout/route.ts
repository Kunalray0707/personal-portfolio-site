import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Invalid request');

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/session=([^;]+)/);
    if (match) {
      const token = match[1];
      await prisma.session.deleteMany({ where: { sessionToken: token } });
    }

    // expire cookie
    const expired = `session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
    return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers: { 'Set-Cookie': expired, 'Content-Type': 'application/json' } });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}
