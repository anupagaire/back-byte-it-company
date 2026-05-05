// app/api/admin/update-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Check if email is taken by another admin
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing && existing.email !== session.user.email) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const updated = await prisma.adminUser.update({
    where: { email: session.user.email },
    data: { name: name || null, email },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ user: updated });
}