// app/admin/layout.tsx
import AdminSidebar from '@/components/admin-sidebar';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 w-full bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
}