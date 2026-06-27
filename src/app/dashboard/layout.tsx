"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import styles from "@/styles/dashboard.module.css";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Determine current page title based on pathname
  let pageTitle = "Dashboard";
  if (pathname === "/dashboard/history") {
    pageTitle = "Report History";
  } else if (pathname === "/dashboard/profile") {
    pageTitle = "My Profile";
  } else if (pathname.includes("/dashboard/reports/")) {
    pageTitle = "AI Report Analysis";
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main workspace */}
      <div className={styles.mainContent}>
        {/* Top header navigation */}
        <Navbar title={pageTitle} onToggleSidebar={toggleSidebar} />

        {/* Dynamic page content */}
        <main className={styles.contentBody}>{children}</main>
      </div>
    </div>
  );
}
