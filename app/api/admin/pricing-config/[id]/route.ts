import { NextRequest, NextResponse } from "next/server";
import { PrismaClient }              from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }  // ← params is a Promise in Next.js 15
) {
  try {
    const { id } = await context.params;         // ← await it
    const body   = await req.json();

    console.log("[PATCH pricing-config] id:", id, "body:", body);

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updated = await prisma.pricingConfig.update({
      where: { id },
      data:  {
        serviceType: body.serviceType,
        baseRate:    Number(body.baseRate),
        unitCost:    Number(body.unitCost),
        unitMax:     Number(body.unitMax),
        unitLabel:   body.unitLabel,
        label:       body.unitLabel,
        multipliers: body.multipliers,
        updatedAt:   new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH pricing-config] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}