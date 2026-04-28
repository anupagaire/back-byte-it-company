'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';

const categories = ['All', 'Web App', 'Mobile', 'AI/ML', 'Cloud'];

const projects = [
  {
    title: 'FinFlow Analytics',
    category: 'Web App',
    tech: ['Next.js', 'PostgreSQL', 'TailwindCSS'],
    desc: 'Real-time financial dashboard for a leading fintech startup with 50k+ daily active users.',
    color: '#69c8e4',
    emoji: '📊',
  },
  {
    title: 'MediAssist AI',
    category: 'AI/ML',
    tech: ['Python', 'TensorFlow', 'FastAPI'],
    desc: 'AI-powered medical imaging tool that reduced diagnostic time by 60% for hospital chains.',
    color: '#505f88',
    emoji: '🧠',
  },
  {
    title: 'LogiTrack Mobile',
    category: 'Mobile',
    tech: ['React Native', 'Node.js', 'Redis'],
    desc: 'Cross-platform logistics tracking app with real-time GPS and 99.9% uptime SLA.',
    color: '#69c8e4',
    emoji: '📦',
  },
  {
    title: 'CloudOps Platform',
    category: 'Cloud',
    tech: ['AWS', 'Terraform', 'Kubernetes'],
    desc: 'Multi-region cloud orchestration platform reducing infrastructure cost by 42%.',
    color: '#505f88',
    emoji: '☁️',
  },
  {
    title: 'EduLearn LMS',
    category: 'Web App',
    tech: ['React', 'Django', 'AWS S3'],
    desc: 'Online learning platform serving 200,000 students across 15 countries.',
    color: '#69c8e4',
    emoji: '🎓',
  },
  {
    title: 'ScanSmart Vision',
    category: 'AI/ML',
    tech: ['OpenCV', 'PyTorch', 'Docker'],
    desc: 'Computer vision system for manufacturing QA — 99.2% defect detection accuracy.',
    color: '#505f88',
    emoji: '🔍',
  },
];

export default function Projects() {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-[#1a2744] mb-4"
          >
            Projects We're{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]">
              Proud Of
            </span>
          </motion.h2>
        </div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                active === cat
                  ? 'bg-gradient-to-r from-[#69c8e4] to-[#505f88] text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="group bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 cursor-default"
            >
              {/* Emoji icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${project.color}15` }}
              >
                {project.emoji}
              </div>

              {/* Category badge */}
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                style={{
                  background: `${project.color}15`,
                  color: project.color,
                }}
              >
                {project.category}
              </span>

              <h3 className="text-xl font-black text-[#1a2744] mb-3">
                {project.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {project.desc}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}