import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, count, description, icon, link, trend }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => link && navigate(link)}
      style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: link ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        display: 'flex',
        gap: '16px',
        '&:hover': {
          transform: link ? 'translateY(-2px)' : 'none',
          boxShadow: link ? '0 4px 6px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
        }
      }}
    >
      {icon && <div style={{ fontSize: '24px' }}>{icon}</div>}
      <div style={{ flex: 1 }}>
        <h3 style={{ 
          fontSize: '24px', 
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 4px 0'
        }}>
          {count}
        </h3>
        <p style={{ 
          fontSize: '14px',
          fontWeight: '500',
          color: '#4b5563',
          margin: '0 0 4px 0'
        }}>
          {title}
        </p>
        {description && (
          <p style={{
            fontSize: '12px',
            color: '#64748b',
            margin: '0'
          }}>
            {description}
          </p>
        )}
        {trend && (
          <span style={{
            fontSize: '12px',
            color: trend.startsWith('+') ? '#16a34a' : '#dc2626',
            display: 'block',
            marginTop: '4px'
          }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard; 