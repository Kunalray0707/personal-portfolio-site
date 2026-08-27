import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prismadb';
import { getCurrentUser } from '../../../../lib/auth';
import { createUniqueSlug } from '../../../../lib/slugify';

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().max(280).optional(),
  heroTitle: z.string().min(3).optional(),
  heroSubtitle: z.string().optional(),
  isPrivate: z.boolean().optional().default(false),
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['text', 'feature', 'contact']),
      title: z.string(),
      body: z.string().optional(),
      bullets: z.array(z.string()).optional(),
      imageUrl: z.string().optional()
    })
  ).optional()
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await req.json();
  const data = createSchema.parse(payload);

  const slug = await createUniqueSlug(data.title, async (candidate) => {
    const existing = await prisma.portfolio.findUnique({ where: { slug: candidate } });
    return Boolean(existing);
  });

  const defaultSections = data.sections ?? [
    { id: 'section-1', type: 'text' as const, title: 'About your portfolio', body: 'Talk about your work, skills, and experience.', imageUrl: '' },
    { id: 'section-2', type: 'feature' as const, title: 'Featured work', body: 'Showcase client projects, case studies, or product highlights.', imageUrl: '' }
  ];

  const portfolio = await prisma.portfolio.create({
    data: {
      userId: user.id,
      title: data.title,
      slug,
      description: data.description || '',
      heroTitle: data.heroTitle || data.title,
      heroSubtitle: data.heroSubtitle || 'Publish your best work with a modern portfolio.',
      isPrivate: data.isPrivate,
      published: false,
      content: JSON.stringify({
        sections: [
          { id: '1', title: 'About Me', type: 'text', body: 'Write something about yourself.' },
          { id: '2', title: 'My Projects', type: 'feature', bullets: ['Project 1', 'Project 2'] },
          { id: '3', title: 'Contact', type: 'contact' }
        ]
      }),
      passwordHash: null
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

  return NextResponse.json({ portfolio });
}
