"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/dashboard.module.css";
import DarkModeToggle from "./DarkModeToggle";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Report History", path: "/dashboard/history", icon: "📁" },
    { name: "My Profile", path: "/dashboard/profile", icon: "👤" },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.sidebarLogo}>
        <span style={{ color: "var(--primary-color)", fontSize: "1.5rem", fontWeight: "bold" }}>✚</span>
        <span className={styles.logoText}>dooper <span style={{ fontWeight: "300", color: "var(--text-primary)" }}>health</span></span>
      </div>

      <nav className={styles.sidebarNav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className={styles.navItem}
          style={{ marginTop: "auto", textAlign: "left", width: "100%" }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </nav>

      <div className={styles.sidebarFooter} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
          v1.0.0
        </span>
        <DarkModeToggle />
      </div>
    </aside>
  );
}
