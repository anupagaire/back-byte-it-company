"use client";

interface Props { current: 1 | 2 | 3; }

const STEPS = ["Choose Service", "Configure", "Get Estimate"];

export default function StepIndicator({ current }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 mb-2">
      {STEPS.map((label, i) => {
        const num    = i + 1;
        const done   = current > num;
        const active = current === num;
        return (
          <div key={num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  done
                    ? "bg-sky-500 text-white"
                    : active
                    ? "bg-sky-500/20 border-2 border-sky-500 text-sky-400"
                    : "bg-slate-800 border border-slate-700 text-slate-500"
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                  active ? "text-sky-400" : done ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 md:w-24 h-px mx-2 mb-5 transition-all duration-500 ${
                  done ? "bg-sky-500" : "bg-slate-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}