'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  Briefcase,
  Settings,
  Users,
} from 'lucide-react';

const items = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Services', href: '/admin/services', icon: Mail },
  { name: 'Contacts', href: '/admin/contact', icon: Mail },
  { name: 'Careers', href: '/admin/careers', icon: Briefcase },
  { name: 'Applications', href: '/admin/applications', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-[#0f172a] text-white p-6 fixed shadow-xl">

      <h1 className="text-2xl font-black mb-10 text-[#69c8e4]">
        BackByte Admin
      </h1>

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active
                  ? 'bg-[#69c8e4] text-black font-bold'
                  : 'hover:bg-white/10'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-6 text-xs text-gray-400">
        v1.0 Admin System
      </div>
    </div>
  );
}