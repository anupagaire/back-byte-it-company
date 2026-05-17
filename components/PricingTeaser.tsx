"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BASE_RATES, UNIT_COST } from "@/lib/pricing-logic";
import { ServiceType } from "@/lib/pricing-logic";
interface DBService {
  id:        string;
  title:     string;
  shortDesc: string;
  icon:      string;
  color:     string;
  order:     number;
}

interface TeaserService {
  key:       string;
  label:     string;
  base:      number;
  unit:      number;
  unitLabel: string;
  max:       number;
  color:     string;
}

const UNIT_LABELS: Record<string, string> = {
  web_app:           "pages",
  mobile_app:        "screens",
  cloud_cyber:       "servers",
  digital_marketing: "platforms",
};

const UNIT_MAX: Record<string, number> = {
  web_app:           20,
  mobile_app:        20,
  cloud_cyber:       10,
  digital_marketing: 8,
};

function mapServiceType(title: string): ServiceType {
  const t = title.toLowerCase();
  if (t.includes("mobile") || t.includes("flutter") || t.includes("android") || t.includes("ios"))
    return "mobile_app";
  if (t.includes("cloud") || t.includes("cyber") || t.includes("security") || t.includes("devops"))
    return "cloud_cyber";
  if (t.includes("marketing") || t.includes("seo") || t.includes("social") || t.includes("ads"))
    return "digital_marketing";
  return "web_app";
}

function dbToTeaser(db: DBService): TeaserService {
  const type = mapServiceType(db.title);
  return {
    key:       db.id,
    label:     db.title,
    base:      BASE_RATES[type]  ?? 800,
    unit:      UNIT_COST[type]   ?? 250,
    unitLabel: UNIT_LABELS[type] ?? "pages",
    max:       UNIT_MAX[type]    ?? 20,
    color:     db.color,
  };
}

function ServiceSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 rounded-xl bg-slate-300/20 animate-pulse border border-slate-700/20" />
      ))}
    </div>
  );
}

export default function PricingTeaser() {
  const [services, setServices] = useState<TeaserService[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [active,   setActive]   = useState<string>("");
  const [units,    setUnits]    = useState(5);
  const [express,  setExpress]  = useState(false);
  const [display,  setDisplay]  = useState(0);
  const rafRef     = useRef<number | null>(null);
  const displayRef = useRef(0);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: DBService[]) => {
        const mapped = data.map(dbToTeaser);
        setServices(mapped);
        if (mapped.length > 0) {
          setActive(mapped[0].key);
          const initial = calcTotal(mapped[0], 5, false);
          setDisplay(initial);
          displayRef.current = initial;
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const svc = services.find((s) => s.key === active) ?? services[0];

  function calcTotal(s: TeaserService, u: number, exp: boolean) {
    return Math.round((s.base + u * s.unit) * (exp ? 1.35 : 1));
  }

  function animateTo(target: number) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = displayRef.current;
    const t0    = performance.now();
    function tick(now: number) {
      const p   = Math.min((now - t0) / 500, 1);
      const e   = 1 - Math.pow(1 - p, 3);
      const val = Math.round(start + (target - start) * e);
      displayRef.current = val;
      setDisplay(val);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function pickService(key: string) {
    const s       = services.find((x) => x.key === key)!;
    const clamped = Math.min(units, s.max);
    setActive(key);
    setUnits(clamped);
    animateTo(calcTotal(s, clamped, express));
  }

  function handleUnits(v: number) {
    setUnits(v);
    if (svc) animateTo(calcTotal(svc, v, express));
  }

  function handleTimeline(exp: boolean) {
    setExpress(exp);
    if (svc) animateTo(calcTotal(svc, units, exp));
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-slate-700/50 backdrop-blur p-8">

          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-[#1a2744] mb-4">
              Instant estimate
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]">
                Real Results
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Wondering what your project will cost? Slide a few controls and get a
              ballpark in seconds — no calls, no forms.
            </p>
          </div>

          {loading ? (
            <ServiceSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {services.map((s) => (
                <button
                  key={s.key}
                  onClick={() => pickService(s.key)}
                  className={`rounded-xl p-3 text-left border transition-all ${
                    active === s.key
                      ? "border-slate-400/60 bg-blue-300"
                      : "border-slate-700/40 bg-slate-300/30"
                  }`}
                >
                  <span
                    className="block w-2 h-2 rounded-full mb-2"
                    style={{ backgroundColor: s.color }}
                  />
                  <p className="text-lg font-semibold">{s.label}</p>
                  <p className="text-slate-500 text-xs">
                    from Rs.{s.base.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}

          {svc && (
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-5 mb-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className=" text-xs w-20  capitalize">
                  {svc.unitLabel}
                </span>
                <input
                  type="range"
                  min={1} max={svc.max} step={1}
                  value={units}
                  onChange={(e) => handleUnits(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs font-semibold w-20 text-right">
                  {units} {svc.unitLabel}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs w-20 ">Timeline</span>
                <input
                  type="range"
                  min={0} max={1} step={1}
                  value={express ? 1 : 0}
                  onChange={(e) => handleTimeline(e.target.value === "1")}
                  className="flex-1 accent-sky-500"
                />
                <span className="text-xs font-semibold w-20 text-right">
                  {express ? "Express +35%" : "Standard"}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-3 border-t border-slate-700/50">
                <div>
                  <span className="text-sm">Rough estimate</span>
                  <p className=" text-xs mt-0.5">
                    Based on {units} {svc.unitLabel} · {express ? "express" : "standard"} timeline
                  </p>
                </div>
                <span className="text-3xl font-black tabular-nums">
                  Rs.{display.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="flex-1 text-center py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Get full breakdown →
            </Link>
            <Link
              href="/#contact"
              className="px-5 py-3 rounded-xl border border-slate-700 text-sm font-medium hover:border-slate-500 transition-all"
            >
              Book a call
            </Link>
          </div>
          <p className="text-slate-600 text-xs text-center mt-3">Takes ~60 seconds</p>
        </div>
      </div>
    </section>
  );
}