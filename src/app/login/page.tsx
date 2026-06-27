"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/auth.module.css";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = searchParams.get("from") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard} animate-fade-in`}>
        <div className={styles.logoArea}>
          <span style={{ color: "var(--primary-color)", fontSize: "1.75rem", fontWeight: "bold" }}>✚</span>
          <span className={styles.logoText}>dooper <span style={{ fontWeight: "300", color: "var(--text-primary)" }}>health</span></span>
        </div>
        
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to access your medical dashboard and analyze reports</p>
        
        {error && (
          <div className={`${styles.alertMessage} ${styles.alertError}`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              className={styles.input}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., alex@dooper.in"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              className={styles.input}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        
        <p className={styles.redirectText}>
          Don't have an account?{" "}
          <Link href="/register" className={styles.link}>
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={styles.authContainer}>
        <div className={styles.authCard} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
          <p style={{ color: "var(--text-muted)", fontWeight: "600" }}>Loading form...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
