// app/api/admin/services/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, shortDesc, details, color, icon, order, published } = body;

  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(shortDesc !== undefined && { shortDesc }),
      ...(details !== undefined && { details }),
      ...(color !== undefined && { color }),
      ...(icon !== undefined && { icon }),
      ...(order !== undefined && { order }),
      ...(published !== undefined && { published }),
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}