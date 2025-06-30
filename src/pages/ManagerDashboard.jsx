import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerSidebar from '../components/ManagerSidebar';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('Today');
  const [damageRateFilter, setDamageRateFilter] = useState('daily');
  const [stageWiseFilter, setStageWiseFilter] = useState('Today');

  const [kpiData, setKpiData] = useState({
    total_cargo: 0,
    damaged_cargo: 0,
    damage_rate: 0,
    low_confidence_cases: 0
  });
  const [damageRateData, setDamageRateData] = useState([]);
  const [damageByStageData, setDamageByStageData] = useState([]);

  useEffect(() => {
    fetchKPIData();
  }, [timeFilter]);

  useEffect(() => {
    fetchDamageRateTrend();
  }, [damageRateFilter]);

  useEffect(() => {
    fetchStageWiseDamage();
  }, [stageWiseFilter]);

  const fetchKPIData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/dashboard/kpis?date_filter=${timeFilter}`);
      setKpiData(response.data);
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    }
  };

  const fetchDamageRateTrend = async () => {
    try {
      const view = damageRateFilter === 'daily' ? 'daily' : 
                  damageRateFilter === 'monthly' ? 'monthly' : 'yearly';
      const response = await axios.get(`http://localhost:8000/damage-rate-trend?view=${view}`);
      console.log('Damage Rate Trend Response:', response.data); // Debug log
      
      // Map the data correctly based on the view type
      const mappedData = response.data.map(item => ({
        month: item.day || item.month || item.year,
        rate: parseFloat(item.damage_rate) || 0
      }));
      console.log('Mapped Data:', mappedData); // Debug log
      setDamageRateData(mappedData);
    } catch (error) {
      console.error('Error fetching damage rate trend:', error);
      setDamageRateData([]); // Set empty array on error
    }
  };

  const fetchStageWiseDamage = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/stage-wise-damage?filter=${stageWiseFilter}`);
      setDamageByStageData(response.data);
    } catch (error) {
      console.error('Error fetching stage-wise damage:', error);
    }
  };

  const mockDamageData = {
    stages: [
      { name: 'Receiving', total: 450, damaged: 15 },
      { name: 'Storage', total: 800, damaged: 20 },
      { name: 'Shipping', total: 600, damaged: 10 }
    ]
  };

  const mockCargoTypes = [
    { type: 'Electronics', total: 300, break: 5, spill: 0, deform: 2, zipper: 1, rate: '2.7%' },
    { type: 'Textiles', total: 450, break: 2, spill: 3, deform: 4, zipper: 2, rate: '2.4%' },
    { type: 'Food Items', total: 200, break: 1, spill: 8, deform: 1, zipper: 0, rate: '5.0%' },
    { type: 'Machinery', total: 150, break: 4, spill: 0, deform: 3, zipper: 1, rate: '5.3%' },
    { type: 'Chemicals', total: 100, break: 0, spill: 5, deform: 0, zipper: 0, rate: '5.0%' }
  ];

  const recentCargo = [
    { id: 'CMBO-240607-1111', status: 'In Transit', type: 'Electronics' },
    { id: 'CMBO-240607-1112', status: 'Delivered', type: 'Textiles' },
    { id: 'CMBO-240607-1113', status: 'Processing', type: 'Food Items' }
  ];

  const cargoTypeMatrix = [
    { type: 'Electronics', total: 245, break: 12, spill: 3, deform: 8, zipper: 2, rate: '10.2%' },
    { type: 'Chemicals', total: 189, break: 5, spill: 15, deform: 4, zipper: 1, rate: '13.2%' },
    { type: 'Food Items', total: 312, break: 8, spill: 22, deform: 6, zipper: 3, rate: '12.5%' },
    { type: 'Textiles', total: 156, break: 3, spill: 1, deform: 12, zipper: 8, rate: '15.4%' },
    { type: 'Machinery', total: 98, break: 18, spill: 0, deform: 3, zipper: 0, rate: '21.4%' }
  ];

  return (
    <div style={styles.wrapper}>
      <ManagerSidebar />
      
      <div style={styles.mainContent}>
        {/* Header Section */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Warehouse Manager Dashboard</h1>
            <p style={styles.subtitle}>Overview of cargo operations and quality metrics</p>
          </div>
          <div style={styles.headerActions}>
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              style={styles.timeFilter}
            >
              <option>Today</option>
              <option>This month</option>
              <option>This year</option>
            </select>
            <button style={styles.exportButton}>
              <span>Export Report</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={styles.kpiContainer}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiValue}>{kpiData.total_cargo}</div>
            <div style={styles.kpiLabel}>Total Detections</div>
            <div style={styles.kpiDescription}>Total incident cargo</div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiValue}>{kpiData.damaged_cargo}</div>
            <div style={styles.kpiLabel}>Damaged Cargos</div>
            <div style={styles.kpiDescription}>Total cargo with identified damage type </div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiValue}>{kpiData.low_confidence_cases}</div>
            <div style={styles.kpiLabel}>Total Reviews</div>
            <div style={styles.kpiDescription}>Total cargo for inspection</div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiValue}>{kpiData.damage_rate}%</div>
            <div style={styles.kpiLabel}>Damage Rate</div>
            <div style={styles.kpiDescription}>  Percentage of incident bags found damaged</div>
          </div>
        </div>
         
        {/* Top row: Critical Alerts and Key Insights - Same height containers */}
        <div style={styles.topRowContainer}>
          <div style={styles.alertsCard}>
            <h3 style={styles.chartTitle}>Critical Alerts</h3>
            <div style={styles.alertsContent}>
              <div style={styles.alert}>
                <div style={styles.alertIcon}>⚠️</div>
                <div>
                  <div style={styles.alertTitle}>High damage rate in Machinery</div>
                  <div style={styles.alertDetail}>21.4% damage rate - Above threshold</div>
                </div>
              </div>
              <div style={styles.alert}>
                <div style={styles.alertIcon}>⚠️</div>
                <div>
                  <div style={styles.alertTitle}>Inspection delay in Loading</div>
                  <div style={styles.alertDetail}>15min average delay - Needs attention</div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={styles.alertsCard}>
            <h3 style={styles.chartTitle}>Key Insights</h3>
            <div style={styles.insightsContent}>
              <div style={styles.insightsList}>
                <div style={styles.insightItem}>
                  <span style={styles.insightLabel}>Most Common Damage:</span>
                  <span style={styles.insightValue}>Break (34%)</span>
                </div>
                <div style={styles.insightItem}>
                  <span style={styles.insightLabel}>Critical Stage:</span>
                  <span style={styles.insightValue}>Dispatch</span>
                </div>
                <div style={styles.insightItem}>
                  <span style={styles.insightLabel}>High Risk Cargo:</span>
                  <span style={styles.insightValue}>Machinery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle row: Damage Rate Trend and Damage by Stage */}
        <div style={styles.middleRowContainer}>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div>
                <h3 style={styles.chartTitle}>Damage Incident Rate</h3>
                <p style={styles.chartDescription}>Percentage of damaged incident cargo</p>
              </div>
              <select 
                value={damageRateFilter}
                onChange={(e) => setDamageRateFilter(e.target.value)}
                style={styles.chartFilter}
              >
                <option>daily</option>
                <option>monthly</option>
                <option>yearly</option>
              </select>
            </div>
            <div style={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={damageRateData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tickMargin={10}
                  />
                  <YAxis 
                    domain={[0, 'auto']}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Damage Rate']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    name="Damage Rate"
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div>
                <h3 style={styles.chartTitle}>Damage by Stage</h3>
                <p style={styles.chartDescription}>Cargo Volume Categorized by Defect Type and Stage</p>
              </div>
              <select 
                value={stageWiseFilter}
                onChange={(e) => setStageWiseFilter(e.target.value)}
                style={styles.chartFilter}
              >
                <option>Today</option>
                <option>This month</option>
                <option>This year</option>
              </select>
            </div>
            <div style={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={damageByStageData} barSize={70} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="4 3" />
                  <XAxis 
                    dataKey="stage_name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tickMargin={10}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  {damageByStageData.length > 0 && Object.keys(damageByStageData[0])
                    .filter(key => key !== 'stage_name')
                    .map((key, index) => (
                      <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom row: Cargo Type Analysis full width */}
        <div style={styles.bottomRowContainer}>
          <div style={styles.tableCard}>
            <div style={styles.chartHeader}>
              <div>
                <h3 style={styles.chartTitle}>Product Category Damage Statistics</h3>
                <p style={styles.chartDescription}>Damage distribution of different products</p>
              </div>
              <select style={styles.chartFilter}>
                <option>Today</option>
                <option>This week</option>
                <option>This month</option>
              </select>
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Cargo Type</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Break</th>
                    <th style={styles.th}>Spill</th>
                    <th style={styles.th}>Deform.</th>
                    <th style={styles.th}>Zipper</th>
                    <th style={styles.th}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {cargoTypeMatrix.map((item, index) => (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.td}>{item.type}</td>
                      <td style={styles.td}>{item.total}</td>
                      <td style={styles.td}>{item.break}</td>
                      <td style={styles.td}>{item.spill}</td>
                      <td style={styles.td}>{item.deform}</td>
                      <td style={styles.td}>{item.zipper}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.rateBadge,
                          background: parseFloat(item.rate) > 15 ? '#fee2e2' : '#dcfce7',
                          color: parseFloat(item.rate) > 15 ? '#991b1b' : '#166534'
                        }}>
                          {item.rate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

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
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  timeFilter: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    fontSize: '14px',
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
  },
  kpiContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },
  kpiCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  kpiValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  kpiLabel: {
    fontSize: '15px',
    color: '#000',
    marginBottom: '4px',
  },
  kpiDescription:{
    fontSize: '12px',
    color: '#6b7280',
    fontFamily: "Inter, Arial, sans-serif"
  },
  topRowContainer: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
  },
  middleRowContainer: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
  },
  bottomRowContainer: {
    width: '100%',
    marginBottom: '24px',
  },
  alertsCard: {
    flex: 1,
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '200px',
  },
  alertsContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  insightsContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chartCard: {
    flex: 1,
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  chartDescription: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
  },
  chartFilter: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    fontSize: '14px',
  },
  chart: {
    height: '300px',
    
  },
  alert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    background: '#fee2e2',
  },
  alertIcon: {
    fontSize: '20px',
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#991b1b',
  },
  alertDetail: {
    fontSize: '12px',
    color: '#b91c1c',
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1,
    justifyContent: 'center',
  },
  insightItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    padding: '8px 0',
  },
  insightLabel: {
    color: '#6b7280',
  },
  insightValue: {
    fontWeight: '600',
    color: '#111827',
  },
  tableCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
    '&:hover': {
      background: '#f8fafc',
    },
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#111827',
  },
  rateBadge: {
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
  },
};

export default ManagerDashboard; 