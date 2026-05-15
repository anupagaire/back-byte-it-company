"use client";
// components/pricing/ui/SliderField.tsx

interface Props {
  label:    string;
  min:      number;
  max:      number;
  step:     number;
  value:    number;
  onChange: (v: number) => void;
  format:   (v: number) => string;
  hint?:    string;
}

export default function SliderField({ label, min, max, step, value, onChange, format, hint }: Props) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-slate-300 text-sm font-semibold">{label}</label>
        <span className="text-sky-400 font-bold text-sm tabular-nums">{format(value)}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #0ea5e9 ${pct}%, #1e293b ${pct}%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-slate-600 text-xs">
        <span>{format(min)}</span>
        {hint && <span className="text-slate-500 italic">{hint}</span>}
        <span>{format(max)}</span>
      </div>
    </div>
  );
}