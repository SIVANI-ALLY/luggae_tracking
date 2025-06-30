import React from 'react';
import AlertCard from './AlertCard';

const styles = {
  alertsSection: {
    padding: '24px',
    background: '#f8fafc'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '24px'
  },
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  }
};

const AlertsSection = ({ alerts, onVerify }) => {
  console.log('AlertsSection received alerts:', alerts);

  return (
    <div style={styles.alertsSection}>
      <h2 style={styles.sectionTitle}>Low Confidence Detections</h2>
      <div style={styles.alertsGrid}>
        {alerts
          .sort((a, b) => a.confidence - b.confidence)
          .slice(0, 4)
          .map((alert) => {
            console.log('Processing alert:', alert);
            return (
              <AlertCard
                key={alert.id}
                id={alert.id}
                image_path={alert.image_path}
                confidence={typeof alert.confidence === 'number' && alert.confidence > 1 ? alert.confidence / 100 : alert.confidence}
                damageType={alert.damageType}
                fileType={alert.fileType}
                detectionTime={alert.detectionTime}
                onVerify={onVerify}
                stage_name={alert.stage_name || alert.Stage_name}
              />
            );
          })}
      </div>
    </div>
  );
};

export default AlertsSection; 