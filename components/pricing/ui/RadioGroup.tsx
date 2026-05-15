"use client";
// components/pricing/ui/RadioGroup.tsx

interface Option {
  value: string;
  label: string;
  desc:  string;
}

interface Props {
  label:    string;
  value:    string;
  onChange: (v: string) => void;
  options:  Option[];
}

export default function RadioGroup({ label, value, onChange, options }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-slate-300 text-sm font-semibold">{label}</p>
      <div className="space-y-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <div
              key={o.value}
              onClick={() => onChange(o.value)}
              className={`flex items-start gap-3 rounded-xl p-4 border cursor-pointer transition-all ${
                active
                  ? "border-sky-500/50 bg-sky-500/10"
                  : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600"
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                  active ? "border-sky-500 bg-sky-500" : "border-slate-600"
                }`}
              >
                {active && <div className="w-full h-full rounded-full bg-white scale-[0.4]" />}
              </div>
              <div>
                <p className={`text-sm font-semibold ${active ? "text-sky-300" : "text-slate-300"}`}>
                  {o.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{o.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}