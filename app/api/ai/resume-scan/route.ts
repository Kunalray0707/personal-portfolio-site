import { NextResponse } from 'next/server';
import { z } from 'zod';
import { scanResume } from '../../../../lib/ai_impl';

const schema = z.object({ resumeText: z.string().min(10) });
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = schema.parse(payload);
    const result = await scanResume({ resumeText: data.resumeText });
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to scan resume' }, { status: 500 });
  }
}
