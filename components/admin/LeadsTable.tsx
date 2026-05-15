"use client";
// components/admin/pricing/LeadsTable.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatus, deletePricingLead } from "@/app/actions/pricing";



const SERVICE_BADGE: Record<string, string> = {
  web_app:           "bg-sky-500/10 text-sky-400",
  mobile_app:        "bg-violet-500/10 text-violet-400",
  cloud_cyber:       "bg-emerald-500/10 text-emerald-400",
  digital_marketing: "bg-amber-500/10 text-amber-400",
};

interface Lead {
  id:             string;
  name?:          string;
  email:          string;
  company?:       string;
  serviceLabel:   string;
  serviceType:    string;
  estimatedPrice: number;
  timeline:       string;
  createdAt:      Date;
}

interface Props {
  leads: Lead[];
  page:  number;
  pages: number;
}

export default function LeadsTable({ leads, page, pages }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);


  async function handleDelete(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    setBusy(id);
    await deletePricingLead(id);
    setBusy(null);
    router.refresh();
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-900/80">
              {["Contact", "Service", "Estimate", "Timeline",  "Date", "Actions"].map((h) => (
                <th key={h} className="text-left text-white text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-12">
                  No leads yet — share your pricing calculator!
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="  transition-colors">
                {/* Contact */}
                <td className="px-4 py-3">
                  <p className=" font-medium">{lead.name || "—"}</p>
                  <p className=" text-xs">{lead.email}</p>
                  {lead.company && <p className="text-slate-500 text-xs">{lead.company}</p>}
                </td>

                {/* Service */}
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium Rs.{SERVICE_BADGE[lead.serviceType] ?? ""}`}>
                    {lead.serviceLabel}
                  </span>
                </td>

                {/* Estimate */}
                <td className="px-4 py-3">
                  <span className=" font-bold tabular-nums">
                    Rs.{lead.estimatedPrice.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize text-slate-400">
                  {lead.timeline}
                </td>

                <td className="px-4 py-3 text-xs whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(lead.id)}
                    disabled={busy === lead.id}
                    className="text-slate-600 hover:text-red-400 transition-colors disabled:opacity-40"
                    title="Delete lead"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                p === page
                  ? "bg-sky-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}