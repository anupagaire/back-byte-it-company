// app/api/admin/pricing-config/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient }              from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Debug: log what's coming in
    console.log("[POST pricing-config] body:", body);

    if (!body.serviceId) {
      return NextResponse.json({ error: "serviceId is required" }, { status: 400 });
    }

    const created = await prisma.pricingConfig.create({
      data: {
        serviceId:   body.serviceId,
        serviceType: body.serviceType,
        baseRate:    Number(body.baseRate),
        unitCost:    Number(body.unitCost),
        unitMax:     Number(body.unitMax),
        unitLabel:   body.unitLabel,
        multipliers: body.multipliers,
        label:       body.unitLabel, // ← your schema has a `label` field too
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error("[POST pricing-config] error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}