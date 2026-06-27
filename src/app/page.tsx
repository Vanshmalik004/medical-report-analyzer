"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "var(--bg-primary)"
    }}>
      {/* Header Navbar */}
      <header style={{
        height: "70px",
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--primary-color)", fontSize: "1.5rem", fontWeight: "bold" }}>✚</span>
          <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--primary-color)", letterSpacing: "-0.5px" }}>
            dooper <span style={{ fontWeight: "300", color: "var(--text-primary)" }}>health</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/login" className="btn btn-secondary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
            Log In
          </Link>
          <Link href="/register" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto"
      }} className="animate-fade-in">
        <span style={{
          backgroundColor: "var(--secondary-color)",
          color: "var(--primary-color)",
          fontWeight: 700,
          fontSize: "0.8rem",
          padding: "0.35rem 1rem",
          borderRadius: "var(--radius-full)",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "1.5rem"
        }}>
          Smart AI Diagnostics
        </span>

        <h1 style={{
          fontSize: "3rem",
          fontWeight: 900,
          lineHeight: 1.15,
          color: "var(--text-primary)",
          marginBottom: "1.5rem",
          letterSpacing: "-1px"
        }}>
          Analyze your Medical Reports with <span style={{ color: "var(--primary-color)" }}>AI Precision</span>
        </h1>

        <p style={{
          fontSize: "1.15rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: "2.5rem",
          maxWidth: "600px"
        }}>
          Upload blood counts, metabolic panels, thyroid summaries, or liver tests. Get instant biomarker explanations, severity scores, and clinical summaries in Dooper's state-of-the-art diagnostic portal.
        </p>

        <div style={{ display: "flex", gap: "1.25rem" }}>
          <Link href="/register" className="btn btn-primary" style={{ padding: "0.9rem 2rem", fontSize: "1rem", borderRadius: "var(--radius-md)" }}>
            Get Started Free
          </Link>
          <Link href="/login" className="btn btn-secondary" style={{ padding: "0.9rem 2rem", fontSize: "1rem", borderRadius: "var(--radius-md)" }}>
            Log In Dashboard
          </Link>
        </div>

        {/* Feature Cards list */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          marginTop: "5rem",
          width: "100%",
          maxWidth: "900px"
        }}>
          <div className="card" style={{ padding: "1.5rem", textAlign: "left" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🤖</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>AI Biomarker Parsing</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
              Instantly converts medical readings from PDF or scanned images into structured digital databases.
            </p>
          </div>

          <div className="card" style={{ padding: "1.5rem", textAlign: "left" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📈</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Historical Trends</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
              Track blood sugar, cholesterol, or vitamin parameters across past reports to monitor your health progress.
            </p>
          </div>

          <div className="card" style={{ padding: "1.5rem", textAlign: "left" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔊</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Voice summaries</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
              Listen to a clear spoken-audio summary of your clinical assessment at the click of a button.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-muted)",
        fontSize: "0.8rem"
      }}>
        © 2026 Dooper Health Technology Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
}
