"use client";

import { DBService } from "./PricingCalculator";

function ServiceIcon({ icon, color }: { icon: string; color: string }) {
  const cls = `w-8 h-8`;
  const style = { color };

  const icons: Record<string, React.ReactNode> = {
    Code2: (
      <svg className={cls} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    Smartphone: (
      <svg className={cls} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    Cloud: (
      <svg className={cls} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    BarChart2: (
      <svg className={cls} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    Shield: (
      <svg className={cls} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  };

  // Fallback icon
  return icons[icon] ?? (
    <svg className={cls} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

interface Props {
  services: DBService[];
  onSelect: (s: DBService) => void;
}

export default function ServicePicker({ services, onSelect }: Props) {
  if (services.length === 0) {
    return (
      <p className="text-center text-slate-500 py-12">
        No services found. Add some in the admin panel first.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-center text-slate-300 text-lg font-medium mb-8">
        What are you building?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="group relative text-left rounded-2xl border border-slate-700/60 bg-slate-900/60 hover:border-slate-500/80 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40 active:scale-[0.99]"
            style={{
              background: `linear-gradient(135deg, ${s.color}18 0%, transparent 60%)`,
            }}
          >
            <div className="flex items-start gap-4">
              <div >
                <ServiceIcon icon={s.icon} color={s.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-base">{s.title}</p>
                <p className="text-slate-400 text-sm mt-0.5 line-clamp-2">{s.shortDesc}</p>
              </div>
              <svg
                className="w-5 h-5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all mt-0.5 flex-shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}