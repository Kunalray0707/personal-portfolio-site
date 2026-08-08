import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../../lib/prismadb';
import { getCurrentUser } from '../../../../../lib/auth';
import { createUniqueSlug } from '../../../../../lib/slugify';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const portfolio = await prisma.portfolio.findUnique({ where: { id: params.id } });
  if (!portfolio || portfolio.userId !== user.id) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  const copyTitle = `Copy of ${portfolio.title}`;
  const slug = await createUniqueSlug(copyTitle, async (candidate: string) => {
    const existing = await prisma.portfolio.findUnique({ where: { slug: candidate } });
    return Boolean(existing);
  });

  const copy = await prisma.portfolio.create({
    data: {
      userId: user.id,
      title: copyTitle,
      slug,
      description: portfolio.description,
      heroTitle: portfolio.heroTitle,
      heroSubtitle: portfolio.heroSubtitle,
      isPrivate: portfolio.isPrivate,
      published: false,
      content: portfolio.content as Prisma.InputJsonValue,
      passwordHash: portfolio.passwordHash
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      heroTitle: true,
      heroSubtitle: true,
      isPrivate: true,
      published: true,
      content: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return NextResponse.json({ portfolio: copy });
}
