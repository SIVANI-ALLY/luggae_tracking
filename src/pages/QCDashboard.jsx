import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import DamageChart from '../components/DamageChart';
import ConfidenceChart from '../components/ConfidenceChart';
import AlertsSection from '../components/AlertsSection';
import VerificationsTable from '../components/VerificationsTable';
import axios from 'axios';
import { Card, Table, Alert, Spinner } from 'react-bootstrap';

const QCDashboard = () => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('damage-analysis');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [damageData, setDamageData] = useState([]);
  const [confidenceData, setConfidenceData] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [cargoData, setCargoData] = useState(null);
  const [damageFilter, setDamageFilter] = useState('today');
  const [confidenceFilter, setConfidenceFilter] = useState('today');
  const [damageStage, setDamageStage] = useState('All Stages');
  const [damageDate, setDamageDate] = useState(new Date().toISOString().split('T')[0]);
  const [confidenceStage, setConfidenceStage] = useState('All Stages');
  const [confidenceDate, setConfidenceDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHover, setIsHover] = useState(false);
  const [damageChartLoading, setDamageChartLoading] = useState(false);
  const [confidenceChartLoading, setConfidenceChartLoading] = useState(false);
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

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const cargoResponse = await axios.get('http://localhost:8000/inspection/summary');
      if (!cargoResponse.data) throw new Error('No data received from server');
      const data = cargoResponse.data;
      setCargoData(data);
      setStats([
        {
          title: 'Total Damage Detections',
          count: data.total_damaged_cargos || '0',
          description: 'Total damaged incident cargo',
          trend: '+12% from last period'
        },
        {
          title: 'Total Reviews',
          count: data.total_inspected_cargos || '0',
          description: 'Total cargo for inspection',
          link: '/incident',
          trend: '+5% from last period'
        },
        {
          title: 'Pending',
          count: data.pending_inspections || '0',
          description: 'Cargos requiring manual verification',
          link: '/incident'
        },
        {
          title: 'Avg. Confidence',
          count: `${(data.average_confidence * 100).toFixed(2) || '0'}%`,
          description: 'Average confidence score today',
          trend: '-2% from last period'
        }
      ]);
      // Alerts and verifications
      const formattedVerifications = (data.recent_verifications || []).map(verification => ({
        cargoId: verification.Cargo_id || 'N/A',
        detectionTime: verification.inspect_time || 'N/A',
        location: verification.Stage_name || 'N/A',
        type: verification.Bag_type || 'N/A',
        defect: verification.Defect_class || 'N/A',
        confidence: verification.Confidence !== undefined ? (verification.Confidence * 100).toFixed(2) : '0',
        status: verification.Status || '✅'
      }));
      setVerifications(formattedVerifications);
      const formattedAlerts = (data.low_confidence_alerts || []).map(alert => {
        const imagePath = alert.image_path ? `${alert.image_path}` : null;
        return {
          id: alert.Cargo_id || 'N/A',
          thumbnail: null,
          confidence: alert.Confidence || 0,
          damageType: alert.Defect_class || 'N/A',
          fileType: 'Image',
          stage_name:alert.Stage_name || 'N/A',
          image_path: imagePath
        };
      });
      setAlerts(formattedAlerts);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch damage chart data
  const fetchDamageChartData = async () => {
    try {
      setDamageChartLoading(true);
      const damageResponse = await axios.get('http://localhost:8000/damage-distribution', {
        params: {
          stage_name: damageStage === 'All Stages' ? '' : damageStage,
          target_date: damageDate
        }
      });
      setDamageData(damageResponse.data || []);
    } catch (error) {
      setDamageData([]);
    } finally {
      setDamageChartLoading(false);
    }
  };

  // Fetch confidence chart data
  const fetchConfidenceChartData = async () => {
    try {
      setConfidenceChartLoading(true);
      const confidenceResponse = await axios.get('http://localhost:8000/chart/confidence-cargo-distribution', {
        params: {
          stage_name: confidenceStage === 'All Stages' ? '' : confidenceStage,
          start_date: confidenceDate
        }
      });
      setConfidenceData(confidenceResponse.data || []);
    } catch (error) {
      setConfidenceData([]);
    } finally {
      setConfidenceChartLoading(false);
    }
  };

  // Initial load: summary and both charts
  useEffect(() => {
    fetchSummaryData();
    fetchDamageChartData();
    fetchConfidenceChartData();
  }, []);

  // Chart filters
  useEffect(() => {
    fetchDamageChartData();
  }, [damageStage, damageDate]);
  useEffect(() => {
    fetchConfidenceChartData();
  }, [confidenceStage, confidenceDate]);

  // Handler for manual verification navigation
  const handleVerify = (id) => {
    navigate(`/verify/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error Loading Dashboard</Alert.Heading>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              setError(null);
              fetchSummaryData();
            }}
          >
            Retry
          </button>
        </div>
      </Alert>
    );
  }

  if (!cargoData) {
    return (
      <Alert variant="warning" className="m-3">
        No data available
      </Alert>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>QA Dashboard</h1>
          <p style={styles.subtitle}>Incident Verification and Quality Control Metrics</p>
        </header>

        {/* Stats */}
        <section style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </section>

        {/* Tabs */}
        <section style={styles.tabContainer}>
          <div style={styles.tabHeader}>
            {[
              { id: 'damage-analysis', label: ' Damage Analysis' },
              { id: 'recently-verified', label: 'Recently Verified' },
            ].map((tab) => (
              <button
                key={tab.id}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === tab.id ? styles.activeTab : {}),
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {activeTab === 'damage-analysis' ? (
              <div style={styles.chartsContainer}>
                {/* Damage Chart with its own filter */}
                <div style={styles.chartWrapper}>
                  <div style={styles.chartHeader}>
                    <h3 style={styles.chartTitle}>Damage Type Distribution</h3>
                    <p style={styles.chartDescription}>Overview of detected damage categories</p>
                    <div style={{ width: '100%', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <select
                          value={damageStage}
                          onChange={(e) => setDamageStage(e.target.value)}
                          style={styles.chartFilter}
                        >
                          <option value="">All Stages</option>
                          <option value="Arrival">Arrival</option>
                          <option value="Inspection">Inspection</option>
                          <option value="Dispatch">Dispatch</option>
                        </select>
                        <input
                          type="date"
                          value={damageDate}
                          onChange={(e) => setDamageDate(e.target.value)}
                          style={styles.chartFilter}
                        />
                      </div>
                    </div>
                  </div>
                  {damageChartLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                      <Spinner animation="border" role="status" />
                    </div>
                  ) : (
                    <DamageChart data={damageData} />
                  )}
                </div>

                {/* Confidence Chart with its own filter */}
                <div style={styles.chartWrapper}>
                  <div style={styles.chartHeader}>
                    <h3 style={styles.chartTitle}>Confidence Score Distribution</h3>
                    <p style={styles.chartDescription}>Model prediction confidence spread</p>
                  </div>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', margin: "20px" }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        value={confidenceStage}
                        onChange={(e) => setConfidenceStage(e.target.value)}
                        style={styles.chartFilter}
                      >
                        <option value="">All Stages</option>
                        <option value="Arrival">Arrival</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Dispatch">Dispatch</option>
                      </select>
                      <input
                        type="date"
                        value={confidenceDate}
                        onChange={(e) => setConfidenceDate(e.target.value)}
                        style={styles.chartFilter}
                      />
                    </div>
                  </div>
                  {confidenceChartLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                      <Spinner animation="border" role="status" />
                    </div>
                  ) : (
                    <ConfidenceChart data={confidenceData} />
                  )}
                </div>
              </div>
            ) : (
              <div style={styles.verificationContent}>
                <div style={styles.tableWrapper}>
                  {/* <h3 style={styles.chartTitle}>Recently Verified</h3> */}
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Time</th>
                        <th style={styles.th}>Cargo ID</th>
                        <th style={styles.th}>Type</th>
                        <th style={styles.th}>Defect</th>
                        <th style={styles.th}>Confidence</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifications.map((item) => (
                        <tr key={item.cargoId} style={styles.tr}>
                          <td style={styles.td}>{item.detectionTime}</td>
                          <td style={styles.td}>{item.cargoId}</td>
                          <td style={styles.td}>{item.type}</td>
                          <td style={styles.td}>{item.defect}</td>
                          <td style={styles.td}>{item.confidence}%</td>
                          <td style={styles.td}>{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '100%' }}>
                  <button
                    style={viewMoreButtonStyle}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={() => navigate('/incident')}
                  >
                    View More →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Alerts Section - Now outside the tab content */}
        <AlertsSection alerts={alerts} onVerify={handleVerify} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "Inter, Arial, sans-serif",
  },
  content: {
    flex: 1,
    padding: '24px 32px',
    overflowY: 'auto',
    marginLeft: '250px', // Add margin to prevent sidebar overlap
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#111827',
    margin: 0,
    fontFamily: "Inter, Arial, sans-serif",
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    margin: '4px 0 0 0',
    fontFamily: "Inter, Arial, sans-serif",
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  filters: {
    display: 'flex',
    gap: 16,
    marginBottom: 24,
  },
  select: {
    padding: '8px 8px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 14,
    color: '#000',
    background: "#fff"
  },
  tabContainer: {
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: 24,
  },
  tabHeader: {
    display: 'flex', // Changed from grid to flex for side-by-side tabs
    backgroundColor: '#fff', // Black header
    borderRadius: '8px 8px 0 0',
    overflow: 'hidden',
  },
  chartHeaderOuter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 4,
    marginRight: 4,
  },

  tabButton: {
    flex: 1, // Equal width buttons
    padding: '12px 0',
    background: '#f1f5f9',
    border: 'none',
    fontSize: 16,
    fontWeight: 500,
    color: '#000', // White text for contrast on black
    cursor: 'pointer',
    transition: 'background  ease',
    fontFamily: "Inter, Arial, sans-serif",
  },

  activeTab: {
    background: '#000', // Optional highlight for active tab
    color: '#fff',
    fontWeight: 600,
    border: "1px solid"
  },

  tabContent: {
    minHeight: 400,
  },
  chartsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    paddingTop: 15,      // more reliable than margin in many grid/flex layouts
  },

  chartWrapper: {
    background: '#ffffff',
    borderRadius: 8,
    padding: 18,
    border: '1px solid #e2e8f0', // Box border
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', // Subtle elevation
  },
  chartHeader: {
    // display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#111827',
    margin: 0,
    fontFamily: "Inter, Arial, sans-serif",
  },
  chartFilter: {
    padding: '5px 8px',
    marginRight: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 14,
    color: '#475569',
    fontFamily: "Inter, Arial, sans-serif",
  },
  chartDescription: {
    fontSize: 14,
    color: '#64748b',
    margin: '0 10px 0 0',
    fontFamily: "Inter, Arial, sans-serif",
  },
  tableWrapper: {
    overflowX: 'auto',
    background: '#ffffff',
    borderRadius: 8,
    padding: 24,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: "Inter, Arial, sans-serif",
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 12,
    fontWeight: 500,
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
    textTransform: 'uppercase',
    fontFamily: "Inter, Arial, sans-serif",
  },
  tr: {
    ':hover': {
      background: '#f8fafc',
    },
  },
  td: {
    padding: 16,
    fontSize: 14,
    color: '#475569',
    borderBottom: '1px solid #e2e8f0',
    fontFamily: "Inter, Arial, sans-serif",
  },
  verificationContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
};

export default QCDashboard; 