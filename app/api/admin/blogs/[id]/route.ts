import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prismadb';
import { headers } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { title, slug, content, excerpt, published, coverImage } = await req.json();

    const blog = await prisma.blogPost.update({
      where: { id: params.id },
      data: { title, slug, content, excerpt, published, coverImage }
    });

    return NextResponse.json({ blog });
  } catch (error: any) {
    console.error('Admin Update Blog Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.blogPost.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Delete Blog Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
