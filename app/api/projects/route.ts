import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  const projects = await prisma.project.findMany({
    where: all ? {} : { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, tech, desc, published, githubUrl, liveUrl } = body;

    if (!title || !category || !desc) {
      return NextResponse.json({ error: 'title, category, and desc are required' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        category,
        tech: tech || [],
        desc,
        published: published ?? true,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}