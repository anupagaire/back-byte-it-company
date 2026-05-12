'use client'; // ← add gara

import AdminSidebar from '@/components/admin-sidebar';
import AdminTopbar from '@/components/admintopbar';
import { AdminProvider } from '@/context/AdminContext';
import { useAdmin } from '@/context/AdminContext';

// Inner layout as client component
function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useAdmin();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar onMenuClick={toggleSidebar} /> {/* ← connected! */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1150px] mx-auto px-4 md:px-6 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}