"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/dashboard.module.css";

interface NavbarProps {
  title: string;
  onToggleSidebar: () => void;
}

interface UserData {
  name: string;
  email: string;
}

export default function Navbar({ title, onToggleSidebar }: NavbarProps) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user data in navbar:", err);
      }
    }
    fetchUser();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button onClick={onToggleSidebar} className={styles.menuBtn} aria-label="Toggle Menu">
          ☰
        </button>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div className={styles.headerRight}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {getInitials(user.name)}
            </div>
            <div style={{ textAlign: "left" }} className="md:block hidden">
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>Patient</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
