import React from 'react';
import Sidebar from '../components/Sidebar';

const QAReportHub = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const reportTemplates = [
    {
      title: 'Daily Incident Summary',
      description: 'Summary of all incidents in the last 24 hours',
      format: 'PDF',
      lastGenerated: '17 Apr 2023',
      icon: '📄'
    },
    {
      title: 'Weekly Damage Analysis',
      description: 'Breakdown of damage types and trends over the past week',
      format: 'PDF/Excel',
      lastGenerated: '15 Apr 2023',
      icon: '⏱️'
    },
    {
      title: 'Monthly Performance Review',
      description: 'Comprehensive analysis of operational performance',
      format: 'PowerPoint',
      lastGenerated: '31 Mar 2023',
      icon: '📊'
    },
    {
      title: 'Quality Audit Report',
      description: 'Compliance and quality metrics assessment',
      format: 'PDF',
      lastGenerated: '10 Apr 2023',
      icon: '✓'
    }
  ];

  return (
    <div style={styles.wrapper}>
      <Sidebar />
      
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>Reports</h1>
            <div style={styles.currentDate}>{currentDate}</div>
          </div>
          <button style={styles.generateButton}>Generate Report</button>
        </div>

        <div style={styles.tabsContainer}>
          <div style={styles.tabs}>
            <button style={{...styles.tab, ...styles.activeTab}}>Report Templates</button>
            <button style={styles.tab}>Scheduled Reports</button>
          </div>
        </div>

        <div style={styles.reportsGrid}>
          {reportTemplates.map((report, index) => (
            <div key={index} style={styles.reportCard}>
              <div style={styles.reportHeader}>
                <span style={styles.reportIcon}>{report.icon}</span>
                <div style={styles.reportTitleSection}>
                  <h3 style={styles.reportTitle}>{report.title}</h3>
                  <p style={styles.reportDescription}>{report.description}</p>
                </div>
              </div>
              
              <div style={styles.reportDetails}>
                <div style={styles.formatSection}>
                  <span style={styles.label}>Format:</span>
                  <span style={styles.value}>{report.format}</span>
                </div>
                <div style={styles.dateSection}>
                  <span style={styles.label}>Last Generated:</span>
                  <span style={styles.value}>{report.lastGenerated}</span>
                </div>
              </div>

              <div style={styles.reportActions}>
                <button style={styles.downloadButton}>Download</button>
                <button style={styles.generateNewButton}>Generate New</button>
              </div>
            </div>
          ))}
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
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  currentDate: {
    color: '#6b7280',
    fontSize: '14px',
  },
  generateButton: {
    padding: '10px 20px',
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  tabsContainer: {
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '24px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
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
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  reportCard: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  reportHeader: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  reportIcon: {
    fontSize: '24px',
  },
  reportTitleSection: {
    flex: 1,
  },
  reportTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  reportDescription: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  reportDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '16px',
  },
  formatSection: {
    display: 'flex',
    gap: '8px',
  },
  dateSection: {
    display: 'flex',
    gap: '8px',
  },
  label: {
    color: '#6b7280',
    fontSize: '14px',
  },
  value: {
    color: '#111827',
    fontSize: '14px',
    fontWeight: '500',
  },
  reportActions: {
    display: 'flex',
    gap: '12px',
  },
  downloadButton: {
    flex: 1,
    padding: '8px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    color: '#111827',
    fontWeight: '500',
    cursor: 'pointer',
  },
  generateNewButton: {
    flex: 1,
    padding: '8px',
    background: '#2563eb',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default QAReportHub; 