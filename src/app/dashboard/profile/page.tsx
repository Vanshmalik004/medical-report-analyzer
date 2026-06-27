"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/dashboard.module.css";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  reportsCount: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user profile details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="animate-spin" style={{ fontSize: "2rem" }}>⏳</div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card flex-center" style={{ padding: "3rem", color: "var(--critical-color)" }}>
        <p>⚠️ Failed to load profile details. Please log in again.</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
      {/* Profile Overview Card */}
      <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "2.5rem" }}>
        <div 
          className={styles.userAvatar} 
          style={{ width: "90px", height: "90px", fontSize: "2.5rem", marginBottom: "1.5rem", borderRadius: "var(--radius-full)", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
        >
          {getInitials(user.name)}
        </div>
        
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>{user.name}</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>{user.email}</p>
        
        <div style={{ width: "100%", height: "1px", backgroundColor: "var(--border-color)", margin: "1.5rem 0" }} />
        
        <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-color)" }}>{user.reportsCount}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Reports</div>
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--success-color)" }}>Active</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Status</div>
          </div>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="card" style={{ padding: "2.5rem" }}>
        <h3 className={styles.sectionTitle} style={{ borderBottom: "2px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>
          Account Details
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
            <span style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.9rem" }}>User Name</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{user.name}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
            <span style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.9rem" }}>Email Address</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{user.email}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
            <span style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.9rem" }}>Patient ID</span>
            <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--text-muted)", fontSize: "0.85rem" }}>{user.id}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
            <span style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.9rem" }}>Joined Date</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
            <span style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.9rem" }}>Health Tier</span>
            <div>
              <span className="badge badge-normal" style={{ fontWeight: 700 }}>
                Standard Tier
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
