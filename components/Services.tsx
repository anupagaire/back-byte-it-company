'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Cloud,
  Brain,
  Shield,
  Smartphone,
  Zap,
  Code2,
  ArrowRight,
} from 'lucide-react';

const services = [
  {
    icon: Code2,
    title: 'Custom Software Development',
    shortDesc: 'Bespoke applications built for your exact needs.',
    details:
      'End-to-end development from architecture to deployment. We build scalable, maintainable web and desktop applications using React, Next.js, Node.js, Python, and more.',
    color: '#69c8e4',
    bg: 'from-[#69c8e4]/10 to-transparent',
    border: 'border-[#69c8e4]/30',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    shortDesc: 'Scalable AWS, Azure & Google Cloud infrastructure.',
    details:
      'From cloud migrations to multi-region deployments, we architect resilient, cost-efficient cloud systems that scale with your business.',
    color: '#505f88',
    bg: 'from-[#505f88]/10 to-transparent',
    border: 'border-[#505f88]/30',
  },
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    shortDesc: 'Intelligent systems that learn and evolve.',
    details:
      'Custom ML models, NLP solutions, computer vision pipelines, and AI-powered automation tools that transform raw data into business value.',
    color: '#69c8e4',
    bg: 'from-[#69c8e4]/10 to-transparent',
    border: 'border-[#69c8e4]/30',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    shortDesc: 'Enterprise-grade protection for your digital assets.',
    details:
      'Penetration testing, security audits, SOC 2 compliance support, and 24/7 threat monitoring to keep your systems and data safe.',
    color: '#505f88',
    bg: 'from-[#505f88]/10 to-transparent',
    border: 'border-[#505f88]/30',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    shortDesc: 'Beautiful, performant iOS & Android experiences.',
    details:
      'Native and cross-platform apps built with React Native and Flutter. From MVP to enterprise apps, we deliver polished mobile experiences.',
    color: '#69c8e4',
    bg: 'from-[#69c8e4]/10 to-transparent',
    border: 'border-[#69c8e4]/30',
  },
  {
    icon: Zap,
    title: 'Digital Transformation',
    shortDesc: 'Modernize your entire business operations.',
    details:
      'Strategic consulting and full-stack execution to migrate legacy systems, digitize workflows, and position your organization for the future.',
    color: '#505f88',
    bg: 'from-[#505f88]/10 to-transparent',
    border: 'border-[#505f88]/30',
  },
];

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="services" className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
                       className="text-5xl font-black text-[#1a2744] leading-tight mb-6">
            Services Built for
            <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]">
              Real Results
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-xl mx-auto"
          >
            We don't just deliver code — we deliver outcomes that move your business forward.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isHovered = hovered === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative group p-8 rounded-3xl border-2 bg-gradient-to-br ${service.bg} ${service.border} cursor-default transition-all duration-300 overflow-hidden`}
                style={{
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isHovered
                    ? `0 20px 50px ${service.color}25`
                    : '0 0 0 transparent',
                }}
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${service.color}15, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${service.color}20` }}
                >
                  <Icon size={26} style={{ color: service.color }} />
                </div>

                <h3 className="text-xl font-bold text-[#1a2744] mb-3">
                  {service.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {isHovered ? service.details : service.shortDesc}
                </p>

                <div
                  className="flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                  style={{ color: service.color }}
                >
                  Learn more
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#69c8e4] to-[#505f88] text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-[#69c8e4]/30 hover:shadow-xl transition-all duration-300"
          >
            Start a Project
            <ArrowRight size={20} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}