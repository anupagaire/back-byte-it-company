"use client";

import { useState, useEffect } from "react";
import {
  Cloud, Brain, Shield, Smartphone, Zap, Code2,
  Globe, Database, BarChart2, Lock, Layers, Settings,
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Check,
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
  color: string;
  icon: string;
  order: number;
  published: boolean;
}

const EMPTY: Omit<Service, "id"> = {
  title: "", shortDesc: "", details: "",
  color: "#69c8e4", icon: "Code2", order: 0, published: true,
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

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchServices() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data);
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
    setForm({ title: s.title, shortDesc: s.shortDesc, details: s.details, color: s.color, icon: s.icon, order: s.order, published: s.published });
    setShowForm(true);
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
    if (!res.ok) {
      showToast("error", "Failed to save service");
      return;
    }
    showToast("success", editing ? "Service updated!" : "Service created!");
    setShowForm(false);
    fetchServices();
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("success", "Service deleted");
      setDeleteId(null);
      fetchServices();
    } else {
      showToast("error", "Failed to delete");
    }
  }

  async function togglePublish(s: Service) {
    await fetch(`/api/admin/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !s.published }),
    });
    fetchServices();
  }

  const inputCls: React.CSSProperties = {
    width: "100%", padding: "0.65rem 0.9rem", border: "1px solid #e5e7eb",
    borderRadius: "8px", fontSize: "0.875rem", color: "#111827",
    background: "#fff", outline: "none", boxSizing: "border-box",
  };
  const labelCls: React.CSSProperties = {
    display: "block", fontSize: "0.78rem", fontWeight: 600,
    color: "#374151", marginBottom: "0.35rem",
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: "1100px" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999,
          padding: "0.75rem 1.25rem", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 500,
          background: toast.type === "success" ? "#d1fae5" : "#fee2e2",
          color: toast.type === "success" ? "#065f46" : "#991b1b",
          border: `1px solid ${toast.type === "success" ? "#a7f3d0" : "#fecaca"}`,
          display: "flex", alignItems: "center", gap: "0.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}>
          {toast.type === "success" ? <Check size={16} /> : <X size={16} />}
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
            Services
          </h1>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.875rem" }}>
            Manage what services are shown on your website
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.65rem 1.25rem", background: "#111827", color: "#fff",
            border: "none", borderRadius: "10px", fontSize: "0.875rem",
            fontWeight: 600, cursor: "pointer",
          }}
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#6366f1" }} />
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden" }}>
          {services.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#9ca3af" }}>
              <p style={{ margin: 0 }}>No services yet. Click "Add Service" to create one.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
                  {["Service", "Short Description", "Color", "Order", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((s, i) => {
                  const Icon = ICON_MAP[s.icon] || Code2;
                  return (
                    <tr key={s.id} style={{ borderBottom: i < services.length - 1 ? "1px solid #f9fafb" : "none" }}>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={18} style={{ color: s.color }} />
                          </div>
                          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#111827" }}>{s.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", fontSize: "0.8rem", color: "#6b7280", maxWidth: "220px" }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {s.shortDesc}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: s.color, border: "2px solid #fff", boxShadow: "0 0 0 1px #e5e7eb" }} />
                          <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontFamily: "monospace" }}>{s.color}</span>
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "#6b7280" }}>{s.order}</td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <button
                          onClick={() => togglePublish(s)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "0.35rem",
                            padding: "4px 10px", borderRadius: "999px", border: "none",
                            fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                            background: s.published ? "#d1fae5" : "#f3f4f6",
                            color: s.published ? "#065f46" : "#6b7280",
                          }}
                        >
                          {s.published ? <Eye size={12} /> : <EyeOff size={12} />}
                          {s.published ? "Published" : "Hidden"}
                        </button>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => openEdit(s)}
                            style={{ padding: "6px 10px", background: "#f3f4f6", border: "none", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151" }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(s.id)}
                            style={{ padding: "6px 10px", background: "#fee2e2", border: "none", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", color: "#dc2626" }}
                          >
                            <Trash2 size={14} />
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
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "2rem",
            width: "100%", maxWidth: "580px", maxHeight: "90vh",
            overflowY: "auto", position: "relative",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>
                {editing ? "Edit Service" : "Add Service"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelCls}>Title *</label>
                <input style={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Custom Software Development" />
              </div>
              <div>
                <label style={labelCls}>Short Description *</label>
                <input style={inputCls} value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} placeholder="One-line summary shown by default" />
              </div>
              <div>
                <label style={labelCls}>Full Details *</label>
                <textarea
                  style={{ ...inputCls, minHeight: "100px", resize: "vertical" }}
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  placeholder="Shown on hover — describe the service in detail"
                />
              </div>

              {/* Icon picker */}
              <div>
                <label style={labelCls}>Icon</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {ICON_OPTIONS.map((name) => {
                    const Ic = ICON_MAP[name];
                    const selected = form.icon === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setForm({ ...form, icon: name })}
                        style={{
                          width: "42px", height: "42px", borderRadius: "8px",
                          border: selected ? `2px solid ${form.color}` : "1px solid #e5e7eb",
                          background: selected ? `${form.color}15` : "#f9fafb",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          color: selected ? form.color : "#9ca3af",
                        }}
                        title={name}
                      >
                        <Ic size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label style={labelCls}>Color</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%", background: c,
                        border: form.color === c ? "3px solid #111827" : "3px solid transparent",
                        boxShadow: "0 0 0 1px #e5e7eb", cursor: "pointer",
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer", padding: 0 }}
                    title="Custom color"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelCls}>Order (sort position)</label>
                  <input type="number" style={inputCls} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "1.4rem" }}>
                  <input
                    type="checkbox"
                    id="published"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="published" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                    Published (visible on site)
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                onClick={() => setShowForm(false)}
                style={{ flex: 1, padding: "0.7rem", background: "#f3f4f6", border: "none", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ flex: 2, padding: "0.7rem", background: "#111827", color: "#fff", border: "none", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", maxWidth: "380px", width: "100%", margin: "0 1rem" }}>
            <h3 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>Delete Service?</h3>
            <p style={{ margin: "0 0 1.5rem", color: "#6b7280", fontSize: "0.875rem" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "0.7rem", background: "#f3f4f6", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", color: "#374151", fontSize: "0.875rem" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: "0.7rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}