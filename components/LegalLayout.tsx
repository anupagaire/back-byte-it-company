import { ReactNode } from 'react';
import Link from 'next/link';

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
];

export default function LegalLayout({ children, title, lastUpdated }: { children: ReactNode, title: string, lastUpdated: string }) {
  return (
    <div className="bg-white min-h-screen pt-16 md:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Mobile Navigation - Horizontal Scroll */}
        <div className="lg:hidden mb-8 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar flex gap-6 whitespace-nowrap">
          {legalLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-[#69c8e4] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Desktop Sidebar - Hidden on Mobile */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Legal Documents</h3>
              <nav className="flex flex-col gap-4">
                {legalLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="text-gray-600 hover:text-[#69c8e4] font-medium transition-colors border-l-2 border-transparent hover:border-[#69c8e4] pl-4"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-3 max-w-3xl">
            <div className="mb-10">
              <h1 className="text-3xl md:text-5xl font-black text-black mb-4 leading-tight">
                {title}
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#69c8e4]"></span>
                <p className="text-gray-500 text-xs md:text-sm font-medium">Last Updated: {lastUpdated}</p>
              </div>
            </div>
            
            {/* Prose wrapper for better text styling */}
            <article className="prose prose-sm md:prose-base prose-blue prose-headings:text-black prose-p:text-gray-600 prose-li:text-gray-600 max-w-none">
              {children}
            </article>
          </main>

        </div>
      </div>
    </div>
  );
}