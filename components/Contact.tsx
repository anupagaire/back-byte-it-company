'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@Back Bytetech.com', href: 'mailto:hello@Back Bytetech.com' },
  { icon: Phone, label: 'Phone', value: '+977 (555) 000-0000', href: 'tel:+9775550000000' },
  { icon: MapPin, label: 'Office', value: 'Kathmandu, Nepal', href: '#' },
];

const services = [
  { value: '', label: 'Select a Service' },
  { value: 'software', label: 'Custom Software Development' },
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'cloud', label: 'Cloud Solutions' },
  { value: 'mobile', label: 'Mobile App Development' },
  { value: 'security', label: 'Cybersecurity' },
  { value: 'other', label: 'Other / Not sure yet' },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', service: '', message: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch('/api/contact/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        company: form.company,
        service: form.service,
        message: form.message,
      }),
    });

    const data = await res.json();
    console.log('Response:', data);

    if (res.ok) {
      toast.success("Message sent! We'll respond within 24 hours. 🎉");
      setForm({ name: '', email: '', company: '', service: '', message: '' });
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } catch {
    toast.error("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#1a2744] placeholder-gray-400 focus:outline-none focus:border-[#69c8e4] focus:ring-2 focus:ring-[#69c8e4]/20 transition-all duration-200 text-sm font-medium';

  return (
    <section id="contact" className="py-8 bg-gray-50 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#69c8e4]/10 blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#505f88]/10 blur-3xl translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#69c8e4]/10 text-[#69c8e4] text-sm font-semibold mb-6 border border-[#69c8e4]/20"
          >
            Get In Touch
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-[#1a2744] mb-4"
          >
            Let's Build Something{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69c8e4] to-[#505f88]">
              Great
            </span>
          </motion.h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Tell us about your project — we respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left: info panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-[#1a2744] to-[#505f88] rounded-3xl p-8 text-white">
              <h3 className="text-xl font-black mb-2">Contact Information</h3>
              <p className="text-white/60 text-sm mb-8">
                Reach out through any channel — we're always available.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={i}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#69c8e4]/30 transition-colors">
                        <Icon size={18} className="text-[#69c8e4]" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wide">{item.label}</p>
                        <p className="text-white font-semibold">{item.value}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Response time badge */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/80 text-sm font-semibold">
                    Average response: <span className="text-[#69c8e4]">4 hours</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Name Surname"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    placeholder="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Corporation"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Service Needed *
                </label>
                <select
                  value={form.service}
                  onChange={(e) => update('service', e.target.value)}
                  required
                  className={inputClass}
                >
                  {services.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Project Details *
                </label>
                <textarea
                  placeholder="Tell us about your project, timeline, and any specific requirements..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#69c8e4] to-[#505f88] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-60 hover:shadow-lg hover:shadow-[#69c8e4]/25 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}