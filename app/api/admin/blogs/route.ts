import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } }
    });

    return NextResponse.json({ blogs });
  } catch (error: any) {
    console.error('Admin Blogs API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const adminId = headersList.get('x-user-id');
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { title, slug, content, excerpt, published, coverImage } = await req.json();

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });

    const blog = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published: !!published,
        coverImage,
        authorId: adminId
      }
    });

    return NextResponse.json({ blog });
  } catch (error: any) {
    console.error('Admin Create Blog Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
