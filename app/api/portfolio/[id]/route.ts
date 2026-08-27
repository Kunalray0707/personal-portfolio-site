import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';

const sectionSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'feature', 'contact']),
  title: z.string().min(1),
  body: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  imageUrl: z.string().optional()
});

const updateSchema = z.object({
  title: z.string().min(3),
  description: z.string().max(280).optional(),
  heroTitle: z.string().min(3),
  heroSubtitle: z.string().optional(),
  isPrivate: z.boolean().default(false),
  published: z.boolean().default(false),
  password: z.string().max(128).optional(),
  sections: z.array(sectionSchema),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  customHeadScript: z.string().optional(),
  customBodyScript: z.string().optional()
});

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const portfolio = await prisma.portfolio.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      userId: true,
      title: true,
      slug: true,
      description: true,
      heroTitle: true,
      heroSubtitle: true,
      isPrivate: true,
      published: true,
      content: true,
      metaTitle: true,
      metaDescription: true,
      ogImageUrl: true,
      customHeadScript: true,
      customBodyScript: true,
      createdAt: true,
      updatedAt: true,
      versions: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!portfolio || portfolio.userId !== user.id) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  return NextResponse.json({ portfolio });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const portfolio = await prisma.portfolio.findUnique({ where: { id: params.id } });
  if (!portfolio || portfolio.userId !== user.id) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  const body = await req.json();
  const data = updateSchema.parse(body);

  const updateData: Record<string, unknown> = {
    title: data.title,
    description: data.description || '',
    heroTitle: data.heroTitle,
    heroSubtitle: data.heroSubtitle || '',
    isPrivate: data.isPrivate,
    published: data.published,
    content: { sections: data.sections },
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    ogImageUrl: data.ogImageUrl,
    customHeadScript: data.customHeadScript,
    customBodyScript: data.customBodyScript
  };

  if (data.isPrivate) {
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }
  } else {
    updateData.passwordHash = null;
  }

  const updated = await prisma.portfolio.update({
    where: { id: params.id },
    data: updateData,
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
      metaTitle: true,
      metaDescription: true,
      ogImageUrl: true,
      customHeadScript: true,
      customBodyScript: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return NextResponse.json({ portfolio: updated });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const portfolio = await prisma.portfolio.findUnique({ where: { id: params.id } });
  if (!portfolio || portfolio.userId !== user.id) {
    return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  }

  await prisma.portfolio.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
