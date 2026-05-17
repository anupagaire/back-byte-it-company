// app/api/pricing-config/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const configs = await prisma.pricingConfig.findMany({
    where: { published: true },
  });
  return NextResponse.json(configs);
}