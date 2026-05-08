'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Check, Eye, EyeOff,
  GripVertical, Loader2, ExternalLink, Github, AlertCircle
} from 'lucide-react';

const CATEGORIES = ['Web App', 'Mobile', 'AI/ML', 'Cloud', 'Other'];

interface Project {
  id: string;
  title: string;
  category: string;
  tech: string[];
  desc: string;
  published: boolean;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  title: '',
  category: 'Web App',
  tech: [] as string[],
  techInput: '',
  desc: '',
  published: true,
  githubUrl: '',
  liveUrl: '',
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?all=true');
      const data = await res.json();
      setProjects(data);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      category: p.category,
      tech: p.tech,
      techInput: '',
      desc: p.desc,
      published: p.published,
      githubUrl: p.githubUrl || '',
      liveUrl: p.liveUrl || '',
    });
    setEditingId(p.id);
    setError('');
    setModalOpen(true);
  };

  const handleAddTech = () => {
    const tag = form.techInput.trim();
    if (tag && !form.tech.includes(tag)) {
      setForm((f) => ({ ...f, tech: [...f.tech, tag], techInput: '' }));
    }
  };

  const handleRemoveTech = (t: string) => {
    setForm((f) => ({ ...f, tech: f.tech.filter((x) => x !== t) }));
  };

  const handleSave = async () => {
    if (!form.title || !form.desc) {
      setError('Title and description are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        category: form.category,
        tech: form.tech,
        desc: form.desc,
        published: form.published,
        githubUrl: form.githubUrl || null,
        liveUrl: form.liveUrl || null,
      };

      if (editingId) {
        const res = await fetch(`/api/projects/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        showSuccess('Project updated!');
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        showSuccess('Project created!');
      }

      setModalOpen(false);
      fetchProjects();
    } catch {
      setError('Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setDeleteConfirm(null);
      showSuccess('Project deleted!');
      fetchProjects();
    } catch {
      setError('Failed to delete project.');
    }
  };

  const togglePublish = async (p: Project) => {
    try {
      await fetch(`/api/projects/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !p.published }),
      });
      fetchProjects();
    } catch {
      setError('Failed to update project.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a2744]">Projects</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? 's' : ''} •{' '}
              {projects.filter((p) => p.published).length} published
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#69c8e4] to-[#505f88] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Project</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError('')}><X size={14} /></button>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm"
            >
              <Check size={16} className="flex-shrink-0" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#69c8e4]" size={32} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🚀</div>
            <p className="font-medium">No projects yet. Add your first one!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {projects.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <GripVertical size={16} className="text-gray-300 cursor-grab flex-shrink-0 mt-1" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-black text-[#1a2744] text-sm sm:text-base truncate">{p.title}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#69c8e4]/10 text-[#69c8e4] flex-shrink-0">
                        {p.category}
                      </span>
                      {!p.published && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 flex-shrink-0">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2">{p.desc}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {p.tech.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                          {t}
                        </span>
                      ))}
                    </div>
                    {/* Links row */}
                    <div className="flex items-center gap-3 mt-2">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-[#1a2744] flex items-center gap-1 transition-colors">
                          <Github size={11} /> GitHub
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-[#69c8e4] flex items-center gap-1 transition-colors">
                          <ExternalLink size={11} /> Live
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => togglePublish(p)}
                      title={p.published ? 'Unpublish' : 'Publish'}
                      className={`p-2 rounded-lg transition-colors ${
                        p.published
                          ? 'text-[#69c8e4] bg-[#69c8e4]/10 hover:bg-[#69c8e4]/20'
                          : 'text-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-lg text-[#505f88] bg-[#505f88]/10 hover:bg-[#505f88]/20 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      className="p-2 rounded-lg text-red-400 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal — slides up from bottom on mobile */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 flex-shrink-0">
                {/* Mobile drag pill */}
                <div className="absolute left-1/2 -translate-x-1/2 top-3 w-10 h-1 bg-gray-200 rounded-full sm:hidden" />
                <h2 className="text-lg sm:text-xl font-black text-[#1a2744]">
                  {editingId ? 'Edit Project' : 'New Project'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">

                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="FinFlow Analytics"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#69c8e4]/50 focus:border-[#69c8e4]"
                  />
                </div>

              <div>
  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Category *</label>
  <select
    value={form.category}
    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#69c8e4]/50"
  >
    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
  </select>
</div>


                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Description *</label>
                  <textarea
                    value={form.desc}
                    onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                    rows={3}
                    placeholder="Short description of the project..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#69c8e4]/50 resize-none"
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Tech Stack</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={form.techInput}
                      onChange={(e) => setForm((f) => ({ ...f, techInput: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                      placeholder="Next.js — press Enter to add"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#69c8e4]/50"
                    />
                    <button
                      onClick={handleAddTech}
                      className="px-4 py-2 bg-[#69c8e4]/10 text-[#69c8e4] font-bold text-sm rounded-xl hover:bg-[#69c8e4]/20 transition-colors flex-shrink-0"
                    >
                      Add
                    </button>
                  </div>
                  {form.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.tech.map((t) => (
                        <span key={t} className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600">
                          {t}
                          <button onClick={() => handleRemoveTech(t)} className="hover:text-red-500 transition-colors">
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* URLs — stacked on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Github size={12} /> GitHub URL
                    </label>
                    <input
                      value={form.githubUrl}
                      onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                      placeholder="https://github.com/..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#69c8e4]/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <ExternalLink size={12} /> Live URL
                    </label>
                    <input
                      value={form.liveUrl}
                      onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#69c8e4]/50"
                    />
                  </div>
                </div>

                {/* Published toggle */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.published ? 'bg-[#69c8e4]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-gray-600 font-medium">
                    {form.published ? 'Published' : 'Draft (hidden from public)'}
                  </span>
                </div>

                {error && (
                  <p className="text-red-500 text-sm flex items-center gap-1.5">
                    <AlertCircle size={14} className="flex-shrink-0" /> {error}
                  </p>
                )}
              </div>

              {/* Sticky footer */}
              <div className="flex gap-3 p-5 sm:p-6 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#69c8e4] to-[#505f88] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trash2 size={22} className="text-red-500" />
                </div>
                <h3 className="text-lg font-black text-[#1a2744]">Delete Project?</h3>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}