import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '../../../lib/auth';
import { uploadBuffer } from '../../../lib/cloudinary';

const uploadSchema = z.object({
  kind: z.enum(['image', 'resume']).default('image')
});

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST /api/upload — upload an image or resume (PDF) to Cloudinary
// Requires an authenticated session. Accepts multipart/form-data.
export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const kindRaw = formData.get('kind') || 'image';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const parsedKind = uploadSchema.safeParse({ kind: kindRaw });
    const kind = parsedKind.success ? parsedKind.data.kind : 'image';

const fileObj = file as File;
    const buffer = Buffer.from(await fileObj.arrayBuffer());
    const mimeType = fileObj.type || fileObj.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : (kind === 'resume' ? 'application/pdf' : 'image/png');

    const isPdf = mimeType === 'application/pdf' || fileObj.name.toLowerCase().endsWith('.pdf');
    const resourceType = isPdf ? 'raw' : 'image';
    const folder = kind === 'resume' ? `resumes/${user.id}` : `portfolios/${user.id}`;

    const result = await uploadBuffer(buffer, {
      folder,
      resourceType,
      mimeType,
      filename: fileObj.name.split('.')[0] || 'upload'
    });

    return NextResponse.json({ success: true, upload: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
