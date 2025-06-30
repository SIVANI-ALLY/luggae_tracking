import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

const CargoResultCard = ({ result }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [damageInfo, setDamageInfo] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    const fetchDamageInfo = async () => {
      try {
        console.log("Fetching damage info for cargo_id:", result.cargo_id);
        const response = await axios.get(`http://127.0.0.1:8000/damage_info/${result.cargo_id}`);
        console.log("Damage info response:", response.data);
        
        if (response.data && response.data.damage_info && response.data.damage_info.length > 0) {
          const latestDamageInfo = response.data.damage_info[0];
          console.log("Latest damage info:", latestDamageInfo);
          console.log("Image path from backend:", latestDamageInfo.Output_image_path);
          setDamageInfo(latestDamageInfo);
        } else {
          console.log("No damage info found");
          setError("No damage information available");
        }
      } catch (err) {
        console.error("Error fetching damage info:", err);
        setError("Failed to fetch damage information");
      } finally {
        setLoading(false);
      }
    };

    if (result?.cargo_id) {
      fetchDamageInfo();
    }
  }, [result?.cargo_id]);

  const handleImageError = (e) => {
    console.error("Error loading output image. Path:", damageInfo.Output_image_path);
    console.error("Full image URL:", `http://127.0.0.1:8000/${damageInfo.Output_image_path}`);
    setImageLoadError(true);
    e.target.style.display = 'none';
  };

  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>CargoSight Report</h1>
          <div style={styles.subtitle}>AI Analysis Results</div>
        </div>
        
        <div style={styles.content}>
          {/* Left Section - Input Details */}
          <div style={styles.leftSection}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Input Details</h2>
              <div style={styles.detailsList}>
                <div style={styles.detailItem}>
                  <span style={styles.label}>File Name:</span>
                  <span style={styles.value}>{result?.file_name || 'N/A'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Region:</span>
                  <span style={styles.value}>{result?.region || 'N/A'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Country:</span>
                  <span style={styles.value}>{result?.country || 'N/A'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Warehouse:</span>
                  <span style={styles.value}>{result?.warehouse || 'N/A'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Processing Stage:</span>
                  <span style={styles.value}>{result?.stage_name || 'N/A'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Dimensions (cm):</span>
                  <div style={styles.dimensions}>
                    <div>Length: {result?.length || 'N/A'}</div>
                    <div>Breadth: {result?.breadth || 'N/A'}</div>
                    <div>Height: {result?.height || 'N/A'}</div>
                  </div>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Upload Time:</span>
                  <span style={styles.value}>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - AI Analysis */}
          <div style={styles.rightSection}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>AI Analysis Results</h2>
              <div style={styles.detailsList}>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Cargo ID:</span>
                  <span style={styles.value}>{result?.cargo_id || 'N/A'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Cargo Type:</span>
                  <span style={styles.value}>{result?.bag_type || 'N/A'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Defect Type:</span>
                  <span style={styles.value}>{damageInfo?.Defect_class || 'N/A'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Confidence:</span>
                  <span style={styles.value}>
                    {damageInfo?.Confidence ? `${(damageInfo.Confidence * 100).toFixed(2)}%` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Defect Detection Image */}
              <div style={styles.imageSection}>
                <h3 style={styles.imageTitle}>Defect Detection Result</h3>
                {damageInfo?.Output_image_path ? (
                  <div style={styles.imageContainer}>
                    {imageLoadError ? (
                      <div style={styles.noImage}>
                        Failed to load image. Please check the console for details.
                      </div>
                    ) : (
                      <img 
                        src={`http://127.0.0.1:8000/${damageInfo.Output_image_path.replace(/\\/g, '/')}`}
                        alt="Detected Defect"
                        style={styles.image}
                        onError={handleImageError}
                      />
                    )}
                  </div>
                ) : (
                  <div style={styles.noImage}>
                    {loading ? "Loading image..." : "No defect detection available"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {loading && <div style={styles.loading}>Loading damage information...</div>}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Inter, Arial, sans-serif",
  },
  main: {
    flex: 1,
    padding: "32px 40px",
  },
  header: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
  },
  content: {
    display: "flex",
    gap: 24,
    marginTop: 24,
  },
  leftSection: {
    flex: 1,
    minWidth: 0,
  },
  rightSection: {
    flex: 2,
    minWidth: 0,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 16px 0",
  },
  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  label: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: 500,
  },
  value: {
    color: "#111827",
    fontSize: 14,
    fontWeight: 500,
  },
  dimensions: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    color: "#111827",
    fontSize: 16,
  },
  imageSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTop: "1px solid #e2e8f0",
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  noImage: {
    padding: "40px",
    background: "#f1f5f9",
    borderRadius: 8,
    color: "#64748b",
    textAlign: "center",
    fontSize: 16,
  },
  error: {
    textAlign: "center",
    padding: "32px",
    color: "#dc2626",
    fontSize: 14,
    fontFamily: "Inter, Arial, sans-serif",
  },
  loading: {
    textAlign: "center",
    padding: "32px",
    color: "#64748b",
    fontSize: 14,
    fontFamily: "Inter, Arial, sans-serif",
  },
};

export default CargoResultCard; 