"use client";
import { PricingConfig } from "@/lib/pricing-logic";
import SliderField from "./ui/SliderField";
import ToggleField from "./ui/ToggleField";
import RadioGroup  from "./ui/RadioGroup";

interface Props {
  config:       PricingConfig;
  onChange:     (partial: Partial<PricingConfig>) => void;
  onBack:       () => void;
  onNext:       () => void;
  serviceTitle?: string;
  serviceColor?: string; // ← pass DB color for accent
}

// ── Detect AI from title (same logic as PricingCalculator) ───────────────────
function isAI(title = "") {
  const t = title.toLowerCase();
  return (
    t.includes("ai")                     ||
    t.includes("artificial intelligence") ||
    t.includes("machine learning")       ||
    t.includes("ml")                     ||
    t.includes("chatbot")                ||
    t.includes("automation")             ||
    t.includes("data science")           ||
    t.includes("llm")                    ||
    t.includes("computer vision")
  );
}

export default function ConfigStep({
  config,
  onChange,
  onBack,
  onNext,
  serviceTitle,
  serviceColor = "#0ea5e9",
}: Props) {
  const s     = config.serviceType;
  const isAIProject = isAI(serviceTitle);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur p-6 md:p-8 space-y-8">

        {/* ── Service label ─────────────────────────────────────────────── */}
        {serviceTitle && (
          <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: serviceColor }}
            />
            <p className="text-slate-300 text-sm">
              Configuring:{" "}
              <span className="text-white font-semibold">{serviceTitle}</span>
            </p>
            {/* AI badge */}
            {isAIProject && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-medium">
                AI Project
              </span>
            )}
          </div>
        )}

        {/* ── Web App (non-AI) ──────────────────────────────────────────── */}
        {s === "web_app" && !isAIProject && (
          <>
            <SliderField
              label="Number of Pages"
              min={1} max={30} step={1}
              value={(config as any).pages}
              onChange={(v) => onChange({ pages: v } as any)}
              format={(v) => `${v} pages`}
              hint="Each additional page adds Rs.250 to the base."
            />
            <RadioGroup
              label="Backend Complexity"
              value={(config as any).backend}
              onChange={(v) => onChange({ backend: v } as any)}
              options={[
                {
                  value: "simple",
                  label: "Simple",
                  desc: "REST API, basic CRUD, SQLite / PlanetScale",
                },
                {
                  value: "complex",
                  label: "Complex (+55%)",
                  desc: "PostgreSQL, Redis, queues, real-time, micro-services",
                },
              ]}
            />
            <div className="space-y-3">
              <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">
                Feature Add-ons
              </p>
              <ToggleField
                label="User Authentication"
                desc="Signup, login, OAuth, sessions (+Rs.400)"
                checked={(config as any).hasAuth}
                onChange={(v) => onChange({ hasAuth: v } as any)}
              />
              <ToggleField
                label="Payment Integration"
                desc="Stripe checkout, subscriptions, invoicing (+Rs.600)"
                checked={(config as any).hasPayments}
                onChange={(v) => onChange({ hasPayments: v } as any)}
              />
            </div>
          </>
        )}

        {/* ── AI / ML Project ───────────────────────────────────────────── */}
        {s === "web_app" && isAIProject && (
          <>
            <SliderField
              label="Number of AI Modules / Features"
              min={1} max={20} step={1}
              value={(config as any).pages}
              onChange={(v) => onChange({ pages: v } as any)}
              format={(v) => `${v} module${v !== 1 ? "s" : ""}`}
              hint="Each module (e.g. chatbot, vision, analytics) adds Rs.250."
            />
            <RadioGroup
              label="AI Complexity"
              value={(config as any).backend}
              onChange={(v) => onChange({ backend: v } as any)}
              options={[
                {
                  value: "simple",
                  label: "Standard AI",
                  desc: "3rd-party APIs (OpenAI, Gemini), basic integration, prompt engineering",
                },
                {
                  value: "complex",
                  label: "Advanced AI (+55%)",
                  desc: "Custom model training, fine-tuning, RAG pipelines, vector DBs, MLOps",
                },
              ]}
            />

            {/* AI-specific info box */}
            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-4 space-y-2">
              <p className="text-violet-300 text-xs font-semibold uppercase tracking-wide">
                Included in AI projects
              </p>
              <ul className="text-slate-400 text-xs space-y-1.5">
                {[
                  "Model integration & API setup",
                  "Prompt engineering & optimization",
                  "Data pipeline architecture",
                  "Testing & evaluation framework",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-violet-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">
                Feature Add-ons
              </p>
              <ToggleField
                label="User Authentication"
                desc="Signup, login, role-based access for AI dashboard (+Rs.400)"
                checked={(config as any).hasAuth}
                onChange={(v) => onChange({ hasAuth: v } as any)}
              />
              <ToggleField
                label="Usage-based Billing"
                desc="Credit system, subscription tiers, API key management (+Rs.600)"
                checked={(config as any).hasPayments}
                onChange={(v) => onChange({ hasPayments: v } as any)}
              />
            </div>
          </>
        )}

        {/* ── Mobile App ────────────────────────────────────────────────── */}
        {s === "mobile_app" && (
          <>
            <SliderField
              label="Number of Screens"
              min={1} max={30} step={1}
              value={(config as any).pages}
              onChange={(v) => onChange({ pages: v } as any)}
              format={(v) => `${v} screen${v !== 1 ? "s" : ""}`}
              hint="Each additional screen adds Rs.250 to the base."
            />
            <RadioGroup
              label="Backend Complexity"
              value={(config as any).backend}
              onChange={(v) => onChange({ backend: v } as any)}
              options={[
                {
                  value: "simple",
                  label: "Simple",
                  desc: "REST API, basic CRUD, Firebase / Supabase",
                },
                {
                  value: "complex",
                  label: "Complex (+55%)",
                  desc: "Custom backend, real-time sync, push notifications, micro-services",
                },
              ]}
            />
            <div className="space-y-3">
              <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">
                Feature Add-ons
              </p>
              <ToggleField
                label="User Authentication"
                desc="Signup, login, OAuth, sessions (+Rs.400)"
                checked={(config as any).hasAuth}
                onChange={(v) => onChange({ hasAuth: v } as any)}
              />
              <ToggleField
                label="Payment Integration"
                desc="In-app purchases, subscriptions, Khalti/eSewa (+Rs.600)"
                checked={(config as any).hasPayments}
                onChange={(v) => onChange({ hasPayments: v } as any)}
              />
            </div>
          </>
        )}

        {/* ── Cloud / Cyber ─────────────────────────────────────────────── */}
        {s === "cloud_cyber" && (
          <>
            <SliderField
              label="Number of Servers / Services"
              min={1} max={20} step={1}
              value={(config as any).servers}
              onChange={(v) => onChange({ servers: v } as any)}
              format={(v) => `${v} server${v !== 1 ? "s" : ""}`}
              hint="Each server adds Rs.400 to the base cost."
            />
            <RadioGroup
              label="Compliance Level"
              value={(config as any).compliance}
              onChange={(v) => onChange({ compliance: v } as any)}
              options={[
                { value: "none", label: "None",               desc: "No specific compliance framework" },
                { value: "iso",  label: "ISO 27001 (+30%)",   desc: "International info-security standard" },
                { value: "soc2", label: "SOC 2 (+45%)",       desc: "US-centric, common for SaaS" },
                { value: "both", label: "ISO + SOC 2 (+70%)", desc: "Full dual-compliance framework" },
              ]}
            />
            <RadioGroup
              label="Security Audit Frequency"
              value={(config as any).auditFrequency}
              onChange={(v) => onChange({ auditFrequency: v } as any)}
              options={[
                { value: "annual",    label: "Annual",           desc: "Once per year" },
                { value: "biannual",  label: "Bi-annual (+20%)", desc: "Every 6 months" },
                { value: "quarterly", label: "Quarterly (+45%)", desc: "Every 3 months" },
              ]}
            />
          </>
        )}

        {/* ── Digital Marketing ─────────────────────────────────────────── */}
        {s === "digital_marketing" && (
          <>
            <SliderField
              label="Social Platforms"
              min={1} max={8} step={1}
              value={(config as any).platforms}
              onChange={(v) => onChange({ platforms: v } as any)}
              format={(v) => `${v} platform${v !== 1 ? "s" : ""}`}
              hint="Each platform adds Rs.150/mo management fee."
            />
            <RadioGroup
              label="Monthly Ad Spend Budget"
              value={(config as any).adSpend}
              onChange={(v) => onChange({ adSpend: v } as any)}
              options={[
                { value: "under_1k", label: "Under Rs.1K",           desc: "Starter campaigns" },
                { value: "1k_5k",    label: "Rs.1K – Rs.5K (+20%)",  desc: "Growing brands" },
                { value: "5k_20k",   label: "Rs.5K – Rs.20K (+50%)", desc: "Scaling businesses" },
                { value: "20k_plus", label: "Rs.20K+ (×2.0)",        desc: "Enterprise-level spend" },
              ]}
            />
            <RadioGroup
              label="Content Frequency"
              value={(config as any).contentFreq}
              onChange={(v) => onChange({ contentFreq: v } as any)}
              options={[
                { value: "monthly",  label: "Monthly",          desc: "4 posts / month" },
                { value: "biweekly", label: "Bi-weekly (+30%)", desc: "8 posts / month" },
                { value: "weekly",   label: "Weekly (+65%)",    desc: "16+ posts / month" },
              ]}
            />
          </>
        )}

        {/* ── Shared: Timeline ──────────────────────────────────────────── */}
        <RadioGroup
          label="Delivery Timeline"
          value={config.timeline}
          onChange={(v) => onChange({ timeline: v } as any)}
          options={[
            { value: "standard", label: "Standard",       desc: "4–8 weeks — regular sprint pace" },
            { value: "express",  label: "Express (+35%)", desc: "1–3 weeks — dedicated team, rush delivery" },
          ]}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all font-medium"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-sky-500/25"
        >
          See Full Summary →
        </button>
      </div>
    </div>
  );
}