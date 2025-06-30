import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.sidebar}>
      <div style={styles.logoSection}>
        <div style={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 20l4-8 4 8 4-8 4 8" stroke="#fff" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div>
          <div style={styles.brand}>CargoSight</div>
          <div style={styles.brandSub}>AI Cargo Inspection</div>
        </div>
      </div>
      <div style={styles.userSection}>
        <div style={styles.avatar}>DU</div>
        <div>
          <div style={styles.userName}>Demo User</div>
          <div style={styles.userType}>Demo Account</div>
        </div>
      </div>
      <div style={styles.menu}>
        <NavLink to="/dashboard" style={({ isActive }) => isActive ? styles.menuItemActive : styles.menuItem}>Dashboard</NavLink>
        <NavLink to="/upload" style={({ isActive }) => isActive ? styles.menuItemActive : styles.menuItem}>Upload Cargo</NavLink>
        <NavLink to="/history" style={({ isActive }) => isActive ? styles.menuItemActive : styles.menuItem}>Incident Log</NavLink>
      </div>
      <button style={styles.logoutBtn} onClick={() => navigate("/")}>Logout</button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: 230,
    background: "#fff",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 0",
    position: "relative",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  logo: {
    background: "#e0e7ff",
    borderRadius: 8,
    padding: 6,
  },
  brand: {
    fontWeight: 700,
    fontSize: 20,
    color: "#111827",
  },
  brandSub: {
    fontSize: 13,
    color: "#64748b",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 32,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 22,
    color: "#64748b",
  },
  userName: {
    fontWeight: 600,
    fontSize: 16,
    color: "#111827",
  },
  userType: {
    fontSize: 13,
    color: "#64748b",
  },
  menu: {
    width: "100%",
    marginBottom: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  menuItem: {
    padding: "12px 32px",
    color: "#111827",
    fontWeight: 500,
    cursor: "pointer",
    borderLeft: "4px solid transparent",
    textDecoration: "none",
    transition: "background 0.2s",
    background: "none",
  },
  menuItemActive: {
    padding: "12px 32px",
    color: "#2563eb",
    fontWeight: 600,
    background: "#f1f5f9",
    borderLeft: "4px solid #2563eb",
    cursor: "pointer",
    textDecoration: "none",
  },
  logoutBtn: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    padding: "10px 0",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    color: "#111827",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default Sidebar; 