'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  Cloud, Brain, Shield, Smartphone, Zap, Code2,
  Globe, Database, BarChart2, Lock, Layers, Settings,
  ArrowRight, CheckCircle2, ChevronDown, Loader2,
} from 'lucide-react';

/* ─── Icon Map ──────────────────────────── */
const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Cloud, Brain, Shield, Smartphone, Zap,
  Globe, Database, BarChart2, Lock, Layers, Settings,
};

/* ─── Types ─────────────────────────────── */
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

interface ServiceWithPerks extends Service {
  perks: string[];
}

/* ─── Fallback data ─────────────────────── */
const FALLBACK: ServiceWithPerks[] = [
  { id: '1', title: 'Custom Software Development', shortDesc: 'Bespoke applications built for your exact needs.', details: 'End-to-end development from architecture to deployment. We build scalable, maintainable web and desktop applications using React, Next.js, Node.js, Python, and more.', color: '#69c8e4', icon: 'Code2', order: 0, published: true, perks: ['React / Next.js', 'Node.js & Python', 'REST & GraphQL APIs', 'CI/CD pipelines'] },
  { id: '2', title: 'Cloud Solutions', shortDesc: 'Scalable AWS, Azure & Google Cloud infrastructure.', details: 'From cloud migrations to multi-region deployments, we architect resilient, cost-efficient cloud systems that scale with your business.', color: '#818cf8', icon: 'Cloud', order: 1, published: true, perks: ['AWS / Azure / GCP', 'Kubernetes & Docker', 'Cost optimisation', 'High availability'] },
  { id: '3', title: 'AI & Machine Learning', shortDesc: 'Intelligent systems that learn and evolve.', details: 'Custom ML models, NLP solutions, computer vision pipelines, and AI-powered automation tools that transform raw data into business value.', color: '#34d399', icon: 'Brain', order: 2, published: true, perks: ['LLM integration', 'Computer vision', 'Predictive analytics', 'Workflow automation'] },
  { id: '4', title: 'Cybersecurity', shortDesc: 'Enterprise-grade protection for your digital assets.', details: 'Penetration testing, security audits, SOC 2 compliance support, and 24/7 threat monitoring to keep your systems and data safe.', color: '#fb923c', icon: 'Shield', order: 3, published: true, perks: ['Penetration testing', 'SOC 2 compliance', 'Threat monitoring', 'Security audits'] },
  { id: '5', title: 'Mobile App Development', shortDesc: 'Beautiful, performant iOS & Android experiences.', details: 'Native and cross-platform apps built with React Native and Flutter. From MVP to enterprise apps, we deliver polished mobile experiences.', color: '#f472b6', icon: 'Smartphone', order: 4, published: true, perks: ['React Native', 'Flutter', 'App Store launch', 'Push & offline support'] },
  { id: '6', title: 'Digital Transformation', shortDesc: 'Modernize your entire business operations.', details: 'Strategic consulting and full-stack execution to migrate legacy systems, digitize workflows, and position your organization for the future.', color: '#fbbf24', icon: 'Zap', order: 5, published: true, perks: ['Legacy migration', 'Process automation', 'Change management', 'Training & support'] },
];

const steps = [
  { num: '01', label: 'Discover', desc: 'Deep-dive into your goals, users, and constraints.' },
  { num: '02', label: 'Design', desc: 'Wireframes, prototypes, and architecture blueprints.' },
  { num: '03', label: 'Build', desc: 'Sprint-based development with weekly demos.' },
  { num: '04', label: 'Launch', desc: 'Deploy, monitor, iterate. We stay on board.' },
];

/* ─── Helpers ───────────────────────────── */
function Particle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: 'rgba(105,200,228,0.15)' }}
      animate={{ y: [0, -28, 0], opacity: [0.15, 0.5, 0.15], scale: [1, 1.2, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Service Card ──────────────────────── */
function ServiceCard({ service, index }: { service: ServiceWithPerks; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = ICON_MAP[service.icon] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden cursor-pointer"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
      whileHover={{ y: -6, boxShadow: `0 20px 60px ${service.color}18` }}
      onClick={() => setOpen(!open)}
    >
      {/* Top accent line */}
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-t-3xl"
        style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{ background: `radial-gradient(ellipse 60% 50% at 20% 20%, ${service.color}0d, transparent 70%)` }}
      />

      <div className="p-8">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: `${service.color}18` }}
        >
          <Icon size={26} style={{ color: service.color }} />
        </motion.div>

        {/* Title + toggle */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-black text-[#1a2744] leading-snug">{service.title}</h3>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 mt-1">
            <ChevronDown size={16} className="text-gray-300" />
          </motion.div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-5">{service.shortDesc}</p>

        {/* Expanded */}
        <motion.div
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="text-gray-500 text-sm leading-relaxed mb-5 border-t border-gray-50 pt-5">
            {service.details}
          </p>
          {service.perks.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {service.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={13} style={{ color: service.color }} className="shrink-0" />
                  <span className="text-xs text-gray-400 font-medium">{perk}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Learn more */}
        <div className="flex items-center gap-2 mt-6 text-sm font-bold" style={{ color: service.color }}>
          {open ? 'Close' : 'Learn more'}
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────── */
export default function ServicesPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [services, setServices] = useState<ServiceWithPerks[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data: Service[]) => {
        if (data.length > 0) {
          // Map API data → ServiceWithPerks (perks extracted from details or empty)
          const mapped: ServiceWithPerks[] = data.map((s) => ({
            ...s,
            perks: [], // perks not stored in DB — add perks field to schema if needed
          }));
          setServices(mapped);
        } else {
          setServices(FALLBACK);
        }
      })
      .catch(() => setServices(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white overflow-hidden font-sans">
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#050d1f]" />
        <div className="absolute inset-0 opacity-50"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #1a4870 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 80%, #2d1b6e 0%, transparent 60%)' }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#69c8e4 1px, transparent 1px), linear-gradient(90deg, #69c8e4 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#69c8e4] animate-pulse" />
            <span className="text-white/60 text-sm tracking-widest uppercase">
              {loading ? 'Loading...' : `${services.length} Core Disciplines · Full-Stack Studio`}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tight"
          >
            Services Built
            <br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #69c8e4 0%, #818cf8 50%, #f472b6 100%)' }}>
              for Real Results
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 text-white/50 max-w-2xl mx-auto text-xl leading-relaxed"
          >
            We don't just deliver code — we deliver outcomes that move your business measurably forward.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a href="#services-grid"
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(105,200,228,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-[#69c8e4] to-[#505f88] text-white px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-2"
            >
              Explore Services <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#process"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/5 backdrop-blur-sm border border-white/15 text-white px-8 py-4 rounded-2xl font-bold text-base"
            >
              How We Work
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── SERVICES GRID ─────────────────── */}
      <section id="services-grid" className="py-32 max-w-7xl mx-auto px-6">
        <FadeUp className="text-center mb-16">
          <div className="inline-block bg-[#69c8e4]/10 text-[#69c8e4] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
            What We Offer
          </div>
          <h2 className="text-5xl font-black text-[#1a2744] leading-tight">
            Six disciplines,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]">
              one focused team.
            </span>
          </h2>
          <p className="mt-5 text-gray-400 max-w-xl mx-auto text-lg">
            Click any card to see exactly what's included.
          </p>
        </FadeUp>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 size={36} className="animate-spin text-[#69c8e4]" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── PROCESS ───────────────────────── */}
      <section id="process" className="py-24 bg-[#050d1f] overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#69c8e4 1px, transparent 1px), linear-gradient(90deg, #69c8e4 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: '#69c8e4', left: '-5%', top: '-10%' }} />
        <motion.div animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: '#818cf8', right: '-5%', bottom: '-10%' }} />

        <div className="relative max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <div className="inline-block bg-white/5 border border-white/10 text-white/50 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
              Our Process
            </div>
            <h2 className="text-5xl font-black text-white">How We Work</h2>
          </FadeUp>

          <div className="grid md:grid-cols-4 gap-0 relative">
            <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#69c8e4]/20 via-[#818cf8]/40 to-[#69c8e4]/20" />
            {steps.map((step, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div className="relative text-center px-4">
                  <motion.div
                    whileInView={{ scale: [0, 1.15, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.3, duration: 0.5 }}
                    className="w-[72px] h-[72px] rounded-full border-2 border-[#69c8e4]/30 bg-[#050d1f] flex items-center justify-center mx-auto mb-6 relative z-10"
                    style={{ boxShadow: '0 0 30px rgba(105,200,228,0.1)' }}
                  >
                    <span className="text-transparent bg-clip-text font-black text-xl"
                      style={{ backgroundImage: 'linear-gradient(135deg, #69c8e4, #818cf8)' }}>
                      {step.num}
                    </span>
                  </motion.div>
                  <h3 className="text-white font-black text-xl mb-3">{step.label}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────── */}
      <section className="py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <FadeUp>
          <div className="inline-block bg-[#505f88]/10 text-[#505f88] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6">
            Why BackByte
          </div>
          <h2 className="text-5xl font-black text-[#1a2744] leading-tight mb-8">
            We treat your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]">
              problem as our own.
            </span>
          </h2>

          {[
            { title: 'No black boxes', desc: 'Weekly demos, shared roadmaps, full code ownership. Always.' },
            { title: 'Outcome-focused', desc: 'We measure success by your business metrics, not story points.' },
            { title: 'Embedded engineers', desc: 'Your Slack, your standups, your culture — we integrate fully.' },
            { title: 'Long-term partners', desc: '70% of clients return for a second engagement within 6 months.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#69c8e4]/20 to-[#505f88]/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={18} className="text-[#69c8e4]" />
              </div>
              <div>
                <p className="font-black text-[#1a2744] text-base">{item.title}</p>
                <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="relative h-[420px]">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 left-0 right-16 bg-white rounded-3xl p-7 shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-3 h-3 rounded-full bg-[#69c8e4]" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sprint Progress</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Auth & Onboarding', pct: 100, color: '#69c8e4' },
                  { label: 'Dashboard UI', pct: 78, color: '#818cf8' },
                  { label: 'API Integration', pct: 55, color: '#34d399' },
                ].map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500 font-medium">{bar.label}</span>
                      <span className="text-xs font-bold" style={{ color: bar.color }}>{bar.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: bar.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-0 right-0 left-16 bg-[#050d1f] rounded-3xl p-6 border border-white/10"
            >
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-3">Client Feedback</p>
              <p className="text-white/80 text-sm leading-relaxed italic">
                "BackByte delivered in 8 weeks what our previous agency couldn't in 6 months. They get it."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#69c8e4] to-[#505f88] flex items-center justify-center text-white text-xs font-bold">JR</div>
                <div>
                  <p className="text-white text-xs font-bold">James R.</p>
                  <p className="text-white/30 text-xs">CTO, Finova Labs</p>
                </div>
              </div>
            </motion.div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}