import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QASidebar from '../components/ManagerSidebar';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const QAPerformance = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('today');
  const [inspectionTrendFilter, setInspectionTrendFilter] = useState('daily');
  const [stageWiseFilter, setStageWiseFilter] = useState('daily');
  const [logFilter, setLogFilter] = useState('today');
  const [rateFilter, setRateFilter] = useState('today');

  const [kpiData, setKpiData] = useState({
    total_inspected: 0,
    avg_inspection_time_sec: 0,
    verification_success_rate: 0
  });
  const [inspectionTrendData, setInspectionTrendData] = useState([]);
  const [stageWiseData, setStageWiseData] = useState([]);
  const [damageDistributionData, setDamageDistributionData] = useState([]);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchKPIData();
    fetchInspectionTrend();
    fetchStageWiseDistribution();
    fetchDamageDistribution();
  }, [timeFilter, inspectionTrendFilter, stageWiseFilter, rateFilter]);

  const fetchKPIData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/inspection_summary?filter=${timeFilter.toLowerCase()}`);
      setKpiData(response.data);
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    }
  };

  const fetchInspectionTrend = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/inspection/trend?view=${inspectionTrendFilter}`);
      console.log('Inspection Trend Response:', response.data);

      // Transform the data to match the chart's expected format
      const transformedData = response.data.map(item => ({
        date: item.label,
        total: item.total_inspection,
        inspected: item.inspected_count
      }));

      console.log('Transformed Inspection Trend Data:', transformedData);
      setInspectionTrendData(transformedData);
    } catch (error) {
      console.error('Error fetching inspection trend:', error);
      setInspectionTrendData([]);
    }
  };

  const fetchStageWiseDistribution = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/inspection/stage-distribution?view=${stageWiseFilter}`);
      console.log('Stage Wise Distribution Response:', response.data);

      // Transform the data for the stacked bar chart
      const transformedData = response.data.map(item => {
        const newItem = { label: item.label };
        // Add each stage as a separate data key
        Object.keys(item).forEach(key => {
          if (key !== 'label') {
            newItem[key] = item[key];
          }
        });
        return newItem;
      });

      console.log('Transformed Stage Wise Data:', transformedData);
      setStageWiseData(transformedData);
    } catch (error) {
      console.error('Error fetching stage-wise distribution:', error);
      setStageWiseData([]);
    }
  };

  const fetchDamageDistribution = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/inspection/damage-distribution?filter=${rateFilter}`);
      setDamageDistributionData(response.data);
      console.log('Current stageWiseFilter:', stageWiseFilter);
    } catch (error) {
      console.error('Error fetching damage distribution:', error);
      setDamageDistributionData([]);
    }
  };

  // ... existing styles ...

  return (
    <div style={styles.wrapper}>
      <QASidebar />

      <div style={styles.mainContent}>
        {/* Header Section */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>QA Performance Dashboard</h1>
            <p style={styles.subtitle}>Quality assurance metrics and inspection analysis</p>
          </div>
          <div style={styles.headerActions}>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              style={styles.timeFilter}
            >
              <option value="today">Today</option>
              <option value="this_month">This month</option>
              <option value="this_year">This year</option>
            </select>
            <button style={styles.exportButton}>
              <span>Export Report</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={styles.kpiContainer}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiValue}>{kpiData.total_inspected}</div>
            <div style={styles.kpiLabel}>Total Inspections</div>
            <div style={styles.kpiDescription}>Count of completed Inspections</div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiValue}>{(kpiData.avg_inspection_time_sec / 3600).toFixed(2)} hr</div>
            <div style={styles.kpiLabel}>Avg. Inspection Time</div>
            <div style={styles.kpiDescription}>Average time per inspection (in hours)</div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiValue}>{kpiData.verification_success_rate}%</div>
            <div style={styles.kpiLabel}>Verification Success Rate</div>
            <div style={styles.kpiDescription}>Percentage of Review instances confirmed by QC without changes </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={styles.chartsContainer}>
          {/* Inspection Timeline Chart */}
          <div style={styles.chartCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <div>
                <h3 style={styles.chartTitle}>Inspection Timeline</h3>
                <p style={styles.chartDescription}>Inspection count over time</p>
              </div>
              <select
                value={inspectionTrendFilter}
                onChange={(e) => setInspectionTrendFilter(e.target.value)}
                style={styles.timeFilter}
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div style={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={inspectionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    domain={[0, 'auto']}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    formatter={(value) => [value.toLocaleString(), 'Count']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Inspections"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inspected"
                    name="Inspected"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stage-Wise Inspection Trend Chart */}
          <div style={styles.chartCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <div>
                <h3 style={styles.chartTitle}>Stage-Wise Inspection Trend</h3>
                <p style={styles.chartDescription}>Inspection distribution across stages</p>
              </div>

              <select
                value={stageWiseFilter}
                onChange={(e) => setStageWiseFilter(e.target.value)}
                style={styles.timeFilter}
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div style={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stageWiseData} barSize={50} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="4 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  {stageWiseData.length > 0 && Object.keys(stageWiseData[0])
                    .filter(key => key !== 'label')
                    .map((key, index) => (
                      <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={styles.bottomSection}>
          {/* Inspection Log Table */}
          <div style={styles.tableCard} className="tableCard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <h3 style={styles.chartTitle}>Inspection Log</h3>
                <p style={styles.chartDescriptionWithSpace}>Recent inspection activities</p>
              </div>
              
              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                style={styles.timeFilter}
              >
                <option value="today">Today</option>
                <option value="this_month">This month</option>
                <option value="this_year">This year</option>
              </select>
            </div>
            
            <div style={styles.tableWrapper}>
              <div style={{ overflowX: 'auto', width: '100%', minHeight: '1px' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>InspectionID</th>
                      <th style={styles.th}>Stage</th>
                      <th style={styles.th}>Bag Type</th>
                      <th style={styles.th}>Defect Class</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Inspector</th>
                      <th style={styles.th}>Inspection Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { IID: '001', stage: 'Arrival', bagType: 'Bags', defectClass: 'Zipper failure', status: 'Pending', Inspector: 'Tom', time: '10:30 AM' },
                      { IID: '002', stage: 'Inspection', bagType: 'Trolley', defectClass: 'Break', status: 'Verified', Inspector: 'James', time: '11:15 AM' },
                      { IID: '003', stage: 'Dispatch', bagType: 'Trolley', defectClass: 'Deform', status: 'Pending', Inspector: 'Tom', time: '12:00 PM' },
                      { IID: '004', stage: 'Dispatch', bagType: 'Travel Bag', defectClass: 'None', status: 'Verified', Inspector: 'Liya', time: '12:45 PM' },
                      { IID: '005', stage: 'Arrival', bagType: 'Carton', defectClass: 'Break', status: 'Pending', Inspector: 'Liya', time: '1:30 PM' }
                    ].map((log, index) => (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.td}>{log.IID}</td>
                        <td style={styles.td}>{log.stage}</td>
                        <td style={styles.td}>{log.bagType}</td>
                        <td style={styles.td}>{log.defectClass}</td>
                        <td style={styles.td}>{log.status}</td>
                        <td style={styles.td}>{log.Inspector}</td>
                        <td style={styles.td}>{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={styles.viewMoreContainer}>
              <button
                style={styles.viewMoreButton}
              // onClick={() => navigate('/history')}
              >
                View More &rarr;
              </button>
            </div>
          </div>

          {/* Inspection Rate Chart */}
          <div style={styles.chartCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <h3 style={styles.chartTitle}>Inspected Damage Type Distribution</h3>
                <p style={styles.chartDescriptionWithSpace}>Breakdown of QC-verified damages across inspected bags</p>
              </div>
              
              <select
                value={rateFilter}
                onChange={(e) => setRateFilter(e.target.value)}
                style={styles.timeFilter}
              >
                <option value="today">Today</option>
                <option value="this_month">This month</option>
                <option value="this_year">This year</option>
              </select>
            </div>
          
            <div style={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={damageDistributionData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={false}
                  >
                    {damageDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0',
    color: '#111827',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  headerActions: {
    display: 'flex',
    gap: '16px',
  },
  timeFilter: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    background: '#fff',
  },
  exportButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  kpiContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
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
  kpiDescription: {
    fontSize: '12px',
    color: '#6b7280',
    fontFamily: "Inter, Arial, sans-serif",
  },
  chartsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  chartCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: 0,
    height: '100%',
    boxSizing: 'border-box',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  chartDescription: {
    fontSize: '14px',
    color: '#6b7280',
  },
  chartDescriptionWithSpace: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '18px 0 10px 0', // More space above
  },
  chartFilter: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    background: '#fff',
  },
  chart: {
    marginTop: '16px',
  },
  tableCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: 0,
    height: '100%',
    boxSizing: 'border-box',
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: '1rem',
    width: '100%',
    maxWidth: '100%',
    minHeight: '1px',
    boxSizing: 'border-box',
  },
  table: {
    width: '100%',
    minWidth: '700px',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: '13px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  th: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: 600,
    fontSize: '13px',
    color: '#374151',
    background: '#f3f4f6',
    padding: '10px 12px',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap',
  },
  td: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: 400,
    fontSize: '13px',
    color: '#111827',
    padding: '10px 12px',
    borderBottom: '1px solid #f1f5f9',
    background: '#fff',
    whiteSpace: 'nowrap',
  },
  tr: {
    background: '#fff',
  },
  bottomSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  viewMoreContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '18px',
    width: '100%',
  },
  viewMoreButton: {
    padding: '8px 24px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    color: '#2563eb',
    fontWeight: 500,
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: 'isHover ? 16 : 14',
    cursor: 'pointer',
    transition: 'font-size 0.8s ease',
    outline: 'none',
  },
};

export default QAPerformance; 
