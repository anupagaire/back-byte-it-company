'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle,Globe,Award,Users,} from 'lucide-react';
import Image from 'next/image';
const stats = [
  { number: 65, suffix: '+', label: 'Projects Delivered', icon: CheckCircle },
  { number: 42, suffix: '', label: 'Happy Clients', icon: Users },
  { number: 7, suffix: '', label: 'Countries Served', icon: Globe },
  { number: 1, suffix: '+', label: 'Years Experience', icon: Award },
];

const highlights = [
  'Agile development with weekly sprints',
  'Dedicated project manager for every client',
  'Post-launch support & maintenance',
  '100% transparency in billing & progress',
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-black text-[#1a2744]">
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="py-8 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl font-black text-[#1a2744] leading-tight mb-6">
              We don't just build software.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]">
                We build futures.
              </span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Founded with a passion for innovation, Back ByteTech combines
              cutting-edge technology with human-centered design to deliver
              exceptional digital experiences that move the needle.
            </p>

            <ul className="space-y-3">
              {highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-gray-600 font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-[#69c8e4]/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={13} className="text-[#69c8e4]" />
                  </span>
                  {h}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#69c8e4]/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#505f88]/10 blur-3xl" />               
 <Image src="/team.png" alt="Team" width={300} height={200} className="object-cover rounded-lg mt-4 mx-auto" />

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-xl border border-gray-100 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Client Satisfaction</p>
                <p className="text-sm font-bold text-[#1a2744]">98.7% Rating</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-[#69c8e4]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#69c8e4]/20 to-[#505f88]/20 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-[#505f88]" />
                </div>
                <Counter end={stat.number} suffix={stat.suffix} />
                <p className="text-gray-500 text-sm mt-2 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}