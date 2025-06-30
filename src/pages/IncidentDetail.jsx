import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const IncidentDetail = () => {
  const { cargoId, stageName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [incident, setIncident] = useState(null);
  const [activeTab, setActiveTab] = useState('review');
  const [confirmPayload, setConfirmPayload] = useState({ images: [], notes: '' });
  const [update, setUpdate] = useState({
    errorType: '',
    bagType: '',
    damageType: '',
    assignTo: '',
    images: [],
    notes: '',
  });
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        console.log('Fetching incident data for cargo ID:', cargoId);
        const response = await fetch('http://127.0.0.1:8000/pending');
        if (!response.ok) {
          throw new Error('Failed to fetch incident data');
        }
        const data = await response.json();
        const incidentsData = Array.isArray(data) ? data : (data?.incidents || []);
        
        // Find the specific incident
        const currentIncident = incidentsData.find(inc => 
          (inc.cargo_id || inc.Cargo_id) === cargoId && 
          (inc.stage_name || inc.Stage_name) === stageName
        );

        if (currentIncident) {
          console.log('Found incident:', currentIncident); // Debug log
          setIncident({
            id: cargoId,
            Cargo_id: cargoId,
            Stage_name: stageName,
            Bag_type: currentIncident.bag_type || currentIncident.Bag_type || 'N/A',
            Defect_class: currentIncident.defect_class || currentIncident.Defect_class || 'N/A',
            confidence: currentIncident.confidence || currentIncident.Confidence || 0,
            dimensions: { length: 60, width: 40, height: 25 }, // Default values
            region: 'Asia',
            fileType: 'N/A',
            WarehouseName: 'Warehouse 1',
            timestamp: currentIncident.detection_time || currentIncident.inspect_time || new Date().toISOString(),
            image_path: currentIncident.image_path || '' // Add image path
          });
          setUpdate(p => ({ 
            ...p, 
            bagType: currentIncident.bag_type || currentIncident.Bag_type || '', 
            damageType: currentIncident.defect_class || currentIncident.Defect_class || '' 
          }));
        } else {
          setError('Incident not found');
        }
      } catch (err) {
        console.error("Error fetching incident data:", err);
        setError("Failed to load incident data");
      } finally {
        setLoading(false);
      }
    };

    if (cargoId && stageName) {
      fetchIncidentData();
    }
  }, [cargoId, stageName]);

  const handleImgUpload = (e, isUpdate = false) => {
    const files = Array.from(e.target.files || []);
    if (isUpdate) {
      setUpdate((p) => ({ ...p, images: [...p.images, ...files] }));
    } else {
      setConfirmPayload((p) => ({ ...p, images: [...p.images, ...files] }));
    }
  };

  const canSave = () => {
    if (activeTab === 'review') {
      return confirmPayload.images.length > 0 || confirmPayload.notes.trim().length > 0;
    }
    if (update.errorType === 'Update Classification') {
      return (
        update.bagType &&
        update.damageType &&
        update.images.length > 0 &&
        update.notes.trim().length > 0
      );
    }
    return update.errorType !== '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!cargoId || !stageName) {
      alert("Cargo ID and Stage Name are required for submission.");
      return;
    }
  
    const formData = new FormData();
    if (update.errorType) formData.append('error', update.errorType);
    if (update.bagType) formData.append('bag_type', update.bagType);
    if (update.damageType) formData.append('damage_type', update.damageType);
    if (file) formData.append('file_path', file);
  
    try {
      console.log('Submitting with cargo ID:', cargoId, 'and stage:', stageName);
      const response = await fetch(`http://localhost:8000/Submit/${cargoId}/${stageName}`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit inspection');
      }
  
      const result = await response.json();
      console.log('Submission successful:', result);
      alert(result.message);
      navigate('/incident');
  
    } catch (error) {
      console.error('Error submitting inspection:', error.message);
      alert(`Error: ${error.message}`);
    }
  };
  
 
  

  if (loading || !incident) {
    return (
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.loadingContainer}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.headerCard}>
          <h1 style={styles.title}>Incident Detail</h1>
          <div style={styles.subtitle}>
            Cargo ID: {incident.Cargo_id} · Detected on {new Date(incident.timestamp).toLocaleString()}
          </div>
        </div>

        {/* Info Cards */}
        <div style={styles.infoSection}>
          <div style={styles.infoCard}>
            <h2 style={styles.infoTitle}>Cargo Info</h2>
            <div style={styles.infoContent}>
              <div style={styles.infoRow}>
                <span>File Type:</span>
                <span>{incident.fileType}</span>
              </div>
              <div style={styles.infoRow}>
                <span>Dimensions:</span>
                <span>{incident.dimensions.length}L × {incident.dimensions.width}B × {incident.dimensions.height}H cm</span>
              </div>
              
            </div>
          </div>

          <div style={styles.infoCard}>
            <h2 style={styles.infoTitle}>Process Info</h2>
            <div style={styles.infoContent}>
              <div style={styles.infoRow}>
                <span>Stage:</span>
                <span>{incident.Stage_name}</span>
              </div>
              <div style={styles.infoRow}>
                <span>Region:</span>
                <span>{incident.region}</span>
              </div>
              <div style={styles.infoRow}>
                <span>Warehouse:</span>
                <span>{incident.WarehouseName}</span>
              </div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <h2 style={styles.infoTitle}>Detection</h2>
            <div style={styles.infoContent}>
              <div style={styles.infoRow}>
                <span>Bag Type:</span>
                <span>{incident.Bag_type}</span>
              </div>
              <div style={styles.infoRow}>
                <span>Defect:</span>
                <span>{incident.Defect_class}</span>
              </div>
              <div style={styles.infoRow}>
                <span>Confidence:</span>
                <span style={{
                  ...styles.confidence,
                  color: incident.confidence < 0.7 ? '#dc2626' : '#16a34a'
                }}>
                  {(incident.confidence * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button 
            style={{
              ...styles.tab,
              ...styles.leftTab,
              ...(activeTab === 'review' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('review')}
          >
            Review & Confirm
          </button>
          <button 
            style={{
              ...styles.tab,
              ...styles.rightTab,
              ...(activeTab === 'update' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('update')}
          >
            Update Action
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {activeTab === 'review' ? (
            <div>
              <div style={styles.uploadSection}>
                <span style={styles.uploadLabel}>Upload Images</span>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImgUpload(e)}
                  style={styles.fileInput}
                />
              </div>
              <textarea
                placeholder="Add notes..."
                style={styles.reviewTextarea}
                value={confirmPayload.notes}
                onChange={(e) => setConfirmPayload(p => ({ ...p, notes: e.target.value }))}
              />
              <button 
                style={{
                  ...styles.submitButton,
                 
                }}
                onClick={handleSubmit}
              >
                Submit Review
              </button>
            </div>
          ) : (
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type of Error / Action</label>
                <select 
                  value={update.errorType}
                  onChange={(e) => setUpdate(p => ({ ...p, errorType: e.target.value }))}
                  style={styles.select}
                >
                  <option value="">Select...</option>
                  <option>Update Classification</option>
                  <option>Technical Issue</option>
                  <option>Mark as Resolved</option>
                </select>
              </div>

              {update.errorType === 'Update Classification' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Bag Type</label>
                    <input
                      type="text"
                      value={update.bagType}
                      onChange={(e) => setUpdate(p => ({ ...p, bagType: e.target.value }))}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Damage Type</label>
                    <input
                      type="text"
                      value={update.damageType}
                      onChange={(e) => setUpdate(p => ({ ...p, damageType: e.target.value }))}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Upload Images</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleImgUpload(e, true)}
                      style={styles.fileInput}
                    />
                  </div>
                </>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Add notes...</label>
                <textarea
                  value={update.notes}
                  onChange={(e) => setUpdate(p => ({ ...p, notes: e.target.value }))}
                  style={styles.textarea}
                  placeholder="Add notes..."
                />
              </div>

              <button 
                style={{
                  ...styles.submitButton,
                  opacity: canSave() ? 1 : 0.5,
                  cursor: canSave() ? 'pointer' : 'not-allowed'
                }}
                onClick={handleSubmit}
                disabled={!canSave()}
              >
                Submit Update
              </button>
            </div>
          )}
        </div>
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
    marginLeft: '230px',
    overflowY: 'hidden',
  },
  headerCard: {
    background: '#fff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: '0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
  },
  infoSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  infoCard: {
    background: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    '& > span:first-child': {
      color: '#6b7280',
    },
    '& > span:last-child': {
      color: '#111827',
      fontWeight: '500',
    },
  },
  confidence: {
    color: '#2563eb',
    fontWeight: '600',
  },
  tabs: {
    display: 'flex',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  leftTab: {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    background: '#f3f4f6',
  },
  rightTab: {
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    background: '#f3f4f6',
  },
  activeTab: {
    background: '#000',
    color: '#fff',
  },
  tabContent: {
    background: '#fff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  uploadSection: {
    marginBottom: '24px',
  },
  uploadLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  uploadArea: {
    border: '2px dashed #e5e7eb',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    color: '#6b7280',
  },
  reviewTextarea: {
    width: '100%',
    minHeight: '200px',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '24px',
    resize: 'vertical',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    background: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    '&:hover': {
      background: '#0284c7',
    },
  },
  formGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#111827',
    background: '#fff',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    marginTop: '4px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  dropdownItem: {
    padding: '10px 12px',
    fontSize: '14px',
    color: '#111827',
    cursor: 'pointer',
    '&:hover': {
      background: '#f3f4f6',
    },
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    resize: 'vertical',
  },
  loadingContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#6b7280',
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
  },
};

export default IncidentDetail;