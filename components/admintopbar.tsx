'use client';
import { useState } from 'react';
import { Menu, Settings, User } from 'lucide-react';

interface AdminTopbarProps {
  onMenuClick?: () => void;  // add ? to make it optional
}
export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-xl"
        >
          <Menu size={24} />
        </button>

        {/* Logo / Title */}
        <div className="flex items-center gap-2 md:hidden">
          <span className="text-xl font-black text-[#69c8e4]">BackByte</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-700">Good day, Admin 👋</p>
        </div>

        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
          <Settings size={20} />
        </button>

        <div className="w-8 h-8 bg-[#69c8e4] text-white rounded-full flex items-center justify-center font-semibold">
          A
        </div>
      </div>
    </div>
  );
}