import { jsPDF } from "jspdf";
import { PricingBreakdown, PricingConfig, SERVICE_LABELS } from "./pricing-logic";

interface LeadInfo {
  name:    string;
  email:   string;
  company?: string;
  phone?:  string;
}

export async function generateProposalPDF(
  lead:      LeadInfo,
  config:    PricingConfig,
  breakdown: PricingBreakdown,
): Promise<Buffer> {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

  const W    = doc.internal.pageSize.getWidth();
  const BLUE = "#0ea5e9";
  const DARK = "#0f172a";
  const GRAY = "#64748b";
  const LGRAY = "#f1f5f9";

  let y = 0;

  // ─── Header bar ────────────────────────────────────────────────────────────
  doc.setFillColor(DARK);
  doc.rect(0, 0, W, 90, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#ffffff");
  doc.text("PROJECT PRICING PROPOSAL", 40, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#94a3b8");
  doc.text(`Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 40, 62);
  doc.text("CONFIDENTIAL", W - 40, 62, { align: "right" });

  y = 115;

  // ─── Client block ───────────────────────────────────────────────────────────
  doc.setFillColor(LGRAY);
  doc.roundedRect(40, y, W - 80, 80, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(DARK);
  doc.text("PREPARED FOR", 60, y + 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(DARK);
  doc.text(lead.name || "Valued Client", 60, y + 44);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(GRAY);
  const clientDetails = [lead.email, lead.company, lead.phone].filter(Boolean).join("  ·  ");
  doc.text(clientDetails, 60, y + 62);

  y += 106;

  // ─── Service heading ────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(BLUE);
  doc.text(breakdown.label.toUpperCase(), 40, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(GRAY);
  doc.text(
    config.timeline === "express"
      ? "Express delivery timeline (1–3 weeks)"
      : "Standard delivery timeline (4–8 weeks)",
    40, y + 18,
  );

  y += 44;

  // ─── Price breakdown ────────────────────────────────────────────────────────
  const rows: [string, string][] = [
    ["Base package",  `$${breakdown.base.toLocaleString()}`],
    ["Add-ons / units", `$${breakdown.units.toLocaleString()}`],
  ];
  if (breakdown.features > 0) {
    rows.push(["Feature add-ons", `$${breakdown.features.toLocaleString()}`]);
  }
  rows.push(["Subtotal", `$${breakdown.subtotal.toLocaleString()}`]);

  const multiplierPct = Math.round((breakdown.multiplier - 1) * 100);
  if (multiplierPct > 0) {
    rows.push([`Complexity & timeline adjustment (+${multiplierPct}%)`, ""]);
  }

  rows.forEach(([label, value], i) => {
    const rowY = y + i * 28;
    if (i % 2 === 0) {
      doc.setFillColor("#f8fafc");
      doc.rect(40, rowY - 14, W - 80, 28, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(DARK);
    doc.text(label, 56, rowY + 4);
    if (value) {
      doc.setFont("helvetica", "bold");
      doc.text(value, W - 56, rowY + 4, { align: "right" });
    }
  });

  y += rows.length * 28 + 16;

  // ─── Total box ──────────────────────────────────────────────────────────────
  doc.setFillColor(BLUE);
  doc.roundedRect(40, y, W - 80, 60, 6, 6, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor("#e0f2fe");
  doc.text("ESTIMATED TOTAL INVESTMENT", 60, y + 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor("#ffffff");
  doc.text(`$${breakdown.total.toLocaleString()}`, W - 60, y + 42, { align: "right" });

  y += 84;

  // ─── Tech stack ─────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(DARK);
  doc.text("RECOMMENDED TECH STACK", 40, y);

  y += 18;

  const cols = 3;
  const cellW = (W - 80) / cols;
  breakdown.techStack.forEach((tech, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx  = 40 + col * cellW;
    const cy  = y + row * 30;

    doc.setFillColor("#e0f2fe");
    doc.roundedRect(cx + 2, cy - 12, cellW - 8, 24, 4, 4, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(BLUE);
    doc.text(tech, cx + (cellW - 8) / 2 + 2, cy + 2, { align: "center" });
  });

  y += Math.ceil(breakdown.techStack.length / cols) * 30 + 24;

  // ─── Disclaimer ─────────────────────────────────────────────────────────────
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(GRAY);
  doc.text(
    "This estimate is indicative and valid for 30 days. Final pricing is confirmed after a discovery call.",
    40, y, { maxWidth: W - 80 },
  );

  // ─── Footer ─────────────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(DARK);
  doc.rect(0, pageH - 40, W, 40, "F");
  doc.setFontSize(9);
  doc.setTextColor("#94a3b8");
  doc.setFont("helvetica", "normal");
  doc.text("Confidential – for recipient use only", 40, pageH - 14);
  doc.text("www.yourcompany.com", W - 40, pageH - 14, { align: "right" });

  return Buffer.from(doc.output("arraybuffer"));
}