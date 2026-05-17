"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  GripVertical, X, Check, Loader2, Quote,
} from "lucide-react";
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublished,
  reorderTestimonials,
} from "@/app/actions/testimonials";

interface Testimonial {
  id:        string;
  name:      string;
  role:      string;
  image:     string | null;
  message:   string;
  order:     number;
  published: boolean;
  createdAt: Date;
}

const EMPTY_FORM = { name: "", role: "", image: "", message: "", published: true };

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);
  const [isPending, startTransition]    = useTransition();

  // Modal state
  const [showModal, setShowModal]   = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formError, setFormError]   = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAllTestimonials()
      .then((data) => setTestimonials(data as Testimonial[]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // ─── Open modal ────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      name:      t.name,
      role:      t.role,
      image:     t.image ?? "",
      message:   t.message,
      published: t.published,
    });
    setFormError("");
    setShowModal(true);
  };

  // ─── Submit create / update ────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.name.trim() || !form.role.trim() || !form.message.trim()) {
      setFormError("Name, role, and message are required.");
      return;
    }
    setFormError("");
    startTransition(async () => {
      const payload = {
        name:      form.name.trim(),
        role:      form.role.trim(),
        image:     form.image.trim() || undefined,
        message:   form.message.trim(),
        published: form.published,
        order:     testimonials.length,
      };
      const res = editingId
        ? await updateTestimonial(editingId, payload)
        : await createTestimonial(payload);

      if (res.success) {
        setShowModal(false);
        load();
      } else {
        setFormError((res as any).error ?? "Something went wrong.");
      }
    });
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteTestimonial(id);
      setDeleteConfirm(null);
      load();
    });
  };

  // ─── Toggle publish ────────────────────────────────────────────────────────
  const handleToggle = (id: string, published: boolean) => {
    startTransition(async () => {
      await toggleTestimonialPublished(id, !published);
      load();
    });
  };

  // ─── Simple drag-to-reorder state ─────────────────────────────────────────
  const [dragging, setDragging] = useState<number | null>(null);

  const onDragStart = (idx: number) => setDragging(idx);

  const onDrop = (idx: number) => {
    if (dragging === null || dragging === idx) return;
    const reordered = [...testimonials];
    const [moved]   = reordered.splice(dragging, 1);
    reordered.splice(idx, 0, moved);
    setTestimonials(reordered);
    setDragging(null);
    startTransition(async () => {
      await reorderTestimonials(reordered.map((t) => t.id));
    });
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            {testimonials.filter((t) => t.published).length} of {testimonials.length} published
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Quote className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No testimonials yet. Add your first one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 w-8"></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Person</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 hidden md:table-cell">Message</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t, idx) => (
                <tr
                  key={t.id}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(idx)}
                  className={`border-b border-gray-100 last:border-0 transition-colors ${
                    dragging === idx ? "bg-indigo-50 opacity-60" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Drag handle */}
                  <td className="px-4 py-3 cursor-grab text-gray-300">
                    <GripVertical className="w-4 h-4" />
                  </td>

                  {/* Person */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                        <Image
                          src={t.image ?? "/profile.png"}
                          alt={t.name}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.role}</p>
                      </div>
                    </div>
                  </td>

                  {/* Message preview */}
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs">
                    <p className="truncate italic">&ldquo;{t.message}&rdquo;</p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.published
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t.published ? "Published" : "Hidden"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Toggle publish */}
                      <button
                        onClick={() => handleToggle(t.id, t.published)}
                        disabled={isPending}
                        title={t.published ? "Hide" : "Publish"}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {t.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openEdit(t)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      {deleteConfirm === t.id ? (
                        <span className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(t.id)}
                            disabled={isPending}
                            className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(t.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drag-to-reorder hint */}
      {testimonials.length > 1 && (
        <p className="text-xs text-gray-400 text-center mt-3">
          Drag rows to reorder testimonials on the public site.
        </p>
      )}

      {/* ─── Modal ─────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ram Prasad Gautam"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role / Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="CTO, FinTech Solutions"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL
                  <span className="text-gray-400 font-normal ml-1">(leave blank for default)</span>
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/profile.png or https://..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Back Byte transformed our entire digital banking experience..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Published */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm({ ...form, published: !form.published })}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
                    form.published ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      form.published ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-700">Published (visible on site)</span>
              </label>

              {/* Error */}
              {formError && (
                <p className="text-sm text-red-500">{formError}</p>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}