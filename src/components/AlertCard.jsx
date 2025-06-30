import React from 'react';
import { useNavigate } from 'react-router-dom';

const AlertCard = ({ 
  id,
  thumbnail,
  confidence,
  damageType,
  fileType,
  onVerify,
  image_path,
  stage_name
}) => {
  const navigate = useNavigate();

  const getConfidenceColor = (confidence) => {
    if (confidence * 100 < 50) return { bg: '#fee2e2', text: '#991b1b' };
    if (confidence * 100 < 70) return { bg: '#fef3c7', text: '#92400e' };
    return { bg: '#dcfce7', text: '#166534' };
  };

  const colors = getConfidenceColor(confidence);

  const handleVerify = () => {
    if (onVerify) onVerify(id);
    navigate(`/incident/${id}/${stage_name}`);
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }
    }}>
      <div style={{
        position: 'relative',
        paddingTop: '75%', // 4:3 aspect ratio
        background: '#f1f5f9'
      }}>
       {(image_path || thumbnail) && (
  /\.(mp4|webm|ogg)$/i.test(image_path || thumbnail) ? (
    <video
      src={image_path || thumbnail}
      controls
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
      onError={(e) => {
        console.error('Error loading video:', e);
        e.target.poster = 'fallback-thumbnail.png'; // Optional fallback image
      }}
    />
  ) : (
    <img
      src={image_path || thumbnail || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
      alt={`Damage detection ${id}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
      onError={(e) => {
        console.error('Error loading image:', e);
        e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      }}
    />
  )
)}

      </div>
      
      <div style={{ padding: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500',
            background: colors.bg,
            color: colors.text
          }}>
            {(confidence * 100).toFixed(2)}% Confidence
          </span>
          <span style={{
            fontSize: '12px',
            color: '#64748b'
          }}>
            {fileType}
          </span>
        </div>

        <div style={{
          marginBottom: '12px'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#111827',
            margin: '0 0 4px 0'
          }}>
            {damageType}
          </h4>
          <p style={{
            fontSize: '12px',
            color: '#64748b',
            margin: '0'
          }}>
            {stage_name}
          </p>
        </div>

        <button
          onClick={handleVerify}
          style={{
            width: '100%',
            padding: '8px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            '&:hover': {
              background: '#1d4ed8'
            }
          }}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default AlertCard; 