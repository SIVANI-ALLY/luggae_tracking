import React from 'react';
import Sidebar from '../components/Sidebar';
import { FONT_FAMILY, COLORS, COMMON_STYLES } from '../constants/styles';

const ReportHub = () => {
  const reports = [
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
      icon: '📊'
    },
    {
      title: 'Monthly Performance Review',
      description: 'Comprehensive analysis of operational performance',
      format: 'PowerPoint',
      lastGenerated: '31 Mar 2023',
      icon: '📈'
    },
    {
      title: 'Quality Audit Report',
      description: 'Compliance and quality metrics assessment',
      format: 'PDF',
      lastGenerated: '10 Apr 2023',
      icon: '✓'
    }
  ];

  const handleDownload = (report) => {
    // Implement download logic
    console.log(`Downloading ${report.title}`);
  };

  const handleGenerateNew = (report) => {
    // Implement generate logic
    console.log(`Generating new ${report.title}`);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Reports</h1>
            <div style={styles.subtitle}>Report Templates</div>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.date}>June 4th, 2023</span>
            <button style={styles.generateButton}>Generate Report</button>
          </div>
        </div>

        <div style={styles.reportsGrid}>
          {reports.map((report, index) => (
            <div key={index} style={styles.reportCard}>
              <div style={styles.reportHeader}>
                <span style={styles.reportIcon}>{report.icon}</span>
                <div style={styles.reportInfo}>
                  <h3 style={styles.reportTitle}>{report.title}</h3>
                  <p style={styles.reportDescription}>{report.description}</p>
                </div>
              </div>
              
              <div style={styles.reportMeta}>
                <div>
                  <span style={styles.label}>Format:</span>
                  <span style={styles.value}>{report.format}</span>
                </div>
                <div>
                  <span style={styles.label}>Last Generated:</span>
                  <span style={styles.value}>{report.lastGenerated}</span>
                </div>
              </div>

              <div style={styles.reportActions}>
                <button
                  onClick={() => handleDownload(report)}
                  style={styles.downloadButton}
                >
                  Download
                </button>
                <button
                  onClick={() => handleGenerateNew(report)}
                  style={styles.generateNewButton}
                >
                  Generate New
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: COLORS.background.main,
    fontFamily: FONT_FAMILY,
  },
  content: {
    flex: 1,
    padding: '24px 32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  date: {
    color: COLORS.text.secondary,
    fontSize: '14px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: COLORS.text.primary,
    margin: '0',
  },
  subtitle: {
    fontSize: '14px',
    color: COLORS.text.secondary,
    marginTop: '4px',
  },
  generateButton: {
    padding: '8px 16px',
    background: COLORS.primary,
    color: '#fff',
    border: 'none',
    borderRadius: COMMON_STYLES.borderRadius,
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '24px',
  },
  reportCard: {
    background: COLORS.background.card,
    borderRadius: COMMON_STYLES.borderRadius,
    padding: '20px',
    boxShadow: COMMON_STYLES.cardShadow,
  },
  reportHeader: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  reportIcon: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: COLORS.background.hover,
    borderRadius: COMMON_STYLES.borderRadius,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: COLORS.text.primary,
    margin: '0 0 4px 0',
  },
  reportDescription: {
    fontSize: '14px',
    color: COLORS.text.secondary,
    margin: '0',
  },
  reportMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderTop: `1px solid ${COLORS.border}`,
    borderBottom: `1px solid ${COLORS.border}`,
    marginBottom: '16px',
    fontSize: '14px',
  },
  label: {
    color: COLORS.text.secondary,
    marginRight: '8px',
  },
  value: {
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  reportActions: {
    display: 'flex',
    gap: '12px',
  },
  downloadButton: {
    flex: 1,
    padding: '8px 0',
    background: COLORS.background.card,
    color: COLORS.primary,
    border: `1px solid ${COLORS.primary}`,
    borderRadius: COMMON_STYLES.borderRadius,
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  generateNewButton: {
    flex: 1,
    padding: '8px 0',
    background: COLORS.primary,
    color: '#fff',
    border: 'none',
    borderRadius: COMMON_STYLES.borderRadius,
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

export default ReportHub; 