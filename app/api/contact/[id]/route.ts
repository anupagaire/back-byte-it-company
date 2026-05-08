import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;  // 👈 await the params

    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Contact deleted',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}