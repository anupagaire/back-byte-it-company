'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Cloud, Brain, Shield, Smartphone, Zap, Code2,
  Globe, Database, BarChart2, Lock, Layers, Settings,
  ArrowRight, Loader2,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Cloud, Brain, Shield, Smartphone, Zap,
  Globe, Database, BarChart2, Lock, Layers, Settings,
};

interface Service {
  id: string;
  title: string;
  shortDesc: string;
  details: string;
  image?: string;
  color: string;
  icon: string;
  order: number;
  published: boolean;
}

const FALLBACK: Service[] = [
  {
    id: '1', title: 'Custom Software', shortDesc: 'Tailor-made solutions for your business.',
    details: 'We architect and build scalable software from scratch — APIs, dashboards, and full-stack apps engineered for performance and growth.',
    color: '#69c8e4', icon: 'Code2', order: 0, published: true,
  },
  {
    id: '2', title: 'Cloud Solutions', shortDesc: 'Scalable AWS, Azure & Google Cloud infrastructure.',
    details: 'From cloud migrations to multi-region deployments, we architect resilient, cost-efficient cloud systems that scale with your business.',
    color: '#505f88', icon: 'Cloud', order: 1, published: true,
  },
  {
    id: '3', title: 'AI & Machine Learning', shortDesc: 'Intelligent systems that learn and evolve.',
    details: 'Custom ML models, NLP solutions, computer vision pipelines, and AI-powered automation tools that transform raw data into business value.',
    color: '#6366f1', icon: 'Brain', order: 2, published: true,
  },
];

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data: Service[]) => {
        setServices(data.length > 0 ? data : FALLBACK);
      })
      .catch(() => setServices(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-[#1a2744] leading-tight mb-5"
          >
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
            className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto"
          >
            We don't just deliver code — we deliver outcomes that move your business forward.
          </motion.p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#69c8e4]" size={36} />
          </div>
        )}

        {/* Cards grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = ICON_MAP[service.icon] || Code2;
              const isHovered = hovered === i;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="group rounded-3xl overflow-hidden cursor-default flex flex-col"
                  style={{
                    background: '#fff',
                    boxShadow: isHovered
                      ? `0 24px 60px ${service.color}30, 0 4px 20px rgba(0,0,0,0.08)`
                      : '0 2px 16px rgba(0,0,0,0.06)',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                    border: `1.5px solid ${isHovered ? service.color + '40' : '#f0f0f0'}`,
                  }}
                >
                  {/* ── IMAGE SECTION ── */}
                  <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>

                    {/* Image or fallback gradient */}
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${service.color}30 0%, ${service.color}60 50%, #1a2744 100%)`,
                        }}
                      />
                    )}

                    {/* Dark overlay — always present, deepens on hover */}
                    <div
                      className="absolute inset-0 transition-opacity duration-400"
                      style={{
                        background: `linear-gradient(to top, rgba(10,15,30,0.85) 0%, rgba(10,15,30,0.35) 50%, rgba(10,15,30,0.1) 100%)`,
                        opacity: isHovered ? 1 : 0.75,
                      }}
                    />

                    {/* Icon badge — top left */}
                    <div
                      className="absolute top-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${service.color}30`, border: `1.5px solid ${service.color}60` }}
                    >
                      <Icon size={20} style={{ color: service.color }} />
                    </div>

                    {/* Title over image */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-xl leading-tight drop-shadow-md">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* ── CONTENT SECTION ── */}
                  <div className="flex flex-col flex-1 p-6 pt-5">
                    {/* Description — toggles on hover */}
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 transition-all duration-300">
                      {isHovered ? service.details : service.shortDesc}
                    </p>

                    
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

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