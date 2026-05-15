'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { 
  LayoutDashboard, 
  Mail, 
  Briefcase, 
  Settings, 
  Users, 
  X 
} from 'lucide-react';

const items = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Services', href: '/admin/services', icon: Mail },
  { name: 'Contacts', href: '/admin/contact', icon: Mail },
  { name: 'Careers', href: '/admin/careers', icon: Briefcase },
  { name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { name: 'Teams', href: '/admin/team', icon: Users },
  { name: 'Pricing', href: '/admin/pricing-leads', icon: Briefcase },

  { name: 'Applications', href: '/admin/applications', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAdmin();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-[#0f172a] text-white p-6 shadow-2xl z-50
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static
      `}>
        
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-black text-[#69c8e4]">BackByte</h1>
          
          {/* Close button only for mobile */}
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={26} />
          </button>
        </div>

        <div className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (sidebarOpen) toggleSidebar(); // mobile ma matra close
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  active
                    ? 'bg-[#69c8e4] text-black font-semibold'
                    : 'hover:bg-white/10 text-gray-300'
                }`}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-8 text-xs text-gray-500 hidden md:block">
          v1.0 • Admin System
        </div>
      </div>
    </>
  );
}