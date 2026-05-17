// components/pricing/ConfigStep.tsx
import { PricingConfig, DBPricingConfig } from "@/lib/pricing-logic";
import SliderField from "./ui/SliderField";
import ToggleField from "./ui/ToggleField";
import RadioGroup  from "./ui/RadioGroup";
interface Props {
  config:        PricingConfig;
  onChange:      (partial: Partial<PricingConfig>) => void;
  onBack:        () => void;
  onNext:        () => void;
  serviceTitle?: string;
  serviceColor?: string;
  dbConfig?:     DBPricingConfig | null;  // ← add this
}
function isAI(title = "") {
  const t = title.toLowerCase();
  return (
    t.includes("ai")                      ||
    t.includes("artificial intelligence") ||
    t.includes("machine learning")        ||
    t.includes("ml")                      ||
    t.includes("chatbot")                 ||
    t.includes("automation")              ||
    t.includes("data science")            ||
    t.includes("llm")                     ||
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
  dbConfig,                               // ← add this
}: Props) {
  const s = config.serviceType;
  const isAIProject = isAI(serviceTitle);

  // Pull dynamic values from DB config, fall back to static defaults
  const unitCost    = dbConfig?.unitCost    ?? 250;
  const unitLabel   = dbConfig?.unitLabel   ?? "pages";
  const unitMax     = dbConfig?.unitMax     ?? 30;
  const M           = dbConfig?.multipliers ?? {};

  const complexPct  = M.complex     ? `+${Math.round((M.complex - 1) * 100)}%`     : "+55%";
  const expressPct  = M.express     ? `+${Math.round((M.express - 1) * 100)}%`     : "+35%";
  const authCost    = M.hasAuth     ? `Rs.${M.hasAuth}`                             : "Rs.400";
  const paymentCost = M.hasPayments ? `Rs.${M.hasPayments}`                         : "Rs.600";

  // Cloud multiplier labels
  const isoPct      = M.iso       ? `+${Math.round((M.iso - 1) * 100)}%`       : "+30%";
  const soc2Pct     = M.soc2      ? `+${Math.round((M.soc2 - 1) * 100)}%`      : "+45%";
  const bothPct     = M.both      ? `+${Math.round((M.both - 1) * 100)}%`      : "+70%";
  const biannualPct = M.biannual  ? `+${Math.round((M.biannual - 1) * 100)}%`  : "+20%";
  const quarterlyPct= M.quarterly ? `+${Math.round((M.quarterly - 1) * 100)}%` : "+45%";

  // Marketing multiplier labels
  const spend1k5kPct  = M["1k_5k"]   ? `+${Math.round((M["1k_5k"] - 1) * 100)}%`   : "+20%";
  const spend5k20kPct = M["5k_20k"]  ? `+${Math.round((M["5k_20k"] - 1) * 100)}%`  : "+50%";
  const spend20kMult  = M["20k_plus"]? `×${M["20k_plus"]}`                           : "×2.0";
  const biweeklyPct   = M.biweekly   ? `+${Math.round((M.biweekly - 1) * 100)}%`   : "+30%";
  const weeklyPct     = M.weekly     ? `+${Math.round((M.weekly - 1) * 100)}%`      : "+65%";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur p-6 md:p-8 space-y-8">

        {/* Service label */}
        {serviceTitle && (
          <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: serviceColor }} />
            <p className="text-slate-300 text-sm">
              Configuring: <span className="text-white font-semibold">{serviceTitle}</span>
            </p>
            {isAIProject && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-medium">
                AI Project
              </span>
            )}
          </div>
        )}

        {/* Web App (non-AI) */}
        {s === "web_app" && !isAIProject && (
          <>
            <SliderField
              label={`Number of ${unitLabel}`}
              min={1} max={unitMax} step={1}
              value={(config as any).pages}
              onChange={(v) => onChange({ pages: v } as any)}
              format={(v) => `${v} ${unitLabel}`}
              hint={`Each additional ${unitLabel.slice(0, -1)} adds Rs.${unitCost} to the base.`}
            />
            <RadioGroup
              label="Backend Complexity"
              value={(config as any).backend}
              onChange={(v) => onChange({ backend: v } as any)}
              options={[
                { value: "simple", label: "Simple",                   desc: "REST API, basic CRUD, SQLite / PlanetScale" },
                { value: "complex", label: `Complex (${complexPct})`, desc: "PostgreSQL, Redis, queues, real-time, micro-services" },
              ]}
            />
            <div className="space-y-3">
              <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Feature Add-ons</p>
              <ToggleField
                label="User Authentication"
                desc={`Signup, login, OAuth, sessions (+${authCost})`}
                checked={(config as any).hasAuth}
                onChange={(v) => onChange({ hasAuth: v } as any)}
              />
              <ToggleField
                label="Payment Integration"
                desc={`Stripe checkout, subscriptions, invoicing (+${paymentCost})`}
                checked={(config as any).hasPayments}
                onChange={(v) => onChange({ hasPayments: v } as any)}
              />
            </div>
          </>
        )}

        {/* AI / ML Project */}
        {s === "web_app" && isAIProject && (
          <>
            <SliderField
              label="Number of AI Modules / Features"
              min={1} max={unitMax} step={1}
              value={(config as any).pages}
              onChange={(v) => onChange({ pages: v } as any)}
              format={(v) => `${v} module${v !== 1 ? "s" : ""}`}
              hint={`Each module adds Rs.${unitCost}.`}
            />
            <RadioGroup
              label="AI Complexity"
              value={(config as any).backend}
              onChange={(v) => onChange({ backend: v } as any)}
              options={[
                { value: "simple",  label: "Standard AI",              desc: "3rd-party APIs (OpenAI, Gemini), basic integration" },
                { value: "complex", label: `Advanced AI (${complexPct})`, desc: "Custom model training, fine-tuning, RAG pipelines, vector DBs" },
              ]}
            />
            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-4 space-y-2">
              <p className="text-violet-300 text-xs font-semibold uppercase tracking-wide">Included in AI projects</p>
              <ul className="text-slate-400 text-xs space-y-1.5">
                {["Model integration & API setup", "Prompt engineering & optimization", "Data pipeline architecture", "Testing & evaluation framework"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-violet-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Feature Add-ons</p>
              <ToggleField
                label="User Authentication"
                desc={`Signup, login, role-based access (+${authCost})`}
                checked={(config as any).hasAuth}
                onChange={(v) => onChange({ hasAuth: v } as any)}
              />
              <ToggleField
                label="Usage-based Billing"
                desc={`Credit system, subscription tiers, API key management (+${paymentCost})`}
                checked={(config as any).hasPayments}
                onChange={(v) => onChange({ hasPayments: v } as any)}
              />
            </div>
          </>
        )}

        {/* Mobile App */}
        {s === "mobile_app" && (
          <>
            <SliderField
              label={`Number of ${unitLabel}`}
              min={1} max={unitMax} step={1}
              value={(config as any).pages}
              onChange={(v) => onChange({ pages: v } as any)}
              format={(v) => `${v} ${unitLabel}`}
              hint={`Each additional screen adds Rs.${unitCost} to the base.`}
            />
            <RadioGroup
              label="Backend Complexity"
              value={(config as any).backend}
              onChange={(v) => onChange({ backend: v } as any)}
              options={[
                { value: "simple",  label: "Simple",                   desc: "REST API, basic CRUD, Firebase / Supabase" },
                { value: "complex", label: `Complex (${complexPct})`,  desc: "Custom backend, real-time sync, push notifications" },
              ]}
            />
            <div className="space-y-3">
              <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Feature Add-ons</p>
              <ToggleField
                label="User Authentication"
                desc={`Signup, login, OAuth, sessions (+${authCost})`}
                checked={(config as any).hasAuth}
                onChange={(v) => onChange({ hasAuth: v } as any)}
              />
              <ToggleField
                label="Payment Integration"
                desc={`In-app purchases, subscriptions, Khalti/eSewa (+${paymentCost})`}
                checked={(config as any).hasPayments}
                onChange={(v) => onChange({ hasPayments: v } as any)}
              />
            </div>
          </>
        )}

        {/* Cloud / Cyber */}
        {s === "cloud_cyber" && (
          <>
            <SliderField
              label="Number of Servers / Services"
              min={1} max={unitMax} step={1}
              value={(config as any).servers}
              onChange={(v) => onChange({ servers: v } as any)}
              format={(v) => `${v} server${v !== 1 ? "s" : ""}`}
              hint={`Each server adds Rs.${unitCost} to the base cost.`}
            />
            <RadioGroup
              label="Compliance Level"
              value={(config as any).compliance}
              onChange={(v) => onChange({ compliance: v } as any)}
              options={[
                { value: "none", label: "None",                      desc: "No specific compliance framework" },
                { value: "iso",  label: `ISO 27001 (${isoPct})`,     desc: "International info-security standard" },
                { value: "soc2", label: `SOC 2 (${soc2Pct})`,       desc: "US-centric, common for SaaS" },
                { value: "both", label: `ISO + SOC 2 (${bothPct})`,  desc: "Full dual-compliance framework" },
              ]}
            />
            <RadioGroup
              label="Security Audit Frequency"
              value={(config as any).auditFrequency}
              onChange={(v) => onChange({ auditFrequency: v } as any)}
              options={[
                { value: "annual",    label: "Annual",                        desc: "Once per year" },
                { value: "biannual",  label: `Bi-annual (${biannualPct})`,    desc: "Every 6 months" },
                { value: "quarterly", label: `Quarterly (${quarterlyPct})`,   desc: "Every 3 months" },
              ]}
            />
          </>
        )}

        {/* Digital Marketing */}
        {s === "digital_marketing" && (
          <>
            <SliderField
              label="Social Platforms"
              min={1} max={unitMax} step={1}
              value={(config as any).platforms}
              onChange={(v) => onChange({ platforms: v } as any)}
              format={(v) => `${v} platform${v !== 1 ? "s" : ""}`}
              hint={`Each platform adds Rs.${unitCost}/mo management fee.`}
            />
            <RadioGroup
              label="Monthly Ad Spend Budget"
              value={(config as any).adSpend}
              onChange={(v) => onChange({ adSpend: v } as any)}
              options={[
                { value: "under_1k", label: "Under Rs.1K",                  desc: "Starter campaigns" },
                { value: "1k_5k",    label: `Rs.1K – Rs.5K (${spend1k5kPct})`,  desc: "Growing brands" },
                { value: "5k_20k",   label: `Rs.5K – Rs.20K (${spend5k20kPct})`, desc: "Scaling businesses" },
                { value: "20k_plus", label: `Rs.20K+ (${spend20kMult})`,    desc: "Enterprise-level spend" },
              ]}
            />
            <RadioGroup
              label="Content Frequency"
              value={(config as any).contentFreq}
              onChange={(v) => onChange({ contentFreq: v } as any)}
              options={[
                { value: "monthly",  label: "Monthly",                    desc: "4 posts / month" },
                { value: "biweekly", label: `Bi-weekly (${biweeklyPct})`, desc: "8 posts / month" },
                { value: "weekly",   label: `Weekly (${weeklyPct})`,      desc: "16+ posts / month" },
              ]}
            />
          </>
        )}

        {/* Shared: Timeline */}
        <RadioGroup
          label="Delivery Timeline"
          value={config.timeline}
          onChange={(v) => onChange({ timeline: v } as any)}
          options={[
            { value: "standard", label: "Standard",              desc: "4–8 weeks — regular sprint pace" },
            { value: "express",  label: `Express (${expressPct})`, desc: "1–3 weeks — dedicated team, rush delivery" },
          ]}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all font-medium">
          ← Back
        </button>
        <button onClick={onNext} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-sky-500/25">
          See Full Summary →
        </button>
      </div>
    </div>
  );
}