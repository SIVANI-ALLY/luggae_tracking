import React from 'react';

const VerificationsTable = ({ verifications }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 4px 0'
        }}>
          Recent Verifications
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          margin: '0'
        }}>
          Latest QC verifications and their status
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th style={styles.th}>Cargo ID</th>
              <th style={styles.th}>Detection Time</th>
              <th style={styles.th}>Verification Time</th>
              <th style={styles.th}>Damage Type</th>
              <th style={styles.th}>QC Status</th>
              <th style={styles.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {verifications.map((verification, index) => (
              <tr 
                key={verification.cargoId}
                style={{
                  ...styles.tr,
                  background: index % 2 === 0 ? '#f8fafc' : '#fff'
                }}
              >
                <td style={styles.td}>{verification.cargoId}</td>
                <td style={styles.td}>{verification.detectionTime}</td>
                <td style={styles.td}>{verification.verificationTime}</td>
                <td style={styles.td}>{verification.damageType}</td>
                <td style={styles.td}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: verification.status === 'Confirmed' ? '#dcfce7' : '#fee2e2',
                    color: verification.status === 'Confirmed' ? '#166534' : '#991b1b'
                  }}>
                    {verification.status}
                  </span>
                </td>
                <td style={styles.td}>{verification.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
    textTransform: 'uppercase'
  },
  tr: {
    transition: 'background 0.2s ease',
    '&:hover': {
      background: '#f1f5f9'
    }
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#475569',
    borderBottom: '1px solid #e2e8f0'
  }
};

export default VerificationsTable; 