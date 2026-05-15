"use client";
// components/pricing/ui/ToggleField.tsx

interface Props {
  label:    string;
  desc:     string;
  checked:  boolean;
  onChange: (v: boolean) => void;
}

export default function ToggleField({ label, desc, checked, onChange }: Props) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-4 rounded-xl p-4 border cursor-pointer transition-all ${
        checked
          ? "border-sky-500/50 bg-sky-500/10"
          : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600"
      }`}
    >
      {/* Toggle pill */}
      <div className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-sky-500" : "bg-slate-700"}`}>
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </div>
      <div>
        <p className={`text-sm font-semibold ${checked ? "text-sky-300" : "text-slate-300"}`}>{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}