'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  tech: string[];
  desc: string;
  color: string;
  emoji: string;
  githubUrl?: string;
  liveUrl?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        const cats = ['All', ...Array.from(new Set(data.map((p) => p.category)))];
        setCategories(cats);
      })
      .catch(console.error);
  }, []);

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

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
              key={project.id}
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
                style={{ background: `${project.color}15`, color: project.color }}
              >
                {project.category}
              </span>

              <h3 className="text-xl font-black text-[#1a2744] mb-3">{project.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{project.desc}</p>

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

              {/* Links */}
              {(project.githubUrl || project.liveUrl) && (
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1a2744] transition-colors font-medium"
                    >
                      <Github size={13} /> GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#69c8e4] transition-colors font-medium"
                    >
                      <ExternalLink size={13} /> Live Demo
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}