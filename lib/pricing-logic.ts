// lib/pricing-logic.ts

export type ServiceType = "web_app" | "mobile_app" | "cloud_cyber" | "digital_marketing";
export type Timeline    = "standard" | "express";
export type Backend     = "simple" | "complex";
export type Compliance  = "none" | "iso" | "soc2" | "both";
export type AuditFreq   = "quarterly" | "biannual" | "annual";
export type AdSpend     = "under_1k" | "1k_5k" | "5k_20k" | "20k_plus";
export type ContentFreq = "weekly" | "biweekly" | "monthly";

export const BASE_RATES: Record<ServiceType, number> = {
  web_app:           10000,
  mobile_app:       1_2000,
  cloud_cyber:      1_5000,
  digital_marketing:  600,
};

// ─── Per-unit costs (exported) ────────────────────────────────────────────────
export const UNIT_COST: Record<string, number> = {
  web_app:           250,
  mobile_app:        250,
  cloud_cyber:       400,
  digital_marketing: 150,
};

const PER_PAGE_COST   = 250;
const PER_SERVER_COST = 400;

// ─── Multipliers ──────────────────────────────────────────────────────────────
const MULTIPLIERS = {
  standard:   1.0,
  express:    1.35,
  simple:     1.0,
  complex:    1.55,
  none:       1.0,
  iso:        1.3,
  soc2:       1.45,
  both:       1.7,
  annual:     1.0,
  biannual:   1.2,
  quarterly:  1.45,
  under_1k:   1.0,
  "1k_5k":    1.2,
  "5k_20k":   1.5,
  "20k_plus": 2.0,
  monthly:    1.0,
  biweekly:   1.3,
  weekly:     1.65,
  hasAuth:     400,
  hasPayments: 600,
} as const;

// ─── Input shapes ─────────────────────────────────────────────────────────────
export interface WebAppConfig {
  serviceType: "web_app" | "mobile_app";
  pages:       number;
  backend:     Backend;
  hasAuth:     boolean;
  hasPayments: boolean;
  timeline:    Timeline;
}

export interface CloudConfig {
  serviceType:    "cloud_cyber";
  servers:        number;
  compliance:     Compliance;
  auditFrequency: AuditFreq;
  timeline:       Timeline;
}

export interface MarketingConfig {
  serviceType: "digital_marketing";
  platforms:   number;
  adSpend:     AdSpend;
  contentFreq: ContentFreq;
  timeline:    Timeline;
}

export type PricingConfig = WebAppConfig | CloudConfig | MarketingConfig;

// ─── Output shape ─────────────────────────────────────────────────────────────
export interface PricingBreakdown {
  base:       number;
  units:      number;
  features:   number;
  subtotal:   number;
  multiplier: number;
  total:      number;
  label:      string;
  techStack:  string[];
}

// ─── Calculator ───────────────────────────────────────────────────────────────
export function calculatePrice(config: PricingConfig): PricingBreakdown {
  const base = BASE_RATES[config.serviceType];

  if (config.serviceType === "web_app" || config.serviceType === "mobile_app") {
    const c          = config as WebAppConfig;
    const units      = c.pages * PER_PAGE_COST;
    const features   = (c.hasAuth ? MULTIPLIERS.hasAuth : 0)
                     + (c.hasPayments ? MULTIPLIERS.hasPayments : 0);
    const subtotal   = base + units + features;
    const multiplier = MULTIPLIERS[c.backend] * MULTIPLIERS[c.timeline];
    const total      = Math.round(subtotal * multiplier);
    return {
      base, units, features, subtotal, multiplier, total,
      label:     config.serviceType === "web_app" ? "Web Application" : "Mobile Application",
      techStack: buildWebStack(c),
    };
  }

  if (config.serviceType === "cloud_cyber") {
    const c          = config as CloudConfig;
    const units      = c.servers * PER_SERVER_COST;
    const subtotal   = base + units;
    const multiplier = MULTIPLIERS[c.compliance] * MULTIPLIERS[c.auditFrequency] * MULTIPLIERS[c.timeline];
    const total      = Math.round(subtotal * multiplier);
    return {
      base, units, features: 0, subtotal, multiplier, total,
      label:     "Cloud & Cybersecurity",
      techStack: buildCloudStack(c),
    };
  }

  // digital_marketing
  const c          = config as MarketingConfig;
  const units      = c.platforms * 150;
  const subtotal   = base + units;
  const multiplier = MULTIPLIERS[c.adSpend] * MULTIPLIERS[c.contentFreq] * MULTIPLIERS[c.timeline];
  const total      = Math.round(subtotal * multiplier);
  return {
    base, units, features: 0, subtotal, multiplier, total,
    label:     "Digital Marketing",
    techStack: buildMarketingStack(c),
  };
}

// ─── Tech-stack helpers ───────────────────────────────────────────────────────
function buildWebStack(c: WebAppConfig): string[] {
  const stack = ["Next.js 14", "TypeScript", "Tailwind CSS"];
  if (c.backend === "complex") stack.push("PostgreSQL", "Redis", "tRPC");
  else                         stack.push("SQLite / PlanetScale");
  if (c.hasAuth)               stack.push("NextAuth.js");
  if (c.hasPayments)           stack.push("Stripe");
  if (c.timeline === "express") stack.push("Vercel Edge");
  return stack;
}

function buildCloudStack(c: CloudConfig): string[] {
  const stack = ["AWS / GCP", "Terraform", "Docker"];
  if (c.compliance !== "none")                            stack.push("Compliance Automation", "Audit Logging");
  if (c.compliance === "soc2" || c.compliance === "both") stack.push("Vanta / Drata");
  if (c.auditFrequency === "quarterly")                   stack.push("SIEM Integration");
  if (c.timeline === "express")                           stack.push("Dedicated DevOps Engineer");
  return stack;
}

function buildMarketingStack(c: MarketingConfig): string[] {
  const stack = ["Meta Ads Manager", "Google Ads"];
  if (c.platforms >= 3)                                       stack.push("LinkedIn Ads", "TikTok Ads");
  if (c.adSpend === "5k_20k" || c.adSpend === "20k_plus")    stack.push("A/B Testing Suite", "Hotjar");
  stack.push("HubSpot CRM", "Google Analytics 4");
  if (c.contentFreq === "weekly")                             stack.push("Dedicated Content Team");
  return stack;
}

// ─── Label helpers ────────────────────────────────────────────────────────────
export const SERVICE_LABELS: Record<ServiceType, string> = {
  web_app:           "Web Application",
  mobile_app:        "Mobile Application",
  cloud_cyber:       "Cloud & Cybersecurity",
  digital_marketing: "Digital Marketing",
};

export const TIMELINE_LABELS: Record<Timeline, string> = {
  standard: "Standard (4–8 wks)",
  express:  "Express (1–3 wks) +35%",
};