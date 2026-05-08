import AdminSidebar from '@/components/admin-sidebar';
import AdminTopbar from '@/components/admintopbar';
import { AdminProvider } from '@/context/AdminContext';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-auto">
            <div className="max-w-[1150px] mx-auto px-4 md:px-6 py-6 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}