// app/admin/page.tsx
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  const [
    totalContacts,
    totalCareers,
    totalJobs,
    totalApplications,
    pendingApplications,
    recentContacts,
    recentApplications,
  ] = await Promise.all([
    prisma.contact.count(),
    prisma.career.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: "pending" } }),
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { job: { select: { title: true } } },
    }),
  ]);

  return (
    <DashboardClient
      adminName={session?.user?.name || "Admin"}
      stats={{
        totalContacts,
        totalCareers,
        totalJobs,
        totalApplications,
        pendingApplications,
      }}
      recentContacts={recentContacts.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      }))}
      recentApplications={recentApplications.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      }))}
    />
  );
}