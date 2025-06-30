import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isHover, setIsHover] = useState(false);
  const viewMoreButtonStyle = {
    background: 'transparent',
    color: '#2563eb',
    border: 'none',
    fontSize: isHover ? 16 : 14,
    // textDecoration: isHover ?'underline':'none',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'font-size 0.8s ease',
  };

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:8000/damage_info")
      .then(res => {
        const data = (res.data.damage_info || []);
        console.log(data[0].Defect_classes);
        
        const cargoMap = {};
  
        data.forEach(item => {
          const id = item.Cargo_id;
          if (!cargoMap[id] || new Date(item.Timestamp) > new Date(cargoMap[id].timestamp)) {
            cargoMap[id] = {
              cargoId: item.Cargo_id,
              time: new Date(item.Timestamp).toLocaleString(),
              type: item.File_type === "video" ? "Video" : "Image",
              damageType: item.Defect_classes && item.Defect_classes.length > 0
              ? item.Defect_classes
              : ["No Damage"],
            
              status: "View",
              warehouse: item.Warehouse || "N/A",
              timestamp: new Date(item.Timestamp)
            };
          }
        });
  
        // Sort by latest timestamp and take top 4
        const latestEntries = Object.values(cargoMap)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 4);
  
        setSessions(latestEntries);
        setLoading(false);
        console.log(latestEntries[0].damageType);
        
        
      })
      .catch(() => {
        setError("Failed to fetch recent sessions.");
        setLoading(false);
      });
  }, []);
  

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.dashboardTitle}>Dashboard</h1>
          <div style={styles.dashboardSubtitle}>
            Welcome back, Demo. Here's your cargo incidents overview.
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statTitle}>Sessions</div>
            <div style={styles.statValue}>3</div>
            <div style={styles.statDesc}>In the last 7 days</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statTitle}>Total Uploads</div>
            <div style={styles.statValue}>12</div>
            <div style={styles.statDesc}>8 videos, 4 images</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statTitle}>Detection Accuracy</div>
            <div style={styles.statValue}>96.5%</div>
            <div style={styles.statDesc}>In demo environment</div>
          </div>
        </div>

        {/* Quick Upload & View Results */}
        <div style={styles.quickRow}>
          <div style={styles.quickCard}>
            <div style={styles.quickTitle}>Quick Upload</div>
            <div style={styles.quickDesc}>
              Upload cargo images or videos to test the AI detection system.
            </div>
            <button style={styles.uploadBtn} onClick={() => navigate("/upload")}>Start New Upload</button>
          </div>
          <div style={styles.quickCard}>
            <div style={styles.quickTitle}>View Results</div>
            <div style={styles.quickDesc}>
              View detection results from previous uploads and sessions.
            </div>
            <button style={styles.viewBtn} onClick={() => navigate("/history")}>View Detection Results</button>
          </div>
        </div>

        {/* Recent Sessions Cards */}
        <div style={styles.cardsSection}>
          <div style={styles.sectionTitle}>Recent Sessions</div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: "#dc2626" }}>{error}</div>
          ) : (
            <div style={styles.cardsGrid}>
              {sessions.map((session, idx) => (
                <div key={idx} style={styles.modelCard} onClick={() => navigate(`/summary/${session.cargoId}`)}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cardId}>{session.cargoId}</div>
                    <div style={styles.cardTime}>{session.time}</div>
                  </div>
                  <div style={styles.cardContent}>
                   
                    <div style={styles.cardDetail}>
                      <span style={styles.cardLabel}>Warehouse:</span>
                      <span>{session.warehouse}</span>
                    </div>
                    <div style={styles.cardDetail}>
                      <span style={styles.cardLabel}>Input Type:</span>
                      <span style={{
                        ...styles.typeBadge,
                        background: session.type === 'Video' ? '#e0e7ff' : '#f0fdf4',
                        color: session.type === 'Video' ? '#4f46e5' : '#22c55e'
                      }}>
                        {session.type}
                      </span>
                    </div>
                    <div style={styles.cardDetail}>
                      <span style={styles.cardLabel}>Defect:</span>
                     
                        {/* { session.damageType && session.damageType.length > 0 ? session.damageType.map((d, index) =>
                           <span style={{
                            ...styles.defectBadge,
                            background: session.damageType === 'No Damage' ? '#f0fdf4' : '#fef2f2',
                            color: session.damageType === 'No Damage' ? '#22c55e' : '#ef4444'
                          }}>
                          
                          {d}</span>)  : <span style={{
                        ...styles.defectBadge,
                        background: session.damageType === 'No Damage' ? '#f0fdf4' : '#fef2f2',
                        color: session.damageType === 'No Damage' ? '#22c55e' : '#ef4444'
                      }}> No Damage
                      </span> } */}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {session.damageType && session.damageType.length > 0 ? (
                session.damageType.map((d, index) => (
                  <span
                    key={index}
                    style={{
                      ...styles.defectBadge,
                      background: d === 'No Damage' ? '#f0fdf4' : '#fef2f2',
                      color: d === 'No Damage' ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {d}
                  </span>
                ))
              ) : (
                <span
                  style={{
                    ...styles.defectBadge,
                    background: '#f0fdf4',
                    color: '#22c55e',
                  }}
                >
                  No Damage
                </span>
              )}
            </div>    
                    </div>
                  </div>
                  <div style={styles.cardFooter}>
                    <button style={styles.statusButton}>
                      {session.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={styles.viewMoreContainer}>
            <button 
              style={viewMoreButtonStyle}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              onClick={() => navigate('/history')}
            >
             View More →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Inter, Arial, sans-serif",
  },
  sidebar: {
    width: 260,
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
  },
  menuItem: {
    padding: "12px 32px",
    color: "#111827",
    fontWeight: 500,
    cursor: "pointer",
    borderLeft: "4px solid transparent",
    transition: "background 0.2s",
  },
  menuItemActive: {
    padding: "12px 32px",
    color: "#2563eb",
    fontWeight: 600,
    background: "#f1f5f9",
    borderLeft: "4px solid #2563eb",
    cursor: "pointer",
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
  main: {
    flex: 1,
    padding: "32px 40px",
    background: "#f8fafc",
  },
  header: {
    marginBottom: 24,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    color: "#111827",
  },
  dashboardSubtitle: {
    color: "#64748b",
    fontSize: 16,
    marginTop: 4,
  },
  statsRow: {
    display: "flex",
    gap: 24,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  statTitle: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 4,
  },
  statDesc: {
    fontSize: 13,
    color: "#64748b",
  },
  quickRow: {
    display: "flex",
    gap: 24,
    marginBottom: 32,
  },
  quickCard: {
    flex: 1,
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minHeight: 120,
  },
  quickTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 8,
    color: "#111827",
  },
  quickDesc: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  uploadBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "12px 0",
    width: "100%",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
  },
  viewBtn: {
    background:"#111827",
    color:"#fff",
    border: "none",
    borderRadius: 6,
    padding: "12px 0",
    width: "100%",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
  },
  cardsSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: 24,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap:5,
  },
  modelCard: {
    background: "#ffffff",
    borderRadius: 12,
    padding: 15,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardId: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 14,
    color: "#64748b",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  cardDetail: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  defectBadge: {
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
  },
  typeBadge: {
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
  },
  cardFooter: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-end",
  },
  statusButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  viewMoreContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  
 
  
};

export default DashboardPage;