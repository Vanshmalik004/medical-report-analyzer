"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/dashboard.module.css";

interface ReportSummary {
  id: string;
  reportName: string;
  fileName: string;
  severity: string;
  createdAt: string;
}

interface DashboardData {
  user: { name: string };
  reports: ReportSummary[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile info
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) throw new Error("Not authenticated");
      const meData = await meRes.json();

      // Fetch reports history
      const repRes = await fetch("/api/reports");
      if (!repRes.ok) throw new Error("Failed to fetch reports");
      const repData = await repRes.json();

      setData({
        user: meData.user,
        reports: repData.reports || [],
      });
    } catch (err) {
      console.error(err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const [uploadStatusText, setUploadStatusText] = useState("");

  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploadProgress(0);
    setUploadStatusText("Preparing file...");

    // Check file extension
    const validExtensions = ["pdf", "jpg", "jpeg", "png"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      setError("Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG file.");
      setUploadProgress(null);
      return;
    }

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum file size is 5MB.");
      setUploadProgress(null);
      return;
    }

    let extractedText = "";
    const isImage = ["jpg", "jpeg", "png"].includes(ext);

    // Run client-side OCR if it is an image
    if (isImage) {
      try {
        setUploadProgress(15);
        setUploadStatusText("Initializing browser OCR engine...");
        const { createWorker } = await import("tesseract.js");
        
        const worker = await createWorker("eng");
        
        setUploadProgress(40);
        setUploadStatusText("Performing OCR text recognition (takes a few seconds)...");
        const { data: { text } } = await worker.recognize(file);
        
        await worker.terminate();
        extractedText = text;
        
        setUploadProgress(75);
        setUploadStatusText("Uploading recognized data & analyzing biomarkers...");
      } catch (ocrErr: any) {
        console.error("Client-side OCR failed, trying server upload anyway:", ocrErr);
      }
    }

    // Setup mock progress for upload & analysis transition
    let progress = isImage ? 75 : 10;
    setUploadProgress(progress);
    setUploadStatusText(isImage ? "Uploading recognized data & analyzing biomarkers..." : "Uploading document & extracting text...");
    
    const interval = setInterval(() => {
      if (progress < 90) {
        progress += Math.floor(Math.random() * 10) + 2;
        setUploadProgress(Math.min(progress, 90));
      }
    }, 450);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (extractedText) {
        formData.append("extractedText", extractedText);
      }

      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);
      setUploadStatusText("Analysis complete!");

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to analyze report");
      }

      // Redirect to report detail view
      router.push(`/dashboard/reports/${resData.reportId}`);
    } catch (err: any) {
      clearInterval(interval);
      setUploadProgress(null);
      setError(err.message || "An error occurred during report upload or analysis. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="animate-spin" style={{ fontSize: "2rem" }}>⏳</div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>Loading your dashboard...</p>
      </div>
    );
  }

  // Calculate statistics
  const totalReports = data?.reports.length || 0;
  const normalReports = data?.reports.filter((r) => r.severity.toLowerCase() === "normal").length || 0;
  const moderateReports = data?.reports.filter((r) => r.severity.toLowerCase() === "moderate").length || 0;
  const criticalReports = data?.reports.filter((r) => r.severity.toLowerCase() === "critical").length || 0;

  const recentReports = data?.reports.slice(0, 3) || [];

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div className={styles.welcomeSection}>
        <h2 className={styles.welcomeTitle}>Hello, {data?.user.name}!</h2>
        <p className={styles.welcomeSubtitle}>
          Welcome to your Dooper Health dashboard. Upload diagnostic summaries, blood reports, or thyroid panels to instantly analyze biomarkers using advanced medical AI.
        </p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconPrimary}`}>📁</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalReports}</span>
            <span className={styles.statLabel}>Total Reports</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconSuccess}`}>🟢</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{normalReports}</span>
            <span className={styles.statLabel}>Normal Status</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconWarning}`}>🟡</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{moderateReports}</span>
            <span className={styles.statLabel}>Moderate Attention</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconDanger}`}>🔴</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{criticalReports}</span>
            <span className={styles.statLabel}>Critical Alerts</span>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <div className="card" style={{ padding: "2rem" }}>
        <h3 className={styles.sectionTitle} style={{ marginBottom: "1rem" }}>Analyze New Medical Report</h3>
        
        {error && (
          <div className="alertBox alertCritical" style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: "0.85rem", backgroundColor: "var(--critical-bg)", color: "var(--critical-color)", display: "flex", gap: "0.5rem" }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
          <label 
            htmlFor="file-upload" 
            className={`${styles.uploadCard} ${dragActive ? styles.uploadCardActive : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={styles.uploadIcon}>📥</div>
            <p className={styles.uploadTitle}>Drag & Drop your Medical Report here</p>
            <p className={styles.uploadSubtitle}>Supports PDF reports or Images (JPG, JPEG, PNG) up to 5MB</p>
            <span className="btn btn-outline" style={{ pointerEvents: "none" }}>Browse Files</span>
            
            <input 
              id="file-upload"
              type="file"
              className={styles.fileInput}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>
        </form>

        {uploadProgress !== null && (
          <div className={styles.progressContainer} style={{ margin: "1.5rem auto 0" }}>
            <div className={styles.progressHeader}>
              <span>{uploadStatusText}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Table */}
      <div className={styles.historySection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Report Uploads</h3>
          {totalReports > 3 && (
            <Link href="/dashboard/history" className={styles.actionLink}>
              View All History →
            </Link>
          )}
        </div>

        {recentReports.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Report Name</th>
                  <th className={styles.th}>Uploaded Date</th>
                  <th className={styles.th}>Severity Status</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.reportName}>{report.reportName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{report.fileName}</div>
                    </td>
                    <td className={styles.td}>
                      {new Date(report.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className={styles.td}>
                      <span className={`badge ${
                        report.severity.toLowerCase() === "normal"
                          ? "badge-normal"
                          : report.severity.toLowerCase() === "moderate"
                          ? "badge-moderate"
                          : "badge-critical"
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <Link href={`/dashboard/reports/${report.id}`} className={styles.actionLink}>
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card flex-center" style={{ padding: "3rem", color: "var(--text-muted)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
              <p>No medical reports uploaded yet. Upload a report to start your clinical analysis history.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
