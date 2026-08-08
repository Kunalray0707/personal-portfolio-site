import { prisma } from './prismadb';

export async function getCurrentUser(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) return null;

  const sessionToken = match[1];
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}
