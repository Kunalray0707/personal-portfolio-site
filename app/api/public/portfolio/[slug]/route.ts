import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../../lib/prismadb';

const paramsSchema = z.object({ slug: z.string() });
const passwordSchema = z.object({ password: z.string().min(1) });

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  paramsSchema.parse(params);

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      description: true,
      heroTitle: true,
      heroSubtitle: true,
      isPrivate: true,
      slug: true,
      content: true,
      published: true,
      passwordHash: true
    }
  });
  if (!portfolio || !portfolio.published) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  if (portfolio.isPrivate) {
    return NextResponse.json({
      portfolio: {
        title: portfolio.title,
        description: portfolio.description,
        heroTitle: portfolio.heroTitle,
        heroSubtitle: portfolio.heroSubtitle,
        isPrivate: portfolio.isPrivate,
        slug: portfolio.slug
      }
    });
  }

  const publicPortfolio = {
    title: portfolio.title,
    description: portfolio.description,
    heroTitle: portfolio.heroTitle,
    heroSubtitle: portfolio.heroSubtitle,
    isPrivate: portfolio.isPrivate,
    slug: portfolio.slug,
    content: portfolio.content,
    published: portfolio.published
  };
  return NextResponse.json({ portfolio: publicPortfolio });
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  paramsSchema.parse(params);
  const data = passwordSchema.parse(await req.json());

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      description: true,
      heroTitle: true,
      heroSubtitle: true,
      isPrivate: true,
      slug: true,
      content: true,
      published: true,
      passwordHash: true
    }
  });
  if (!portfolio || !portfolio.published) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  if (!portfolio.isPrivate) {
    const publicPortfolio = {
      title: portfolio.title,
      description: portfolio.description,
      heroTitle: portfolio.heroTitle,
      heroSubtitle: portfolio.heroSubtitle,
      isPrivate: portfolio.isPrivate,
      slug: portfolio.slug,
      content: portfolio.content,
      published: portfolio.published
    };
    return NextResponse.json({ portfolio: publicPortfolio });
  }

  if (!portfolio.passwordHash) {
    return NextResponse.json({ error: 'Private portfolio locked' }, { status: 403 });
  }

  const valid = await bcrypt.compare(data.password, portfolio.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
  }

  const publicPortfolio = {
    title: portfolio.title,
    description: portfolio.description,
    heroTitle: portfolio.heroTitle,
    heroSubtitle: portfolio.heroSubtitle,
    isPrivate: portfolio.isPrivate,
    slug: portfolio.slug,
    content: portfolio.content,
    published: portfolio.published
  };
  return NextResponse.json({ portfolio: publicPortfolio });
}
