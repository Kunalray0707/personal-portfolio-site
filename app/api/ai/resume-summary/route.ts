import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateResumeSummary } from '../../../../lib/ai_impl';

const schema = z.object({ resumeText: z.string().min(10) });
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = schema.parse(payload);
    const summary = await generateResumeSummary({ resumeText: data.resumeText });
    return NextResponse.json({ summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to generate resume summary' }, { status: 500 });
  }
}
