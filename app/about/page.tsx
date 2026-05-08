'use client';

import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import Image from 'next/image';
import { Users, Target, Sparkles, Code2, Globe, Zap, CheckCircle2, Linkedin, Twitter, Github } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

/* ─── Types ─────────────────────────────────────────────── */
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo: string | null;
  linkedin: string | null;
  twitter: string | null;
  github: string | null;
}

/* ─── Animated Counter ─────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: 'easeOut',
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return controls.stop;
  }, [inView, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─── Floating Particle ─────────────────────────────────── */
function Particle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: 'rgba(105,200,228,0.15)' }}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

/* ─── Section Wrapper ─────────────────────────────────── */
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

/* ─── Team Member Card ───────────────────────────────────── */
function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const hasSocials = member.linkedin || member.twitter || member.github;

  return (
    <FadeUp delay={index * 0.08}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group bg-white border border-gray-100 rounded-3xl p-8 text-center cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
      >
        {/* Photo or Initials */}
        <div className="flex justify-center mb-4">
          {member.photo ? (
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-[#69c8e4]/30 transition-all">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#69c8e4]/20 to-[#505f88]/20 flex items-center justify-center text-[#505f88] font-black text-2xl ring-2 ring-gray-100 group-hover:ring-[#69c8e4]/30 transition-all">
              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <h4 className="font-black text-[#1a2744] text-lg">{member.name}</h4>
        <p className="text-[#69c8e4] text-sm font-semibold mt-0.5">{member.role}</p>

        {member.bio && (
          <p className="text-gray-400 text-xs mt-3 leading-relaxed line-clamp-2">{member.bio}</p>
        )}

        {/* Social links */}
        {hasSocials && (
          <div className="flex justify-center gap-2 pt-4 mt-3 border-t border-gray-100">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#69c8e4]/10 hover:text-[#69c8e4] cursor-pointer transition-colors"
              >
                <Linkedin size={14} />
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#69c8e4]/10 hover:text-[#69c8e4] cursor-pointer transition-colors"
              >
                <Twitter size={14} />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#69c8e4]/10 hover:text-[#69c8e4] cursor-pointer transition-colors"
              >
                <Github size={14} />
              </a>
            )}
          </div>
        )}
      </motion.div>
    </FadeUp>
  );
}

/* ─── Services ─────────────────────────────────── */
const services = [
  { icon: Code2, title: 'Custom Software', desc: 'Scalable applications built to your exact specifications.' },
  { icon: Globe, title: 'Web & Mobile', desc: 'Cross-platform products with stunning user experiences.' },
  { icon: Zap, title: 'AI Integration', desc: 'Intelligent features powered by cutting-edge ML models.' },
  { icon: Sparkles, title: 'UI/UX Design', desc: 'Research-driven design that converts and delights.' },
];

/* ─── Main Page ─────────────────────────────────── */
export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(setTeam)
      .catch(console.error)
      .finally(() => setTeamLoading(false));
  }, []);

  return (
    <div className="bg-white overflow-hidden font-sans">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/3.jpg" alt="Hero Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 z-10 bg-[#050d1f]/60" />
        <div className="absolute inset-0 opacity-50"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #1a4870 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 80%, #0d3d5e 0%, transparent 60%)' }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#69c8e4 1px, transparent 1px), linear-gradient(90deg, #69c8e4 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {[
          { delay: 0, x: '10%', y: '20%', size: 8 },
          { delay: 1, x: '85%', y: '15%', size: 12 },
          { delay: 2, x: '25%', y: '70%', size: 6 },
          { delay: 0.5, x: '70%', y: '65%', size: 10 },
          { delay: 1.5, x: '50%', y: '85%', size: 7 },
          { delay: 3, x: '40%', y: '30%', size: 5 },
          { delay: 2.5, x: '90%', y: '45%', size: 9 },
          { delay: 1.2, x: '5%', y: '55%', size: 11 },
        ].map((p, i) => <Particle key={i} {...p} />)}

        <motion.div
          className="absolute rounded-full border border-[#69c8e4]/10"
          style={{ width: 600, height: 600, left: '50%', top: '50%', x: '-50%', y: '-50%' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full border border-[#505f88]/10"
          style={{ width: 900, height: 900, left: '50%', top: '50%', x: '-50%', y: '-50%' }}
          animate={{ scale: [1.08, 1, 1.08], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#69c8e4] animate-pulse" />
            <span className="text-white/60 text-sm tracking-widest uppercase">Est. 2018 · Digital Innovation Studio</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tight"
          >
            We Build
            <br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #69c8e4 0%, #a78bfa 50%, #505f88 100%)' }}>
              Digital Futures
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 text-white/50 max-w-2xl mx-auto text-xl leading-relaxed"
          >
            A team of engineers, designers, and strategists crafting products
            that move the needle — from zero to scale.
          </motion.p>
        </motion.div>
      </section>

      {/* ── STORY ─────────────────────────────────────────── */}
      <section className="py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <FadeUp>
          <div className="inline-block bg-[#69c8e4]/10 text-[#69c8e4] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6">
            Our Story
          </div>
          <h2 className="text-5xl font-black text-[#1a2744] leading-tight mb-6">
            Technology that
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]"> empowers,</span>
            <br />not complicates.
          </h2>
          <p className="text-gray-500 leading-relaxed mb-4 text-lg">
            BackByte Technology was founded with a simple belief — the best software gets out of the way and lets people do their best work.
          </p>
          <p className="text-gray-500 leading-relaxed mb-8">
            From lean startups racing to market, to enterprises modernizing legacy systems — we've partnered with companies at every stage to design, build, and ship products that matter.
          </p>

          {['Product-first thinking', 'Transparent communication', 'Agile delivery cycles'].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 mb-3"
            >
              <CheckCircle2 size={18} className="text-[#69c8e4] shrink-0" />
              <span className="text-gray-600 font-medium">{item}</span>
            </motion.div>
          ))}
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20"
              style={{ background: 'linear-gradient(135deg, #69c8e4, #505f88)' }} />
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">
              <Image src="/team.png" alt="BackByte Team" width={600} height={480} className="w-full h-auto object-cover" />
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section className="py-4 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <h2 className="text-5xl font-black text-[#1a2744]">Built for impact</h2>
          </FadeUp>

          <div className="grid md:grid-cols-4 gap-5">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeUp key={i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(105,200,228,0.12)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-white p-7 rounded-3xl border border-gray-100 group cursor-pointer h-full"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#69c8e4]/15 to-[#505f88]/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Icon size={22} className="text-[#69c8e4]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1a2744] mb-2">{s.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section className="py-8 max-w-7xl mx-auto px-6">
        <FadeUp className="text-center mb-20">
          <h2 className="text-5xl font-black text-[#1a2744]">What drives us</h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: 'Precision', desc: 'We obsess over details because great products live in the margins. No shortcuts, no hand-waving.', color: '#69c8e4' },
            { icon: Users, title: 'Collaboration', desc: 'We embed with your team, attend your standups, and treat your problems as our own.', color: '#505f88' },
            { icon: Sparkles, title: 'Innovation', desc: 'Comfortable is boring. We constantly challenge assumptions and explore new ways to solve old problems.', color: '#a78bfa' },
          ].map((v, i) => {
            const Icon = v.icon;
            return (
              <FadeUp key={i} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative bg-white p-10 rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-all duration-500 -translate-y-8 translate-x-8"
                    style={{ background: v.color }} />
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `linear-gradient(135deg, ${v.color}40, ${v.color}20)` }}>
                    <Icon size={26} style={{ color: v.color }} />
                  </div>
                  <h3 className="text-2xl font-black text-[#1a2744] mb-3">{v.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{v.desc}</p>
                </motion.div>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <FadeUp className="text-center mb-16">
          <h2 className="text-5xl font-black text-[#1a2744]">Meet our team</h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Diverse minds united by a passion for building things that work beautifully.
          </p>
        </FadeUp>

        {teamLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-3xl h-56 animate-pulse" />
            ))}
          </div>
        ) : team.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Team members coming soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#050d1f]" />
        <div className="absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, #1a4870 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="text-[#69c8e4] font-bold tracking-widest uppercase text-sm mb-2">Ready to build?</p>
            <h2 className="text-6xl md:text-7xl font-black text-white leading-tight mb-2">
              Let's create
              <br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #69c8e4 0%, #a78bfa 100%)' }}>
                something great.
              </span>
            </h2>
            <p className="text-white/40 text-xl mb-4 max-w-xl mx-auto">
              Tell us about your project. We'll respond within 24 hours.
            </p>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}