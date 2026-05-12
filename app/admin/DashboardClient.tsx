"use client";

import Link from "next/link";

interface Stats {
  totalContacts: number;
  totalCareers: number;
  totalJobs: number;
  totalApplications: number;
  pendingApplications: number;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  service?: string | null;
  message: string;
  createdAt: string;
}

interface Application {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  job: { title: string };
}

interface Props {
  adminName: string;
  stats: Stats;
  recentContacts: Contact[];
  recentApplications: Application[];
}

function StatCard({
  label,
  value,
  icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          transition: "box-shadow 0.2s, transform 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.72rem",
              color: "#6b7280",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1,
            }}
          >
            {value}
          </p>
        </div>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "#fef3c7", text: "#92400e" },
    reviewed: { bg: "#dbeafe", text: "#1e40af" },
    accepted: { bg: "#d1fae5", text: "#065f46" },
    rejected: { bg: "#fee2e2", text: "#991b1b" },
  };
  const c = colors[status] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "0.72rem",
        fontWeight: 600,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardClient({
  adminName,
  stats,
  recentContacts,
  recentApplications,
}: Props) {
  const statCards = [
    { label: "Total Contacts", value: stats.totalContacts, icon: "✉️", color: "#ede9fe", href: "/admin/contact" },
    { label: "Job Listings", value: stats.totalJobs, icon: "💼", color: "#dbeafe", href: "/admin/jobs" },
    { label: "Applications", value: stats.totalApplications, icon: "📋", color: "#d1fae5", href: "/admin/applications" },
    { label: "Pending Review", value: stats.pendingApplications, icon: "⏳", color: "#fef3c7", href: "/admin/applications" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: "1200px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .tables-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .stat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }

        @media (min-width: 1024px) {
          .stat-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .tables-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 767px) {
          .tables-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            Good day, {adminName} 👋
          </h1>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.875rem" }}>
            Here's what's happening across your platform
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Tables */}
      <div className="tables-grid">
        {/* Recent Contacts */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#111827" }}>
              Recent Contacts
            </h2>
            <Link
              href="/admin/contact"
              style={{ fontSize: "0.8rem", color: "#6366f1", textDecoration: "none", fontWeight: 500 }}
            >
              View all →
            </Link>
          </div>
          <div>
            {recentContacts.length === 0 ? (
              <p style={{ padding: "1.5rem", color: "#9ca3af", fontSize: "0.875rem", margin: 0 }}>
                No contacts yet
              </p>
            ) : (
              recentContacts.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    padding: "0.875rem 1.25rem",
                    borderBottom: i < recentContacts.length - 1 ? "1px solid #f9fafb" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "#ede9fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#7c3aed",
                      flexShrink: 0,
                    }}
                  >
                    {c.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
                      {c.name}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.email}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#9ca3af", flexShrink: 0 }}>
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#111827" }}>
              Recent Applications
            </h2>
            <Link
              href="/admin/applications"
              style={{ fontSize: "0.8rem", color: "#6366f1", textDecoration: "none", fontWeight: 500 }}
            >
              View all →
            </Link>
          </div>
          <div>
            {recentApplications.length === 0 ? (
              <p style={{ padding: "1.5rem", color: "#9ca3af", fontSize: "0.875rem", margin: 0 }}>
                No applications yet
              </p>
            ) : (
              recentApplications.map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    padding: "0.875rem 1.25rem",
                    borderBottom: i < recentApplications.length - 1 ? "1px solid #f9fafb" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "#d1fae5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#065f46",
                      flexShrink: 0,
                    }}
                  >
                    {a.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
                      {a.name}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.job.title}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}