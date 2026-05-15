'use client';

import { motion } from 'framer-motion';
import {  Linkedin, Twitter, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; 

const footerLinks = {
  Services: [
    { name: 'Custom Software', href: '/services/software' },
    { name: 'Cloud Solutions', href: '/services/cloud' },
    { name: 'AI & ML', href: '/services/ai-ml' },
    { name: 'Cybersecurity', href: '/services/cybersecurity' },
    { name: 'Mobile Apps', href: '/services/mobile' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/#contact' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { Icon: Twitter, href: 'https://twitter.com/backbyte' },
  { Icon: Linkedin, href: 'https://linkedin.com/company/backbyte' },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#69c8e4] text-black">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="Back ByteTech Logo" 
                width={150} 
                height={50} 
                className="mb-6 cursor-pointer" 
              />
            </Link>
            <p className="text-black text-sm leading-relaxed max-w-xs mb-6">
              Innovative IT solutions that transform businesses into digital leaders. 
              From idea to production, we've got you covered.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank" // Opens social media in new tab
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-xl border border-black/20 flex items-center justify-center text-black/80 hover:bg-black hover:text-white transition-all"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-black uppercase tracking-widest mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-black/60 hover:text-black transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-black text-sm">
            © {new Date().getFullYear()} Back ByteTech. All rights reserved.
          </p>
          <motion.button
            onClick={scrollTop}
            whileHover={{ scale: 1.1, y: -2 }}
            className="flex items-center gap-2 text-xs text-black/50 hover:text-black font-bold transition-colors"
          >
            Back to top
            <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}