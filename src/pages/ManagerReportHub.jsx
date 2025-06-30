import React, { useState } from 'react';
import ManagerSidebar from '../components/ManagerSidebar';

const ManagerReportHub = () => {
  const [activeTab, setActiveTab] = useState('Available Reports');
  
  const reports = [
    { id: 'REP-001', title: 'Monthly Damage Summary', date: '2025-04-01', status: 'Completed' },
    { id: 'REP-002', title: 'Detection Accuracy Report', date: '2025-04-05', status: 'Completed' },
    { id: 'REP-003', title: 'Warehouse Performance', date: '2025-04-10', status: 'Processing' },
    { id: 'REP-004', title: 'Quarterly Audit Results', date: '2025-04-15', status: 'Scheduled' },
    { id: 'REP-005', title: 'System Health Check', date: '2025-04-20', status: 'Completed' },
  ];

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { color: '#059669', background: '#ecfdf5' };
      case 'processing':
        return { color: '#2563eb', background: '#eff6ff' };
      case 'scheduled':
        return { color: '#d97706', background: '#fef3c7' };
      default:
        return { color: '#6b7280', background: '#f3f4f6' };
    }
  };

  return (
    <div style={styles.wrapper}>
      <ManagerSidebar />
      
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Reports</h1>
            <p style={styles.subtitle}>Warehouse reports and analytics</p>
          </div>
        </div>

        <div style={styles.tabs}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'Available Reports' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('Available Reports')}
          >
            Available Reports
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'Damage Summary' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('Damage Summary')}
          >
            Damage Summary
          </button>
        </div>

        <div style={styles.contentHeader}>
          <h2 style={styles.contentTitle}>Available Reports</h2>
          <div style={styles.actions}>
            <button style={styles.filterButton}>
              <span>Filter</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button style={styles.exportButton}>
              <span>Export</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Report ID</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} style={styles.tr}>
                  <td style={styles.td}>{report.id}</td>
                  <td style={styles.td}>{report.title}</td>
                  <td style={styles.td}>{report.date}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.status,
                      ...getStatusStyle(report.status)
                    }}>
                      {report.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.viewButton}>View</button>
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
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '24px',
  },
  tab: {
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  activeTab: {
    color: '#2563eb',
    borderBottomColor: '#2563eb',
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  contentTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  filterButton: {
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
  tableContainer: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 24px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#111827',
  },
  status: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
  },
  viewButton: {
    padding: '6px 12px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default ManagerReportHub; 