"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    const res = await fetch("/api/admin/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    const data = await res.json();
    setProfileLoading(false);

    if (!res.ok) {
      setProfileMsg({ type: "error", text: data.error || "Failed to update profile" });
    } else {
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      await update({ name: profileData.name, email: profileData.email });
      router.refresh();
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    setPasswordLoading(true);

    const res = await fetch("/api/admin/update-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });

    const data = await res.json();
    setPasswordLoading(false);

    if (!res.ok) {
      setPasswordMsg({ type: "error", text: data.error || "Failed to update password" });
    } else {
      setPasswordMsg({ type: "success", text: "Password updated successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "0.9rem",
    color: "#111827",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.4rem",
  };

  function Alert({ msg }: { msg: { type: "success" | "error"; text: string } }) {
    return (
      <div style={{
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        fontSize: "0.875rem",
        marginBottom: "1rem",
        background: msg.type === "success" ? "#d1fae5" : "#fee2e2",
        color: msg.type === "success" ? "#065f46" : "#991b1b",
        border: `1px solid ${msg.type === "success" ? "#a7f3d0" : "#fecaca"}`,
      }}>
        {msg.text}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: "700px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
          Account Settings
        </h1>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.9rem" }}>
          Manage your admin profile and password
        </p>
      </div>

      {/* Profile Card */}
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "1.75rem",
        marginBottom: "1.5rem",
      }}>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem", paddingBottom: "1.75rem", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}>
            {(session?.user?.name || session?.user?.email || "A")[0].toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "#111827" }}>
              {session?.user?.name || "Admin"}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "0.875rem", color: "#6b7280" }}>
              {session?.user?.email}
            </p>
          </div>
        </div>

        <h2 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
          Update Profile
        </h2>

        {profileMsg && <Alert msg={profileMsg} />}

        <form onSubmit={handleProfileUpdate}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                style={inputStyle}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Your name"
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                style={inputStyle}
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="you@company.com"
                required
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            style={{
              padding: "0.7rem 1.5rem",
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: profileLoading ? "not-allowed" : "pointer",
              opacity: profileLoading ? 0.7 : 1,
            }}
          >
            {profileLoading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "1.75rem",
      }}>
        <h2 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
          Change Password
        </h2>

        {passwordMsg && <Alert msg={passwordMsg} />}

        <form onSubmit={handlePasswordUpdate}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                style={inputStyle}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                required
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password"
                  style={inputStyle}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Min. 8 characters"
                  required
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input
                  type="password"
                  style={inputStyle}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  required
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            style={{
              padding: "0.7rem 1.5rem",
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: passwordLoading ? "not-allowed" : "pointer",
              opacity: passwordLoading ? 0.7 : 1,
            }}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}