import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const IncidentLog = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    defect: 'all'
  });

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/pending');
        console.log("Raw API response:", response);
        console.log("Pending incidents response:", response.data);
        
        // Handle both array and object response formats
        const incidentsData = Array.isArray(response.data) ? response.data : (response.data?.incidents || []);
        console.log("Processed incidents data:", incidentsData);
        
        const formattedIncidents = incidentsData.map(incident => {
          console.log("Processing incident:", incident);
          return {
            id: incident.cargo_id || incident.Cargo_id,
            detection_time: incident.detection_time || incident.inspect_time,
            cargo_id: incident.cargo_id || incident.Cargo_id,
            Stage_name: incident.stage_name || incident.Stage_name || 'N/A',
            location: incident.stage_name || incident.Stage_name || 'N/A',
            type: incident.bag_type || incident.Bag_type || 'N/A',
            defect: incident.defect_class || incident.Defect_class || 'N/A',
            confidence: incident.confidence || incident.Confidence || 0,
            status: incident.status || incident.Status || 'pending'
          };
        });
        console.log("Formatted incidents:", formattedIncidents);

        // Apply filters
        let filteredIncidents = formattedIncidents;
        if (filters.status !== 'all') {
          filteredIncidents = filteredIncidents.filter(inc => (inc.status || '').toLowerCase() === filters.status.toLowerCase());
        }
        if (filters.defect !== 'all') {
          filteredIncidents = filteredIncidents.filter(inc => (inc.defect || '').toLowerCase() === filters.defect.toLowerCase());
        }
        if (filters.dateRange !== 'all') {
          const now = new Date();
          filteredIncidents = filteredIncidents.filter(inc => {
            const dt = new Date(inc.detection_time);
            if (filters.dateRange === 'today') {
              return dt.toDateString() === now.toDateString();
            } else if (filters.dateRange === 'week') {
              const weekAgo = new Date(now);
              weekAgo.setDate(now.getDate() - 7);
              return dt >= weekAgo;
            } else if (filters.dateRange === 'month') {
              const monthAgo = new Date(now);
              monthAgo.setMonth(now.getMonth() - 1);
              return dt >= monthAgo;
            }
            return true;
          });
        }
        setIncidents(filteredIncidents);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        console.error('Error details:', err.response?.data);
        setError('Failed to fetch incident data');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [filters]);
  

  const handleIncidentClick = (incident) => {
    navigate(`/incident/${incident.cargo_id}/${incident.Stage_name}`);
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <Sidebar />
        <div style={styles.mainContent}>
          <div style={styles.loading}>Loading incident data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.wrapper}>
        <Sidebar />
        <div style={styles.mainContent}>
          <div style={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <Sidebar />
      
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>Cargo Inspections</h1>
          <p style={styles.subtitle}>Review and manage cargo incidents with less than 70% confidence scores</p>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={styles.select}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
          
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            style={styles.select}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <select
            value={filters.defect}
            onChange={(e) => setFilters({ ...filters, defect: e.target.value })}
            style={styles.select}
          >
            <option value="all">All Damage Type</option>
            <option value="Deformed_trolley">Deformed_trolley</option>
            <option value="Break_trolley">Break_trolley</option>
            <option value="Break_Carton">Break_Carton</option>
            <option value="Deformed_Carton">Deformed_Carton</option>
            <option value="Break_Bag">Break_Bag</option>
            <option value="Zipper_failure">Zipper_failure</option>
          </select>
        </div>

        {/* Incidents Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                {/* <th style={styles.th}>Time</th> */}
                <th style={styles.th}>Cargo ID</th>
                <th style={styles.th}>Stage</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Defect</th>
                <th style={styles.th}>Confidence</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() => handleIncidentClick(incident)}
                  style={{ ...styles.tr, cursor: 'pointer' }}
                >
                  {/* <td style={styles.td}>{incident.detection_time}</td> */}
                  <td style={styles.td}>{incident.cargo_id}</td>
                  <td style={styles.td}>{incident.Stage_name}</td>
                  <td style={styles.td}>{incident.type}</td>
                  <td style={styles.td}>{incident.defect}</td>
                  <td style={styles.td}>{(incident.confidence * 100).toFixed(2)}%</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.status,
                      background: incident.status === 'pending' ? '#FEF3C7' : 
                                incident.status === 'reviewed' ? '#DBEAFE' : '#D1FAE5',
                      color: incident.status === 'pending' ? '#92400E' :
                            incident.status === 'reviewed' ? '#1E40AF' : '#065F46'
                    }}>
                      {incident.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "Inter, Arial, sans-serif",
  },
  mainContent: {
    flex: 1,
    padding: '24px 32px',
    marginLeft: '230px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    margin: '0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  filters: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#475569',
  },
  tableContainer: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
  },
  tr: {
    '&:hover': {
      background: '#f8fafc',
    },
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#475569',
    borderBottom: '1px solid #e2e8f0',
  },
  status: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    fontSize: '16px',
    color: '#64748b',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    fontSize: '16px',
    color: '#EF4444',
  },
};

export default IncidentLog; 