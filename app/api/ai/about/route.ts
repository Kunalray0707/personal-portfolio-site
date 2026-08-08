import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAbout } from '../../../../lib/ai_impl';

const schema = z.object({
  title: z.string().min(1),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  description: z.string().optional(),
  sections: z.array(z.object({
    id: z.string().optional(),
    type: z.enum(['text','feature','contact']).optional(),
    title: z.string().min(1).optional(),
    body: z.string().optional(),
    bullets: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional()
  })).optional()
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = schema.parse(payload);
    const about = await generateAbout({ title: data.title, heroTitle: data.heroTitle, heroSubtitle: data.heroSubtitle, description: data.description, sections: data.sections });
    return NextResponse.json({ about });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to generate about' }, { status: 500 });
  }
}
