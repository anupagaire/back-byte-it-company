import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;           
    const body = await req.json();

    const updated = await prisma.job.update({
      where: { id },
      data: {
        title: body.title,
        location: body.location,
        type: body.type,
        department: body.department ?? undefined,
        description: body.description,
        published: body.published,         
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Update Job Error:', error);
    return NextResponse.json(
      { error: 'Failed to update job', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;           // ← Also await here

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete Job Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete job', details: error.message },
      { status: 500 }
    );
  }
}