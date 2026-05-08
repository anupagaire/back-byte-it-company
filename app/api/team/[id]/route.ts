// app/api/team/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type Params = Promise<{ id: string }>;

// GET /api/team/[id]
export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(member);
}

// PATCH /api/team/[id] — update member (multipart/form-data)
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const formData = await req.formData();

    const name = (formData.get('name') as string) || existing.name;
    const role = (formData.get('role') as string) || existing.role;
    const bio = formData.has('bio') ? (formData.get('bio') as string) || null : existing.bio;
    const linkedin = formData.has('linkedin') ? (formData.get('linkedin') as string) || null : existing.linkedin;
    const twitter = formData.has('twitter') ? (formData.get('twitter') as string) || null : existing.twitter;
    const github = formData.has('github') ? (formData.get('github') as string) || null : existing.github;
    const order = formData.has('order') ? parseInt(formData.get('order') as string, 10) : existing.order;
    const published = formData.has('published') ? formData.get('published') !== 'false' : existing.published;

    let photo = existing.photo;
    let photoPublicId = existing.photoPublicId;

    const file = formData.get('photo') as File | null;
    if (file && file.size > 0) {
      if (existing.photoPublicId) {
        await cloudinary.uploader.destroy(existing.photoPublicId);
      }

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

    const updated = await prisma.teamMember.update({
      where: { id },
      data: { name, role, bio, photo, photoPublicId, linkedin, twitter, github, order, published },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PATCH /api/team/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/team/[id]
export async function DELETE(_: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (existing.photoPublicId) {
      await cloudinary.uploader.destroy(existing.photoPublicId);
    }

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/team/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}