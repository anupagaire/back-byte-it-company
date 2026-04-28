import AdminSidebar from '@/components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 w-full bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
}