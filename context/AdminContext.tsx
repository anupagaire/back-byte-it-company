'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AdminContextType = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <AdminContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};