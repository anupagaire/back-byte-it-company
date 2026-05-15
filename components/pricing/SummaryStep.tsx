"use client";
// components/pricing/SummaryStep.tsx

import { useState } from "react";
import { PricingConfig, PricingBreakdown } from "@/lib/pricing-logic";
import { submitPricingLead }               from "@/app/actions/pricing";

interface Props {
  config:    PricingConfig;
  breakdown: PricingBreakdown;
  onBack:    () => void;
}

export default function SummaryStep({ config, breakdown, onBack }: Props) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [company, setCompany] = useState("");
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await submitPricingLead({ name, email, company, phone }, config);
    setLoading(false);

    if (!res.success) {
      setError(res.error ?? "Submission failed.");
      return;
    }

    // Auto-download PDF
    if (res.pdfBase64) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${res.pdfBase64}`;
      link.download = `Proposal_${name.replace(/\s+/, "_")}.pdf`;
      link.click();
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">Your proposal is downloading!</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          We've saved your estimate. A member of our team may reach out to discuss your
          project — or feel free to book a call below.
        </p>
        <a
          href="https://calendly.com/yourcompany"   // ← replace with your Calendly
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book a 15-min Call to Discuss This Rs.{breakdown.total.toLocaleString()} Quote
        </a>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* ── Left: breakdown ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-white font-bold text-lg">{breakdown.label}</h3>

          <div className="space-y-2 text-sm">
            {[
              ["Base package", breakdown.base],
              ["Units / add-ons", breakdown.units],
              ...(breakdown.features > 0 ? [["Feature add-ons", breakdown.features] as [string, number]] : []),
            ].map(([label, val]) => (
              <div key={label as string} className="flex justify-between text-slate-400">
                <span>{label}</span>
                <span className="text-slate-300">Rs.{(val as number).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-slate-700/60 pt-2 flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span>Rs.{breakdown.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-xs">
              <span>
                Complexity &amp; timeline
                ({Math.round((breakdown.multiplier - 1) * 100)}% adjustment)
              </span>
            </div>
            <div className="border-t border-slate-700/60 pt-2 flex justify-between font-bold text-white text-base">
              <span>Total Estimate</span>
              <span className="text-sky-400">Rs.{breakdown.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6">
          <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide mb-3">
            We'll use
          </p>
          <div className="flex flex-wrap gap-2">
            {breakdown.techStack.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Standard vs Express compare */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 text-sm">
          <p className="text-slate-400 font-semibold mb-3">Timeline comparison</p>
          <div className="grid grid-cols-2 gap-3">
            {["standard", "express"].map((tl) => {
              const active = config.timeline === tl;
              const altTotal = Math.round(
                breakdown.subtotal * (breakdown.multiplier / (config.timeline === "express" ? 1.35 : 1)) *
                (tl === "express" ? 1.35 : 1)
              );
              return (
                <div
                  key={tl}
                  className={`rounded-xl p-3 border ${active ? "border-sky-500/50 bg-sky-500/10" : "border-slate-700/50 bg-slate-800/40"}`}
                >
                  <p className={`font-semibold capitalize ${active ? "text-sky-300" : "text-slate-400"}`}>
                    {tl} {active && "✓"}
                  </p>
                  <p className={`text-lg font-black ${active ? "text-white" : "text-slate-500"}`}>
                    Rs.{altTotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">{tl === "express" ? "1–3 wks" : "4–8 wks"}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right: lead capture ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 space-y-5">
        <div>
          <h3 className="text-white font-bold text-lg">Get your detailed proposal</h3>
          <p className="text-slate-400 text-sm mt-1">
            Enter your details to download a PDF proposal instantly.
          </p>
        </div>

        <div className="space-y-3">
          {[
            { label: "Full Name *",    value: name,    set: setName,    type: "text",  placeholder: "Jane Smith" },
            { label: "Email *",        value: email,   set: setEmail,   type: "email", placeholder: "jane@company.com" },
            { label: "Company",        value: company, set: setCompany, type: "text",  placeholder: "Acme Inc." },
            { label: "Phone",          value: phone,   set: setPhone,   type: "tel",   placeholder: "+1 555 000 0000" },
          ].map(({ label, value, set, type, placeholder }) => (
            <div key={label}>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Generating PDF…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Proposal
            </>
          )}
        </button>

        <p className="text-slate-600 text-xs text-center">
          No spam. Your details are used only to prepare your proposal.
        </p>

        <button
          onClick={onBack}
          className="w-full py-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          ← Adjust configuration
        </button>
      </div>
    </div>
  );
}