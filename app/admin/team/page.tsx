'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Plus, Pencil, Trash2, X, Upload, Eye, EyeOff,
  Loader2, User, GripVertical,   CheckCircle2, AlertCircle
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo: string | null;
  order: number;
  published: boolean;
  createdAt: string;
}

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium transition-all
      ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {msg}
    </div>
  );
}

/* ─── Avatar ─────────────────────────────────────────────── */
function Avatar({ photo, name, size = 48 }: { photo: string | null; name: string; size?: number }) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={size}
        height={size}
        className="rounded-xl object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-xl bg-gradient-to-br from-[#69c8e4]/30 to-[#505f88]/30 flex items-center justify-center text-[#505f88] font-black text-lg"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  );
}

/* ─── Form Modal ─────────────────────────────────────────── */
function MemberModal({
  member,
  onClose,
  onSaved,
}: {
  member: TeamMember | null;
  onClose: () => void;
  onSaved: (m: TeamMember) => void;
}) {
  const isEdit = !!member;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(member?.photo || null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: member?.name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    order: String(member?.order ?? 0),
    published: member?.published ?? true,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (file) fd.append('photo', file);

      const url = isEdit ? `/api/team/${member!.id}` : '/api/team';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error('Failed');
      const saved: TeamMember = await res.json();
      onSaved(saved);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-[#1a2744]">
            {isEdit ? 'Edit Member' : 'Add Team Member'}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#69c8e4] transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 group-hover:text-[#69c8e4] transition-colors">
                  <Upload size={24} />
                  <span className="text-xs mt-1 font-medium">Upload Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload size={20} className="text-white" />
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <p className="text-xs text-gray-400">JPG, PNG, WEBP · Max 5MB · Auto-cropped to square</p>
          </div>

          {[
            { key: 'name', label: 'Full Name *', placeholder: 'Alex Carter' },
            { key: 'role', label: 'Role / Title *', placeholder: 'Lead Engineer' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
              <input
                value={form[key as keyof typeof form] as string}
                onChange={e => set(key as keyof typeof form, e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1a2744] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#69c8e4]/40 focus:border-[#69c8e4] transition"
              />
            </div>
          ))}

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              placeholder="A short bio about this team member..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1a2744] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#69c8e4]/40 focus:border-[#69c8e4] transition"
            />
          </div>

         

          {/* Order & Published */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={e => set('order', e.target.value)}
                min={0}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#1a2744] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#69c8e4]/40 focus:border-[#69c8e4] transition"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.published}
                  onChange={e => set('published', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#69c8e4]"></div>
                <span className="ml-2 text-sm font-bold text-gray-600">Published</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.name.trim() || !form.role.trim()}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#69c8e4] to-[#505f88] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {isEdit ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Admin Team Page ────────────────────────────────────── */
export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMember, setModalMember] = useState<TeamMember | null | undefined>(undefined); // undefined = closed
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') =>
    setToast({ msg, type });

  const load = async () => {
    try {
      const res = await fetch('/api/team?all=true');
      setMembers(await res.json());
    } catch {
      showToast('Failed to load team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSaved = (m: TeamMember) => {
    setMembers(prev => {
      const exists = prev.find(x => x.id === m.id);
      return exists ? prev.map(x => x.id === m.id ? m : x) : [m, ...prev];
    });
    setModalMember(undefined);
    showToast(modalMember ? 'Member updated!' : 'Member added!');
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setMembers(prev => prev.filter(m => m.id !== id));
      showToast('Member deleted');
    } catch {
      showToast('Failed to delete member', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublished = async (m: TeamMember) => {
    const fd = new FormData();
    fd.append('published', String(!m.published));
    try {
      const res = await fetch(`/api/team/${m.id}`, { method: 'PATCH', body: fd });
      const updated = await res.json();
      setMembers(prev => prev.map(x => x.id === m.id ? updated : x));
      showToast(updated.published ? 'Member published' : 'Member hidden');
    } catch {
      showToast('Failed to update', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-8">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1a2744]">Team Members</h1>
            <p className="text-gray-400 mt-1">{members.filter(m => m.published).length} published · {members.length} total</p>
          </div>
          <button
            onClick={() => setModalMember(null)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#69c8e4] to-[#505f88] text-white font-bold px-5 py-3 rounded-2xl hover:opacity-90 transition shadow-lg shadow-[#69c8e4]/20"
          >
            <Plus size={18} /> Add Member
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={32} className="animate-spin text-[#69c8e4]" />
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center h-64 text-gray-400">
            <User size={40} className="mb-3 opacity-30" />
            <p className="font-bold text-lg">No team members yet</p>
            <p className="text-sm mt-1">Click "Add Member" to get started</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400">
              <span></span>
              <span>Member</span>
              <span className="text-center">Order</span>
              <span className="text-center">Status</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            {members.map((m, i) => (
              <div
                key={m.id}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 items-center transition-colors hover:bg-gray-50/80
                  ${i !== members.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                {/* Drag handle (visual only) */}
                <GripVertical size={16} className="text-gray-300" />

                {/* Member info */}
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar photo={m.photo} name={m.name} size={48} />
                  <div className="min-w-0">
                    <p className="font-black text-[#1a2744] truncate">{m.name}</p>
                    <p className="text-sm text-gray-400 truncate">{m.role}</p>
                    {m.bio && <p className="text-xs text-gray-300 truncate mt-0.5">{m.bio}</p>}
                  </div>
                </div>

                {/* Order */}
                <div className="text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 text-sm font-bold">
                    {m.order}
                  </span>
                </div>

                {/* Published toggle */}
                <div className="flex justify-center">
                  <button
                    onClick={() => togglePublished(m)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors
                      ${m.published
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                  >
                    {m.published ? <Eye size={13} /> : <EyeOff size={13} />}
                    {m.published ? 'Live' : 'Hidden'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setModalMember(m)}
                    className="w-9 h-9 rounded-xl bg-[#69c8e4]/10 text-[#69c8e4] flex items-center justify-center hover:bg-[#69c8e4]/20 transition"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteId(m.id)}
                    className="w-9 h-9 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalMember !== undefined && (
        <MemberModal
          member={modalMember}
          onClose={() => setModalMember(undefined)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="text-xl font-black text-[#1a2744] mb-2">Delete Member?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently remove the team member and their photo.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}