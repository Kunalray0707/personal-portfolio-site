import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateBlogDraft } from '../../../../lib/ai_impl';

const schema = z.object({ topic: z.string().min(3), audience: z.string().optional() });
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = schema.parse(payload);
    const blog = await generateBlogDraft({ topic: data.topic, audience: data.audience });
    return NextResponse.json({ blog });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to generate blog' }, { status: 500 });
  }
}
