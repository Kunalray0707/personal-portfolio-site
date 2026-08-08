import { NextResponse } from 'next/server';
import { z } from 'zod';
import { suggestSEO } from '../../../../lib/ai_impl';

const schema = z.object({ title: z.string().min(1), description: z.string().optional() });
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = schema.parse(payload);
    const seo = await suggestSEO({ title: data.title, description: data.description });
    return NextResponse.json({ seo });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to generate SEO' }, { status: 500 });
  }
}
