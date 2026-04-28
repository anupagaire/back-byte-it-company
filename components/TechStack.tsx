'use client';

// TechStack.tsx — Scrolling tech logos strip + process section
// Place between Services and About sections

import { motion } from 'framer-motion';

const techs = [
  'React', 'Next.js', 'Node.js', 'Python', 'TypeScript',
  'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'TensorFlow',
  'React Native', 'Flutter', 'Terraform', 'Redis', 'GraphQL',
];

const process = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'We deep-dive into your business, goals, and constraints to define the right solution.',
  },
  {
    step: '02',
    title: 'Architecture',
    desc: 'Our engineers design a scalable, maintainable system with your tech stack of choice.',
  },
  {
    step: '03',
    title: 'Build & Iterate',
    desc: 'Agile sprints with weekly demos. You see real progress — not just promises.',
  },
  {
    step: '04',
    title: 'Launch & Scale',
    desc: 'We deploy, monitor, and support your product as it grows — long after handover.',
  },
];

export default function TechStack() {
  return (
    <>
      {/* Scrolling marquee */}
      <div className="py-12 bg-white border-y border-gray-100 overflow-hidden">
        <p className="text-center text-xs font-black text-gray-300 uppercase tracking-widest mb-6">
          Technologies We Master
        </p>
        <div className="flex gap-6 whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
          {[...techs, ...techs].map((tech, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 flex-shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#69c8e4] to-[#505f88]" />
              {tech}
            </span>
          ))}
        </div>
        <style jsx>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Process */}
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black text-[#1a2744]"
            >
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]">
                Process
              </span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-gradient-to-r from-[#69c8e4]/30 via-[#505f88]/30 to-[#69c8e4]/30" />

            {process.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative bg-white rounded-3xl p-7 border border-gray-100 hover:border-[#69c8e4]/30 hover:shadow-md transition-all duration-300 text-center group"
              >
                {/* Step number */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#69c8e4] to-[#505f88] flex items-center justify-center mx-auto mb-5 text-white font-black text-lg relative z-10">
                  {p.step}
                </div>
                <h3 className="text-lg font-black text-[#1a2744] mb-3">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}