import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateProjectIdeas } from '../../../../lib/ai_impl';

const schema = z.object({ context: z.string().min(10) });
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = schema.parse(payload);
    const ideas = await generateProjectIdeas({ context: data.context });
    return NextResponse.json({ ideas });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to generate project ideas' }, { status: 500 });
  }
}
