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

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data: Service[]) => {
        setServices(data);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const visibleServices = showAll ? services : services.slice(0, 6);

  return (
    <section className="py-12 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-black text-[#1a2744] mb-4">
            Services Built for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]">
              Real Results
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We don't just deliver code — we deliver outcomes that move your business forward.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#69c8e4]" size={36} />
          </div>
        )}

        {/* Services */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {visibleServices.map((service, i) => {
                const Icon = ICON_MAP[service.icon] || Code2;
                const isHovered = hovered === i;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="rounded-3xl overflow-hidden flex flex-col bg-white transition-all duration-300"
                    style={{
                      transform: isHovered ? 'translateY(-6px)' : '',
                      boxShadow: isHovered
                        ? `0 20px 50px ${service.color}30`
                        : '0 4px 18px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* IMAGE */}
                    <div className="relative h-[200px] overflow-hidden">
                      {service.image ? (
                        <img
                          src={service.image}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            background: `linear-gradient(135deg, ${service.color}, #1a2744)`
                          }}
                        />
                      )}

                      <div className="absolute inset-0 bg-black/40" />

                      {/* ICON */}
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-xl">
                        <Icon size={20} color="white" />
                      </div>

                      {/* TITLE */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-lg font-bold">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-gray-500 text-sm">
                        {isHovered ? service.details : service.shortDesc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* SEE ALL BUTTON */}
            {services.length > 6 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#69c8e4] to-[#505f88] hover:scale-105 transition"
                >
                  {showAll ? 'Show Less' : 'See All Services'}
                </button>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-16">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#1a2744] text-white rounded-xl hover:scale-105 transition"
          >
            Start a Project <ArrowRight size={18} />
          </a>
        </div>

      </div>
    </section>
  );
}