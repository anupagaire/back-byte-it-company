"use client";

import { useState, useEffect, useRef } from "react";
import {
  calculatePrice,
  PricingConfig,
  ServiceType,
  WebAppConfig,
  CloudConfig,
  MarketingConfig,
} from "@/lib/pricing-logic";
import ServicePicker from "./ServicePicker";
import ConfigStep    from "./ConfigStep";
import SummaryStep   from "./SummaryStep";
import StepIndicator from "./StepIndicator";

// ─── Shape returned by your API ───────────────────────────────────────────────
export interface DBService {
  id:        string;
  title:     string;
  shortDesc: string;
  icon:      string;
  color:     string;
  order:     number;
}

// ─── Map DB service titles → pricing engine ServiceType ───────────────────────
function mapServiceType(title: string): ServiceType {
  const t = title.toLowerCase();

  // Mobile / App
  if (
    t.includes("mobile")        ||
    t.includes("android")       ||
    t.includes("ios")           ||
    t.includes("flutter")       ||
    t.includes("react native")  ||
    t.includes("app development")
  ) return "mobile_app";

  // Cloud / Cyber / Security
  if (
    t.includes("cloud")          ||
    t.includes("cyber")          ||
    t.includes("security")       ||
    t.includes("devops")         ||
    t.includes("infrastructure") ||
    t.includes("aws")            ||
    t.includes("azure")          ||
    t.includes("server")         ||
    t.includes("network")
  ) return "cloud_cyber";

  // Digital Marketing
  if (
    t.includes("marketing")    ||
    t.includes("seo")          ||
    t.includes("social media") ||
    t.includes("social")       ||
    t.includes("ads")          ||
    t.includes("content")      ||
    t.includes("branding")     ||
    t.includes("campaign")
  ) return "digital_marketing";

  // AI / ML → web_app with complex backend pre-set (handled in pickService)
  if (
    t.includes("ai")                    ||
    t.includes("artificial intelligence") ||
    t.includes("machine learning")      ||
    t.includes("ml")                    ||
    t.includes("chatbot")               ||
    t.includes("automation")            ||
    t.includes("data science")          ||
    t.includes("llm")                   ||
    t.includes("computer vision")
  ) return "web_app";

  // Web / everything else (website, frontend, full-stack, ecommerce, etc.)
  return "web_app";
}

// ─── Check if service is AI-related ───────────────────────────────────────────
function isAIService(title: string): boolean {
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

// ─── Default configs per service type ────────────────────────────────────────
const DEFAULTS: Record<ServiceType, Omit<PricingConfig, "serviceType">> = {
  web_app: {
    pages: 5, backend: "simple", hasAuth: false, hasPayments: false, timeline: "standard",
  } as Omit<WebAppConfig, "serviceType">,
  mobile_app: {
    pages: 5, backend: "simple", hasAuth: false, hasPayments: false, timeline: "standard",
  } as Omit<WebAppConfig, "serviceType">,
  cloud_cyber: {
    servers: 3, compliance: "none", auditFrequency: "annual", timeline: "standard",
  } as Omit<CloudConfig, "serviceType">,
  digital_marketing: {
    platforms: 2, adSpend: "under_1k", contentFreq: "monthly", timeline: "standard",
  } as Omit<MarketingConfig, "serviceType">,
};

const AI_DEFAULT: Omit<WebAppConfig, "serviceType"> = {
  pages:       5,
  backend:     "complex",
  hasAuth:     true,
  hasPayments: false,
  timeline:    "standard",
};

export default function PricingCalculator() {
  const [step,            setStep]           = useState<1 | 2 | 3>(1);
  const [services,        setServices]       = useState<DBService[]>([]);
  const [loading,         setLoading]        = useState(true);
  const [selectedService, setSelectedService] = useState<DBService | null>(null);
  const [config,          setConfig]         = useState<PricingConfig>({
    serviceType: "web_app",
    ...DEFAULTS.web_app,
  } as PricingConfig);

  // Animated price counter
  const [displayPrice, setDisplayPrice] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const breakdown = calculatePrice(config);

  // ── Fetch services from API on mount ──────────────────────────────────────
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: DBService[]) => setServices(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Animated price counter ────────────────────────────────────────────────
  useEffect(() => {
    const target = breakdown.total;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const start     = displayPrice;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / 600, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplayPrice(Math.round(start + (target - start) * eased));
      if (progress < 1) animFrameRef.current = requestAnimationFrame(tick);
    }
    animFrameRef.current = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakdown.total]);

  // ── Pick a service card → go to step 2 ───────────────────────────────────
  function pickService(dbService: DBService) {
    const serviceType = mapServiceType(dbService.title);
    const defaults    = isAIService(dbService.title) ? AI_DEFAULT : DEFAULTS[serviceType];

    setSelectedService(dbService);
    setConfig({ serviceType, ...defaults } as PricingConfig);
    setStep(2);
  }

  function handleConfigChange(partial: Partial<PricingConfig>) {
    setConfig((prev) => ({ ...prev, ...partial } as PricingConfig));
  }

  // ── Go back to step 1: clear selected service ─────────────────────────────
  function handleBackToServices() {
    setSelectedService(null);
    setStep(1);
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Page title */}
      <div className="text-center mb-12 py-12">
        <p className="text-sky-400 text-sm font-semibold tracking-[0.25em] uppercase mb-3">
          Instant Estimate
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
          How much will your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            project cost?
          </span>
        </h1>
        <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
          Configure your requirements below and get a ballpark estimate in seconds —
          no phone calls required.
        </p>
      </div>

      <StepIndicator current={step} />

      {step >= 2 && (
        <div className="my-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/20 to-cyan-500/20 blur-xl" />
            <div className="relative border border-sky-500/30 bg-slate-900/80 backdrop-blur rounded-2xl px-10 py-5 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">
                Estimated Total
              </p>
              <p className="text-5xl font-black text-white tabular-nums">
                Rs.{displayPrice.toLocaleString()}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {config.timeline === "express" ? "Express (+35%)" : "Standard timeline"}
              </p>
              {selectedService && (
                <p className="text-slate-600 text-xs mt-1">
                  {selectedService.title}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="mt-4">

        {step === 1 && (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-slate-800/60 animate-pulse border border-slate-700/40"
                />
              ))}
            </div>
          ) : (
            <ServicePicker services={services} onSelect={pickService} />
          )
        )}

        {/* Step 2 — Configuration */}
        {step === 2 && (
          <ConfigStep
            config={config}
            onChange={handleConfigChange}
            onBack={handleBackToServices}
            onNext={() => setStep(3)}
            serviceTitle={selectedService?.title}
            serviceColor={selectedService?.color} 
          />
        )}

        {/* Step 3 — Summary + lead capture */}
        {step === 3 && (
          <SummaryStep
            config={config}
            breakdown={breakdown}
            onBack={() => setStep(2)}
          />
        )}

      </div>
    </div>
  );
}