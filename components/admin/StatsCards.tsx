"use client";

import { useEffect, useState } from "react";

interface DBService {
  id:        string;
  title:     string;
  icon:      string;
  color:     string;
}

interface Props {
  stats: {
    total:     number;
    byService: { serviceType: string; _count: number }[];
    byStatus:  { status: string; _count: number }[];
    revenue:   { _sum: { estimatedPrice: number | null }; _avg: { estimatedPrice: number | null } };
  };
}

const FALLBACK_COLORS: Record<string, string> = {
  web_app:           "#0ea5e9",
 
};

export default function StatsCards({ stats }: Props) {
  const [services,    setServices]   = useState<DBService[]>([]);
  const [loadingSvc,  setLoadingSvc] = useState(true);

  // ── Fetch your real services ───────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: DBService[]) => setServices(data))
      .catch(console.error)
      .finally(() => setLoadingSvc(false));
  }, []);

  // ── Map serviceType → DB service (using same mapServiceType logic) ─────────
  function getLabelAndColor(serviceType: string): { label: string; color: string } {
    if (!loadingSvc && services.length > 0) {
      // Find the first DB service whose title maps to this serviceType
      const match = services.find((s) => {
        const t = s.title.toLowerCase();
        if (serviceType === "mobile_app")
          return t.includes("mobile") || t.includes("app development") || t.includes("flutter");
        if (serviceType === "cloud_cyber")
          return t.includes("cloud") || t.includes("cyber") || t.includes("security") || t.includes("devops");
        if (serviceType === "digital_marketing")
          return t.includes("marketing") || t.includes("seo") || t.includes("social") || t.includes("ads");
        // web_app + ai both fall here
        return t.includes("web") || t.includes("ai") || t.includes("frontend") || t.includes("full");
      });
      if (match) return { label: match.title, color: match.color };
    }
    // Fallback while loading or no match
    const fallbackLabels: Record<string, string> = {
      web_app:           "Web App",
      mobile_app:        "Mobile App",
      cloud_cyber:       "Cloud/Cyber",
      digital_marketing: "Marketing",
    };
    return {
      label: fallbackLabels[serviceType] ?? serviceType,
      color: FALLBACK_COLORS[serviceType] ?? "#64748b",
    };
  }

  const totalRevPipeline = stats.revenue._sum.estimatedPrice ?? 0;
  const avgDeal          = stats.revenue._avg.estimatedPrice ?? 0;

  const statusMap = Object.fromEntries(stats.byStatus.map((s) => [s.status, s._count]));

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total leads */}
        <div className="rounded-xl text-black border border-slate-700/50 p-5">
          <p className=" text-xs uppercase tracking-wide">Total Leads</p>
          <p className="text-3xl font-black  mt-1">{stats.total}</p>
        </div>

       

        <div className="rounded-xl text-black border border-slate-700/50 p-5">
          <p className=" text-xs uppercase tracking-wide">Avg Deal Size</p>
          <p className="text-3xl font-black text-sky-400 mt-1">
            Rs.{avgDeal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>

      </div>

      
    </div>
  );
}

export { FALLBACK_COLORS as STATUS_COLOR };