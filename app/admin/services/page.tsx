"use client";

import { useState, useEffect } from "react";
import {
  Cloud, Brain, Shield, Smartphone, Zap, Code2,
  Globe, Database, BarChart2, Lock, Layers, Settings,
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Check,
  ImageIcon, ChevronRight,
} from "lucide-react";

const ICON_OPTIONS = [
  "Code2", "Cloud", "Brain", "Shield", "Smartphone", "Zap",
  "Globe", "Database", "BarChart2", "Lock", "Layers", "Settings",
];
const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Cloud, Brain, Shield, Smartphone, Zap,
  Globe, Database, BarChart2, Lock, Layers, Settings,
};
const COLOR_OPTIONS = [
  "#69c8e4", "#505f88", "#6366f1", "#8b5cf6", "#10b981",
  "#f59e0b", "#ef4444", "#ec4899", "#14b8a6",
];

interface Service {
  id: string;
  title: string;
  shortDesc: string;
  details: string;
  image?: string;
  color: string;
  icon: string;
  order: number;
  published: boolean;
}

const EMPTY: Omit<Service, "id"> = {
  title: "", shortDesc: "", details: "", image: "",
  color: "#69c8e4", icon: "Code2", order: 0, published: true,
};

/* ── Tiny reusable input ── */
function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.65rem 0.85rem",
  border: "1.5px solid #e5e7eb", borderRadius: "10px",
  fontSize: "0.875rem", color: "#111827", background: "#fff",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3200);
  }

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data);
    } catch {
      showToast("error", "Failed to load services");
    }
    setLoading(false);
  }

  useEffect(() => { fetchServices(); }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, order: services.length });
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      title: s.title, shortDesc: s.shortDesc, details: s.details,
      image: s.image || "", color: s.color, icon: s.icon,
      order: s.order, published: s.published,
    });
    setShowForm(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setForm(prev => ({ ...prev, image: data.url }));
      else showToast("error", "Upload failed");
    } catch {
      showToast("error", "Upload failed");
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!form.title || !form.shortDesc || !form.details) {
      showToast("error", "Title, short description and details are required");
      return;
    }
    setSaving(true);
    const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) { showToast("error", "Failed to save service"); return; }
    showToast("success", editing ? "Service updated!" : "Service created!");
    setShowForm(false);
    fetchServices();
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("success", "Service deleted"); setDeleteId(null); fetchServices(); }
    else showToast("error", "Failed to delete");
  }

  async function togglePublish(s: Service) {
    await fetch(`/api/admin/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !s.published }),
    });
    fetchServices();
  }

  return (
    <>
    
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .svc-row:hover { background: #f9fafb !important; }
        .action-btn:hover { opacity: 0.8; transform: scale(0.97); }
        input:focus, textarea:focus, select:focus { border-color: #69c8e4 !important; box-shadow: 0 0 0 3px rgba(105,200,228,0.12); }

        /* Mobile card styles */
        @media (max-width: 767px) {
          .desktop-table { display: none !important; }
          .mobile-cards { display: flex !important; }
          .page-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .add-btn { width: 100% !important; justify-content: center !important; }
          .modal-inner { padding: 1.25rem !important; max-height: 95vh !important; border-radius: 20px 20px 0 0 !important; }
          .modal-wrap { align-items: flex-end !important; padding: 0 !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 768px) {
          .desktop-table { display: block !important; }
          .mobile-cards { display: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, animation: "fadeIn 0.3s ease" }}>

        {/* ── Toast ── */}
        {toast && (
          <div style={{
            position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 9999,
            padding: "0.7rem 1.1rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600,
            background: toast.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: toast.type === "success" ? "#065f46" : "#991b1b",
            border: `1.5px solid ${toast.type === "success" ? "#6ee7b7" : "#fca5a5"}`,
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            animation: "slideDown 0.25s ease",
            maxWidth: "calc(100vw - 2.5rem)",
          }}>
            {toast.type === "success" ? <Check size={15} /> : <X size={15} />}
            {toast.text}
          </div>
        )}

        {/* ── Header ── */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Services
            </h1>
            <p style={{ margin: "3px 0 0", color: "#94a3b8", fontSize: "0.83rem" }}>
              {services.length} service{services.length !== 1 ? "s" : ""} · manage what's shown on your site
            </p>
          </div>
          <button
            className="add-btn"
            onClick={openCreate}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "0.6rem 1.1rem", background: "#0f172a", color: "#fff",
              border: "none", borderRadius: "11px", fontSize: "0.85rem",
              fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em",
              boxShadow: "0 2px 8px rgba(15,23,42,0.2)",
            }}
          >
            <Plus size={15} /> Add Service
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}>
            <Loader2 size={30} style={{ animation: "spin 0.8s linear infinite", color: "#69c8e4" }} />
          </div>
        )}

        {!loading && (
          <>
            {/* ── DESKTOP TABLE ── */}
            <div className="desktop-table" style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: "18px", overflow: "hidden", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>
              {services.length === 0 ? (
                <div style={{ padding: "5rem", textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <Layers size={24} color="#cbd5e1" />
                  </div>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>No services yet.</p>
                  <p style={{ margin: "4px 0 0", color: "#cbd5e1", fontSize: "0.8rem" }}>Click "Add Service" to get started.</p>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid #f1f5f9", background: "#f8fafc" }}>
                      {["Service", "Description", "Image", "Color", "Order", "Status", "Actions"].map(h => (
                        <th key={h} style={{ padding: "0.8rem 1.1rem", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s, i) => {
                      const Icon = ICON_MAP[s.icon] || Code2;
                      return (
                        <tr key={s.id} className="svc-row" style={{ borderBottom: i < services.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.15s" }}>
                          <td style={{ padding: "0.9rem 1.1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon size={16} style={{ color: s.color }} />
                              </div>
                              <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>{s.title}</span>
                            </div>
                          </td>
                          <td style={{ padding: "0.9rem 1.1rem", maxWidth: 200 }}>
                            <span style={{ fontSize: "0.78rem", color: "#64748b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {s.shortDesc}
                            </span>
                          </td>
                          <td style={{ padding: "0.9rem 1.1rem" }}>
                            {s.image ? (
                              <img src={s.image} alt="" style={{ width: 44, height: 34, objectFit: "cover", borderRadius: 7, border: "1.5px solid #f1f5f9" }} />
                            ) : (
                              <div style={{ width: 44, height: 34, borderRadius: 7, background: "#f8fafc", border: "1.5px dashed #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ImageIcon size={13} color="#cbd5e1" />
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "0.9rem 1.1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{ width: 18, height: 18, borderRadius: "50%", background: s.color, boxShadow: `0 0 0 2px white, 0 0 0 3px ${s.color}40` }} />
                              <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontFamily: "monospace" }}>{s.color}</span>
                            </div>
                          </td>
                          <td style={{ padding: "0.9rem 1.1rem", fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{s.order}</td>
                          <td style={{ padding: "0.9rem 1.1rem" }}>
                            <button
                              onClick={() => togglePublish(s)}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "4px 10px", borderRadius: "999px", border: "none",
                                fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
                                background: s.published ? "#dcfce7" : "#f1f5f9",
                                color: s.published ? "#15803d" : "#64748b",
                                transition: "all 0.15s",
                              }}
                            >
                              {s.published ? <Eye size={11} /> : <EyeOff size={11} />}
                              {s.published ? "Live" : "Hidden"}
                            </button>
                          </td>
                          <td style={{ padding: "0.9rem 1.1rem" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="action-btn" onClick={() => openEdit(s)}
                                style={{ padding: "6px 10px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", color: "#475569", transition: "all 0.15s" }}>
                                <Pencil size={13} />
                              </button>
                              <button className="action-btn" onClick={() => setDeleteId(s.id)}
                                style={{ padding: "6px 10px", background: "#fef2f2", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", color: "#dc2626", transition: "all 0.15s" }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* ── MOBILE CARDS ── */}
            <div className="mobile-cards" style={{ flexDirection: "column", gap: "10px", display: "none" }}>
              {services.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", background: "#fff", borderRadius: 16, border: "1.5px solid #f1f5f9" }}>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>No services yet. Tap "Add Service".</p>
                </div>
              ) : services.map((s) => {
                const Icon = ICON_MAP[s.icon] || Code2;
                return (
                  <div key={s.id} style={{
                    background: "#fff", borderRadius: 16,
                    border: "1.5px solid #f1f5f9",
                    boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
                    overflow: "hidden",
                  }}>
                    {/* Card image strip */}
                    {s.image ? (
                      <div style={{ position: "relative", height: 110 }}>
                        <img src={s.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.7), transparent)" }} />
                        <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.color}30`, border: `1.5px solid ${s.color}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon size={14} style={{ color: s.color }} />
                          </div>
                          <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{s.title}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: 6, background: `linear-gradient(90deg, ${s.color}, ${s.color}40)` }} />
                    )}

                    <div style={{ padding: "14px 14px 12px" }}>
                      {/* Title row (no image case) */}
                      {!s.image && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={15} style={{ color: s.color }} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>{s.title}</span>
                        </div>
                      )}

                      <p style={{ margin: "0 0 12px", fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>{s.shortDesc}</p>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {/* Status toggle */}
                        <button
                          onClick={() => togglePublish(s)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "5px 11px", borderRadius: "999px", border: "none",
                            fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
                            background: s.published ? "#dcfce7" : "#f1f5f9",
                            color: s.published ? "#15803d" : "#64748b",
                          }}
                        >
                          {s.published ? <Eye size={11} /> : <EyeOff size={11} />}
                          {s.published ? "Live" : "Hidden"}
                        </button>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => openEdit(s)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", background: "#f1f5f9", border: "none", borderRadius: 9, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, color: "#475569" }}>
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => setDeleteId(s.id)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", background: "#fef2f2", border: "none", borderRadius: 9, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, color: "#dc2626" }}>
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── CREATE / EDIT MODAL ── */}
        {showForm && (
          <div className="modal-wrap" style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "1rem",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.2s ease",
          }}>
            <div className="modal-inner" style={{
              background: "#fff", borderRadius: "22px", padding: "1.75rem",
              width: "100%", maxWidth: 600, maxHeight: "88vh",
              overflowY: "auto", position: "relative",
              boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
              animation: "slideDown 0.25s ease",
            }}>
              {/* Modal header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                    {editing ? "Edit Service" : "New Service"}
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
                    {editing ? "Update service details below" : "Fill in the details to create a new service"}
                  </p>
                </div>
                <button onClick={() => setShowForm(false)}
                  style={{ background: "#f1f5f9", border: "none", borderRadius: "10px", padding: "8px", cursor: "pointer", color: "#64748b", display: "flex" }}>
                  <X size={17} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

                {/* Title */}
                <Field label="Title" required>
                  <input style={inputStyle} value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Custom Software Development" />
                </Field>

                {/* Short desc */}
                <Field label="Short Description" required>
                  <input style={inputStyle} value={form.shortDesc}
                    onChange={e => setForm({ ...form, shortDesc: e.target.value })}
                    placeholder="One-liner shown on the card" />
                </Field>

                {/* Full details */}
                <Field label="Full Details" required>
                  <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
                    value={form.details}
                    onChange={e => setForm({ ...form, details: e.target.value })}
                    placeholder="Expanded description shown on hover / click" />
                </Field>

                {/* Image upload */}
                <Field label="Cover Image">
                  <label style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 8, padding: "1rem", border: "2px dashed #e2e8f0", borderRadius: 12,
                    cursor: "pointer", background: "#f8fafc", transition: "border-color 0.2s",
                    position: "relative", overflow: "hidden",
                  }}>
                    {form.image ? (
                      <>
                        <img src={form.image} alt="preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
                        <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
                          <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600 }}>Change image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {uploading ? (
                          <Loader2 size={22} color="#69c8e4" style={{ animation: "spin 0.8s linear infinite" }} />
                        ) : (
                          <ImageIcon size={22} color="#94a3b8" />
                        )}
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>
                          {uploading ? "Uploading..." : "Tap to upload an image"}
                        </span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                  </label>
                  {form.image && (
                    <button onClick={() => setForm(p => ({ ...p, image: "" }))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "0.75rem", fontWeight: 600, textAlign: "left", padding: "2px 0" }}>
                      Remove image
                    </button>
                  )}
                </Field>

                {/* Icon picker */}
                <Field label="Icon">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {ICON_OPTIONS.map(name => {
                      const Ic = ICON_MAP[name];
                      const sel = form.icon === name;
                      return (
                        <button key={name} type="button" onClick={() => setForm({ ...form, icon: name })}
                          title={name}
                          style={{
                            width: 40, height: 40, borderRadius: 9,
                            border: sel ? `2px solid ${form.color}` : "1.5px solid #e2e8f0",
                            background: sel ? `${form.color}15` : "#f8fafc",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            color: sel ? form.color : "#94a3b8", transition: "all 0.15s",
                          }}>
                          <Ic size={17} />
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {/* Color picker */}
                <Field label="Brand Color">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    {COLOR_OPTIONS.map(c => (
                      <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                        style={{
                          width: 30, height: 30, borderRadius: "50%", background: c,
                          border: form.color === c ? "3px solid #0f172a" : "3px solid transparent",
                          boxShadow: "0 0 0 1.5px #e2e8f0", cursor: "pointer", transition: "transform 0.1s",
                          transform: form.color === c ? "scale(1.15)" : "scale(1)",
                        }} />
                    ))}
                    <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                      style={{ width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0, background: "none" }}
                      title="Custom color" />
                  </div>
                </Field>

                {/* Order + Published */}
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Sort Order">
                    <input type="number" style={inputStyle} value={form.order}
                      onChange={e => setForm({ ...form, order: Number(e.target.value) })} min={0} />
                  </Field>
                  <Field label="Visibility">
                    <button type="button" onClick={() => setForm(p => ({ ...p, published: !p.published }))}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "0.65rem 0.85rem", borderRadius: 10, cursor: "pointer",
                        border: `1.5px solid ${form.published ? "#6ee7b7" : "#e2e8f0"}`,
                        background: form.published ? "#f0fdf4" : "#f8fafc",
                        color: form.published ? "#15803d" : "#64748b",
                        fontWeight: 700, fontSize: "0.85rem", transition: "all 0.15s",
                      }}>
                      {form.published ? <Eye size={15} /> : <EyeOff size={15} />}
                      {form.published ? "Published" : "Hidden"}
                    </button>
                  </Field>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: "1.4rem" }}>
                <button onClick={() => setShowForm(false)}
                  style={{ flex: 1, padding: "0.72rem", background: "#f1f5f9", border: "none", borderRadius: 12, fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", color: "#475569" }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  style={{
                    flex: 2, padding: "0.72rem", background: saving ? "#94a3b8" : "#0f172a",
                    color: "#fff", border: "none", borderRadius: 12, fontSize: "0.875rem",
                    fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "background 0.2s",
                  }}>
                  {saving ? (
                    <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Saving…</>
                  ) : (
                    <>{editing ? "Save Changes" : "Create Service"} <ChevronRight size={15} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── DELETE CONFIRM ── */}
        {deleteId && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1001, padding: "1rem",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.2s ease",
          }}>
            <div style={{
              background: "#fff", borderRadius: 20, padding: "1.75rem",
              maxWidth: 360, width: "100%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
              animation: "slideDown 0.25s ease",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Trash2 size={20} color="#dc2626" />
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>Delete this service?</h3>
              <p style={{ margin: "0 0 1.4rem", color: "#64748b", fontSize: "0.83rem", lineHeight: 1.5 }}>
                This will permanently remove the service from your website. This action cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setDeleteId(null)}
                  style={{ flex: 1, padding: "0.7rem", background: "#f1f5f9", border: "none", borderRadius: 11, fontWeight: 700, cursor: "pointer", color: "#475569", fontSize: "0.875rem" }}>
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)}
                  style={{ flex: 1, padding: "0.7rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: 11, fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}