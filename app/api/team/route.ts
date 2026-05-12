import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const showAll = searchParams.get('all') === 'true';

  const members = await prisma.teamMember.findMany({
    where: showAll ? {} : { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const bio = (formData.get('bio') as string) || null;
    const order = parseInt((formData.get('order') as string) || '0', 10);
    const published = formData.get('published') !== 'false';

    if (!name || !role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 });
    }

    let photo: string | null = null;
    let photoPublicId: string | null = null;

    const file = formData.get('photo') as File | null;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'team',
        transformation: [{ width: 600, height: 600, crop: 'fill', gravity: 'face' }],
      });

      photo = uploadResult.secure_url;
      photoPublicId = uploadResult.public_id;
    }

    const member = await prisma.teamMember.create({
      data: { name, role, bio, photo, photoPublicId, order, published },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (err) {
    console.error('[POST /api/team]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}