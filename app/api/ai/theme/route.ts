import { NextResponse } from 'next/server';
import { z } from 'zod';
import { suggestThemeAndColors } from '../../../../lib/ai_impl';

const schema = z.object({ content: z.string().min(1) });
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = schema.parse(payload);
    const theme = await suggestThemeAndColors({ content: data.content });
    return NextResponse.json({ theme });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to suggest theme' }, { status: 500 });
  }
}
