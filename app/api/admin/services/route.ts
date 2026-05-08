// app/api/admin/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all services (admin, including unpublished)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(services);
}

// POST create new service
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, shortDesc, details, color, icon, order, published } = body;

  if (!title || !shortDesc || !details) {
    return NextResponse.json({ error: "title, shortDesc and details are required" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      title,
      shortDesc,
      details,
      color: color || "#69c8e4",
      icon: icon || "Code2",
      image: body.image,
      order: order ?? 0,
      published: published ?? true,
    },
  });

  return NextResponse.json(service, { status: 201 });
}