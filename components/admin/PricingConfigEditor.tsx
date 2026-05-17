"use client";
import { useState } from "react";

interface ServiceWithConfig {
  id:            string;
  title:         string;
  shortDesc:     string;
  icon:          string;
  color:         string;
  pricingConfig: PricingConfigData | null;
}

interface PricingConfigData {
  id:          string;
  serviceType: string;
  baseRate:    number;
  unitCost:    number;
  unitMax:     number;
  unitLabel:   string;
  multipliers: Record<string, number>;
}

const DEFAULT_MULTIPLIERS: Record<string, Record<string, number>> = {
  web_app: {
    standard: 1.0, express: 1.35,
    simple: 1.0, complex: 1.55,
    hasAuth: 400, hasPayments: 600,
  },
  mobile_app: {
    standard: 1.0, express: 1.35,
    simple: 1.0, complex: 1.55,
    hasAuth: 400, hasPayments: 600,
  },
  cloud_cyber: {
    standard: 1.0, express: 1.35,
    none: 1.0, iso: 1.3, soc2: 1.45, both: 1.7,
    annual: 1.0, biannual: 1.2, quarterly: 1.45,
  },
  digital_marketing: {
    standard: 1.0, express: 1.35,
    under_1k: 1.0, "1k_5k": 1.2, "5k_20k": 1.5, "20k_plus": 2.0,
    monthly: 1.0, biweekly: 1.3, weekly: 1.65,
  },
};

function detectServiceType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("mobile") || t.includes("flutter") || t.includes("android") || t.includes("ios"))
    return "mobile_app";
  if (t.includes("cloud") || t.includes("cyber") || t.includes("security") || t.includes("devops"))
    return "cloud_cyber";
  if (t.includes("marketing") || t.includes("seo") || t.includes("social") || t.includes("ads"))
    return "digital_marketing";
  return "web_app";
}

function getDefaults(serviceType: string): Omit<PricingConfigData, "id" | "serviceType"> {
  return {
    baseRate:  serviceType === "cloud_cyber" ? 15000
             : serviceType === "digital_marketing" ? 6000
             : serviceType === "mobile_app" ? 12000
             : 10000,
    unitCost:  serviceType === "cloud_cyber" ? 400
             : serviceType === "digital_marketing" ? 150
             : 250,
    unitMax:   serviceType === "cloud_cyber" ? 10
             : serviceType === "digital_marketing" ? 8
             : 20,
    unitLabel: serviceType === "cloud_cyber" ? "servers"
             : serviceType === "digital_marketing" ? "platforms"
             : serviceType === "mobile_app" ? "screens"
             : "pages",
    multipliers: DEFAULT_MULTIPLIERS[serviceType] ?? DEFAULT_MULTIPLIERS.web_app,
  };
}

export default function PricingConfigEditor({ services }: { services: ServiceWithConfig[] }) {
  // Only first service open by default
  const [openId, setOpenId] = useState<string | null>(services[0]?.id ?? null);

  const [configs, setConfigs] = useState<Record<string, PricingConfigData>>(() => {
    const map: Record<string, PricingConfigData> = {};
    for (const svc of services) {
      const serviceType = detectServiceType(svc.title);
      map[svc.id] = svc.pricingConfig ?? {
        id: "",
        serviceType,
        ...getDefaults(serviceType),
      };
    }
    return map;
  });

  const [saving, setSaving] = useState<string | null>(null);
  const [saved,  setSaved]  = useState<string | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function updateField(serviceId: string, field: string, value: unknown) {
    setConfigs((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [field]: value },
    }));
  }

  function updateMultiplier(serviceId: string, key: string, value: string) {
    setConfigs((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        multipliers: { ...prev[serviceId].multipliers, [key]: Number(value) },
      },
    }));
  }

  async function save(serviceId: string) {
    setSaving(serviceId);
    setError(null);
    const cfg = configs[serviceId];
    const svc = services.find((s) => s.id === serviceId)!;
    const serviceType = detectServiceType(svc.title);

    try {
      const isNew = !cfg.id;
      const url   = isNew
        ? "/api/admin/pricing-config"
        : `/api/admin/pricing-config/${cfg.id}`;

      const res = await fetch(url, {
        method:  isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...cfg, serviceId, serviceType }),
      });

      if (!res.ok) throw new Error(await res.text());

      const updated: PricingConfigData = await res.json();
      setConfigs((prev) => ({
        ...prev,
        [serviceId]: { ...prev[serviceId], id: updated.id, serviceType },
      }));
      setSaved(serviceId);
      setTimeout(() => setSaved(null), 2000);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {services.map((svc) => {
        const cfg    = configs[svc.id];
        const isNew  = !cfg.id;
        const isOpen = openId === svc.id;

        return (
          <div
            key={svc.id}
            className="border border-slate-700 rounded-xl overflow-hidden transition-all"
          >
            {/* ── Accordion header — always visible, click to toggle ── */}
            <button
              onClick={() => toggle(svc.id)}
              className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-slate-800/40 transition-colors"
              style={{ background: isOpen ? `linear-gradient(135deg, ${svc.color}18 0%, transparent 60%)` : undefined }}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: svc.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{svc.title}</p>
                <p className="text-slate-400 text-xs mt-0.5 truncate">{svc.shortDesc}</p>
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="hidden sm:inline text-xs px-2 py-1 rounded-md bg-slate-700/60 border border-slate-600/40 text-slate-400 font-mono">
                  {detectServiceType(svc.title)}
                </span>
                {isNew ? (
                  <span className="text-xs px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    No pricing
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    ✓ Set
                  </span>
                )}
                {/* Chevron */}
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* ── Accordion body — only rendered when open ── */}
            {isOpen && (
              <div className="border-t border-slate-700/60 p-6 space-y-5">

                {/* Base numbers */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Base pricing</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <label className="block">
                      <span className="text-xs text-slate-400">Base Rate (Rs.)</span>
                      <input
                        type="number"
                        value={cfg.baseRate}
                        onChange={(e) => updateField(svc.id, "baseRate", Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-slate-600 px-3 py-2 text-sm bg-transparent"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-400">Unit Cost (Rs.)</span>
                      <input
                        type="number"
                        value={cfg.unitCost}
                        onChange={(e) => updateField(svc.id, "unitCost", Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-slate-600 px-3 py-2 text-sm bg-transparent"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-400">Unit label</span>
                      <input
                        type="text"
                        value={cfg.unitLabel}
                        onChange={(e) => updateField(svc.id, "unitLabel", e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-600 px-3 py-2 text-sm bg-transparent"
                        placeholder="pages / screens / servers"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-slate-400">Max units</span>
                      <input
                        type="number"
                        value={cfg.unitMax}
                        onChange={(e) => updateField(svc.id, "unitMax", Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-slate-600 px-3 py-2 text-sm bg-transparent"
                      />
                    </label>
                  </div>
                </div>

                {/* Multipliers */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Multipliers</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(cfg.multipliers).map(([key, val]) => (
                      <label key={key} className="block">
                        <span className="text-xs text-slate-500 font-mono">{key}</span>
                        <input
                          type="number"
                          step="0.01"
                          value={val}
                          onChange={(e) => updateMultiplier(svc.id, key, e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-600 px-3 py-2 text-sm bg-transparent"
                        />
                      </label>
                    ))}
                  </div>
                </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
                  <p className="text-slate-500 text-xs">
                    Auto-detected type:{" "}
                    <span className="font-mono text-slate-400">{detectServiceType(svc.title)}</span>
                  </p>
                  <button
                    onClick={() => save(svc.id)}
                    disabled={saving === svc.id}
                    className="px-5 py-2 rounded-lg bg-sky-500 text-white font-medium text-sm hover:bg-sky-400 disabled:opacity-50 transition-colors"
                  >
                    {saving === svc.id ? "Saving…"
                     : saved  === svc.id ? "✓ Saved"
                     : isNew             ? "Create pricing"
                     :                    "Save changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}