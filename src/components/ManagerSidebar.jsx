import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/manager-dashboard' },
    { label: 'QA Performance', path: '/qa-performance' },
    { label: 'Report Hub', path: '/report-hub' },
  ];

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
        <div style={styles.avatar}>WM</div>
        <div>
          <div style={styles.userName}>Warehouse Manager</div>
          <div style={styles.userType}>Operations</div>
        </div>
      </div>

      <div style={styles.menu}>
        {menuItems.map(item => (
          <a
            key={item.path}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path);
            }}
            style={location.pathname === item.path ? styles.menuItemActive : styles.menuItem}
          >
            {item.label}
          </a>
        ))}
      </div>

      <button style={styles.logoutBtn} onClick={() => navigate('/')}>Logout</button>
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
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    overflowY: "auto"
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
    marginTop: "auto",
    width: "calc(100% - 48px)",
    padding: "10px 0",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    color: "#111827",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default ManagerSidebar; 