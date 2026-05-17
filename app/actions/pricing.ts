"use server";

import { PrismaClient } from "@prisma/client";
import { calculatePriceDynamic as calculatePrice, PricingConfig, DBPricingConfig } from "@/lib/pricing-logic";
import { generateProposalPDF }           from "@/lib/generate-pdf";

const prisma = new PrismaClient();

export interface LeadFormData {
  name:    string;
  email:   string;
  company?: string;
  phone?:  string;
}

export async function submitPricingLead(
  lead:   LeadFormData,
  config: PricingConfig,
): Promise<{ success: boolean; pdfBase64?: string; error?: string }> {
  try {
    const dbConfigs: DBPricingConfig[] = await (prisma as any).pricingConfig.findMany();
    const breakdown = calculatePrice(config, dbConfigs);
    const basePayload = {
      name:           lead.name,
      email:          lead.email,
      company:        lead.company,
      phone:          lead.phone,
      serviceType:    config.serviceType,
      serviceLabel:   breakdown.label,
      timeline:       config.timeline,
      estimatedPrice: breakdown.total,
      pdfGenerated:   true,
    };

    let extra: Record<string, unknown> = {};

    if (config.serviceType === "web_app" || config.serviceType === "mobile_app") {
      extra = {
        pages:       (config as any).pages,
        hasAuth:     (config as any).hasAuth,
        hasPayments: (config as any).hasPayments,
        backendType: (config as any).backend,
      };
    } else if (config.serviceType === "cloud_cyber") {
      extra = {
        servers:         (config as any).servers,
        complianceLevel: (config as any).compliance,
        auditFrequency:  (config as any).auditFrequency,
      };
    } else if (config.serviceType === "digital_marketing") {
      extra = {
        platforms:    (config as any).platforms,
        adSpendBudget: (config as any).adSpend,
        contentFreq:  (config as any).contentFreq,
      };
    }

    await (prisma as any).pricingLead.create({
      data: { ...basePayload, ...extra },
    });

    const pdfBuffer = await generateProposalPDF(lead, config, breakdown);
    const pdfBase64 = pdfBuffer.toString("base64");

    return { success: true, pdfBase64 };
  } catch (err) {
    console.error("[submitPricingLead]", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function getPricingLeads(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [leads, total] = await Promise.all([
    (prisma as any).pricingLead.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    (prisma as any).pricingLead.count(),
  ]);
  return { leads, total, pages: Math.ceil(total / limit) };
}

export async function updateLeadStatus(id: string, status: string, notes?: string) {
  return (prisma as any).pricingLead.update({
    where: { id },
    data:  { status, ...(notes !== undefined ? { notes } : {}) },
  });
}

export async function deletePricingLead(id: string) {
  return (prisma as any).pricingLead.delete({ where: { id } });
}

export async function getPricingStats() {
  const [total, byService, byStatus, revenue] = await Promise.all([
    (prisma as any).pricingLead.count(),
    (prisma as any).pricingLead.groupBy({ by: ["serviceType"], _count: true }),
    (prisma as any).pricingLead.groupBy({ by: ["status"],      _count: true }),
    (prisma as any).pricingLead.aggregate({ _sum: { estimatedPrice: true }, _avg: { estimatedPrice: true } }),
  ]);
  return { total, byService, byStatus, revenue };
}