'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/#contact' },
    { name: 'Pricing', href: '/pricing' },

];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // ✅ optimized scroll listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const transparent = isHome && !isScrolled;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#69c8e4]/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/">
          <div className="hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.png"
              alt="Logo"
              width={180}
              height={40}
              className="object-contain"
            />
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isPricing = link.href === '/pricing';

            return (
              <div key={link.name}>
                <Link
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${
                      isPricing
                        ? 'bg-[#69c8e4] text-white hover:bg-[#4fb7d6] shadow-md'
                        : isActive
                        ? 'text-[#69c8e4]'
                        : transparent
                        ? 'text-black hover:text-[#69c8e4]'
                        : 'text-[#505f88] hover:text-[#69c8e4]'
                    }
                  `}
                >
                  {link.name}
                </Link>
              </div>
            );
          })}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 rounded-xl ${
            transparent ? 'text-white' : 'text-[#505f88]'
          }`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU (lightweight - no height animation) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-[#69c8e4]/20">
          <div className="px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isPricing = link.href === '/pricing';

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    px-4 py-3 rounded-xl font-semibold transition-all
                    ${
                      isPricing
                        ? 'bg-[#69c8e4] text-white text-center'
                        : isActive
                        ? 'text-[#69c8e4]'
                        : 'text-black hover:text-[#69c8e4]'
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </motion.nav>
  );
}