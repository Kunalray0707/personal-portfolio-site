import { NextResponse } from 'next/server';
import { z } from 'zod';
import { suggestSkills } from '../../../../lib/ai_impl';

const schema = z.object({ projectsOrBio: z.string().min(10) });
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = schema.parse(payload);
    const skills = await suggestSkills({ projectsOrBio: data.projectsOrBio });
    return NextResponse.json({ skills });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to suggest skills' }, { status: 500 });
  }
}
