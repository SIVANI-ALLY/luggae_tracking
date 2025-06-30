import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';

const HistoricPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cargoIds, setCargoIds] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    stage: 'all',
    mediaType: 'all',
    cargoId: ''
  });

  useEffect(() => {
    setLoading(true);
    // Fetch cargo IDs
    axios.get("http://127.0.0.1:8000/cargo_ids")
      .then(res => {
        setCargoIds(res.data.cargo_ids || []);
      })
      .catch(() => {
        console.error("Failed to fetch cargo IDs");
      });

    // Fetch damage info
    axios.get("http://127.0.0.1:8000/damage_info")
      .then(res => {
        const data = (res.data.damage_info || []);
        // Group by cargoId and keep only the latest entry
        const cargoMap = {};
        console.log(data[0]);
        data.forEach(item => {
          const id = item.Cargo_id;
          if (!cargoMap[id] || new Date(item.Timestamp) > new Date(cargoMap[id].Timestamp)) {
            // Find all rows for this cargoId
            // const allRowsForCargo = data.filter(row => row.Cargo_id === id);
            // const isVideo = allRowsForCargo.some(row => row.stitched_video_path && row.stitched_video_path.trim() !== "");
            cargoMap[id] = {
              cargoId: item.Cargo_id,
              time: new Date(item.Timestamp).toLocaleString(),
              type: item.File_type === "video" ? "Video" : "Image",
              damageType: item.Defect_classes.length === 0 ? "No Damage" : item.Defect_classes.join(", "),
              stage: item.Stage_name || "N/A",
              timestamp: new Date(item.Timestamp)
            };
          }
        });

        // Convert to array and sort by timestamp
        const uniqueData = Object.values(cargoMap).sort((a, b) => b.timestamp - a.timestamp);
        
        setSessions(uniqueData);
        setFilteredSessions(uniqueData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch historical data.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...sessions];

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      switch (filters.dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }
      filtered = filtered.filter(session => session.timestamp >= cutoff);
    }

   

    // Filter by media type
    if (filters.mediaType !== 'all') {
      filtered = filtered.filter(session => 
        session.type.toLowerCase() === filters.mediaType.toLowerCase()
      );
    }

    // Filter by cargo ID
    if (filters.cargoId) {
      filtered = filtered.filter(session =>
        session.cargoId.toLowerCase().includes(filters.cargoId.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
  }, [filters, sessions]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <div style={styles.wrapper}>
      <Sidebar />
      
      <div style={styles.main}>
        {/* Top Ribbon */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Cargo Incidents</h1>
          <div style={styles.pageSubtitle}>
          Find and filter all incident cargo
          </div>
        </div>

        {/* Filters Section */}
        <div style={styles.filtersSection}>
          <div style={styles.filterRow}>
            <select 
              style={styles.filterSelect}
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            <select 
              style={styles.filterSelect}
              value={filters.mediaType}
              onChange={(e) => handleFilterChange('mediaType', e.target.value)}
            >
              <option value="all">All Media Types</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>

            <div style={styles.searchContainer}>
              <input
                type="text"
                list="cargoIds"
                placeholder="Search by Cargo ID"
                style={styles.searchInput}
                value={filters.cargoId}
                onChange={(e) => handleFilterChange('cargoId', e.target.value)}
              />
              <datalist id="cargoIds">
                {cargoIds.map((id, index) => (
                  <option key={index} value={id} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div style={styles.resultsSection}>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Timestamp</th>
                    <th style={{...styles.th, width: '200px'}}>Cargo ID</th>
                    <th style={styles.th}>Stage</th>
                    <th style={styles.th}>File Type</th>
                    <th style={styles.th}>Damage Type</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session, index) => (
                    <tr key={`${session.cargoId}_${index}`}>
                      <td style={styles.td}>{session.time}</td>
                      <td style={styles.td}>{session.cargoId}</td>
                      <td style={styles.td}>{session.stage}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            backgroundColor: session.type === 'Image' ? '#dcfce7' : '#e0f2fe',
                            color: session.type === 'Image' ? '#15803d' : '#0369a1',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '14px',
                          }}
                        >
                          {session.type}
                        </span>
                      </td>
                      <td style={styles.td}>{session.damageType}</td>
                      <td style={styles.td}>
                        <button 
                          style={styles.viewButton}
                          onClick={() => navigate(`/summary/${session.cargoId}`)}
                        >
                          View Results
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
  main: {
    flex: 1,
    padding: "32px 40px",
  },
  header: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    color: "#111827",
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
  },
  filtersSection: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  filterRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  filterSelect: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    fontSize: 14,
    minWidth: 140,
    fontFamily: "Inter, Arial, sans-serif",
  },
  searchContainer: {
    position: "relative",
    flex: 1,
    minWidth: 100,
  },
  searchInput: {
    width: "100%",
    padding: "8px 8px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    fontSize: 14,
    fontFamily: "Inter, Arial, sans-serif",
  },
  resultsSection: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "Inter, Arial, sans-serif",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    borderBottom: "2px solid #e5e7eb",
    color: "#111827",
    fontWeight: 600,
    fontSize: 14,
    background: "#f8fafc",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  tr: {
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "16px",
    fontSize: 14,
    color: "#374151",
  },
  viewButton: {
    padding: "6px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
    fontFamily: "Inter, Arial, sans-serif",
  },
  loading: {
    textAlign: "center",
    padding: "32px",
    color: "#64748b",
    fontSize: 14,
    fontFamily: "Inter, Arial, sans-serif",
  },
  error: {
    textAlign: "center",
    padding: "32px",
    color: "#dc2626",
    fontSize: 14,
    fontFamily: "Inter, Arial, sans-serif",
  },
};

export default HistoricPage;