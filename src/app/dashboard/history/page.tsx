"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/dashboard.module.css";

interface Report {
  id: string;
  reportName: string;
  fileName: string;
  severity: string;
  createdAt: string;
  summary: string[];
}

export default function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
        setFilteredReports(data.reports || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Run filters whenever search query, filter type, or reports list changes
  useEffect(() => {
    let result = reports;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.reportName.toLowerCase().includes(q) ||
          r.fileName.toLowerCase().includes(q) ||
          (r.summary && r.summary.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Filter by severity status
    if (severityFilter !== "all") {
      result = result.filter((r) => r.severity.toLowerCase() === severityFilter);
    }

    setFilteredReports(result);
  }, [searchQuery, severityFilter, reports]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      if (response.ok) {
        setReports(reports.filter((r) => r.id !== id));
        setDeleteId(null);
      } else {
        alert("Failed to delete report.");
      }
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
        <div className="animate-spin" style={{ fontSize: "2rem" }}>⏳</div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>Loading your report history...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 className={styles.sectionTitle} style={{ marginBottom: "1.25rem" }}>Search & Filter Reports</h3>
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search reports by name, file, or findings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "var(--radius-sm)" }}
            />
          </div>

          {/* Severity Filter */}
          <div style={{ minWidth: "180px" }}>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "var(--radius-sm)" }}
            >
              <option value="all">All Severities</option>
              <option value="normal">🟢 Normal</option>
              <option value="moderate">🟡 Moderate</option>
              <option value="critical">🔴 Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      {filteredReports.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Report Name</th>
                <th className={styles.th}>Uploaded Date</th>
                <th className={styles.th}>Severity Status</th>
                <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.reportName}>{report.reportName}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                      {report.fileName}
                    </div>
                    {report.summary && report.summary.length > 0 && (
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {report.summary[0]}
                      </div>
                    )}
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
                  <td className={styles.td} style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "1rem", alignItems: "center" }}>
                      <Link href={`/dashboard/reports/${report.id}`} className={styles.actionLink}>
                        View Detail
                      </Link>
                      
                      {deleteId === report.id ? (
                        <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                          <button 
                            onClick={() => handleDelete(report.id)} 
                            style={{ color: "var(--critical-color)", fontSize: "0.85rem", fontWeight: "bold" }}
                          >
                            Yes, delete
                          </button>
                          <button 
                            onClick={() => setDeleteId(null)} 
                            style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeleteId(report.id)} 
                          style={{ color: "var(--text-muted)", fontSize: "0.85rem", background: "none", border: "none" }}
                          title="Delete Report"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card flex-center" style={{ padding: "4rem", color: "var(--text-muted)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔍</div>
            <p>No reports found matching your criteria.</p>
          </div>
        </div>
      )}
    </div>
  );
}
