import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import CargoResultCard from "./CargoResultCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadDemoPage = () => {

  

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [region, setRegion] = useState("Asia");
  const [country, setCountry] = useState("India");
  const [warehouse, setWarehouse] = useState("Warehouse 1");
  const [stage, setStage] = useState("");
  const [length, setLength] = useState("60");
  const [breadth, setBreadth] = useState("40");
  const [height, setHeight] = useState("25");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [cargoIds, setCargoIds] = useState([]);
  const [loadingCargoIds, setLoadingCargoIds] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filters, setFilters] = useState({
    cargoId: ''
  });

  const isFormValid = file && region && country && warehouse && stage && length && breadth && height;

  // Filter cargo IDs based on search term
  const filteredCargoIds = cargoIds.filter(id => 
    id.toLowerCase().includes(filters.cargoId.toLowerCase())
  );

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Debug useEffect to monitor cargo ID changes
  useEffect(() => {
    console.log("filters.cargoId changed to:", filters.cargoId);
  }, [filters.cargoId]);

  useEffect(() => {
    const fetchCargoIds = async () => {
      setLoadingCargoIds(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/cargo_ids");
        // Sort cargo IDs alphabetically
        const sortedIds = response.data.cargo_ids.sort();
        setCargoIds(sortedIds);
      } catch (error) {
        console.error("Error fetching cargo IDs:", error);
      } finally {
        setLoadingCargoIds(false);
      }
    };
    fetchCargoIds();
  }, []);

  useEffect(() => {
    const fetchCargoDetails = async () => {
      if (!filters.cargoId) return;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/cargo_details/${filters.cargoId}`);
        const details = response.data.cargo_details[0];
        if (details) {
          setRegion(details.Region || "Asia");
          setCountry(details.Country || "India");
          setWarehouse(details.Warehouse || "Warehouse 1");
          setLength(details.Length_cm?.toString() || "60");
          setBreadth(details.Breadth_cm?.toString() || "40");
          setHeight(details.Height_cm?.toString() || "25");
        }
      } catch (error) {
        console.error("Error fetching cargo details:", error);
      }
    };
    fetchCargoDetails();
  }, [filters.cargoId]);

  // Handle file preview
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError("");
    
    console.log("Form submission - Current filters.cargoId:", filters.cargoId);
    console.log("Form data being sent:", {
      file: file?.name,
      stage_name: stage,
      region,
      country,
      warehouse,
      length,
      breadth,
      height,
      cargo_id: filters.cargoId || "NOT PROVIDED"
    });
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("stage_name", stage);
      formData.append("region", region);
      formData.append("country", country);
      formData.append("warehouse", warehouse);
      formData.append("length", length);
      formData.append("breadth", breadth);
      formData.append("height", height);
      if (filters.cargoId) {
        formData.append("cargo_id", filters.cargoId);
        console.log("Using existing cargo ID:", filters.cargoId);
      } else {
        console.log("No cargo ID provided - backend will auto-generate");
      }

      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        const resultWithInputImage = {
          ...response.data,
          input_image_path: response.data.file_path,
          region,
          country,
          warehouse,
          stage_name: stage,
          length,
          breadth,
          height,
          file_name: file.name,
        };
        setResult(resultWithInputImage);

        const updatedResponse = await axios.get("http://127.0.0.1:8000/cargo_ids");
        // Sort the updated cargo IDs
        const sortedIds = updatedResponse.data.cargo_ids.sort();
        setCargoIds(sortedIds);

        const newCargoId = response.data.cargo_id;
        const newStageName = response.data.stage_name;

        // Add a small delay to ensure backend processing is complete
        setTimeout(() => {
          navigate(`/results/${newCargoId}/${newStageName}`);
        }, 1000);
      }
    } catch (err) {
      let errorMessage = "An error occurred while uploading the file";
      if (err.response) {
        errorMessage = err.response.data?.detail || err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage = "No response received from server. Please check if the server is running.";
      } else {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // if (result) {
  //   return <CargoResultCard result={result} />;
  // }

  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <div style={styles.main}>
        <h1 style={styles.title}>Upload Demo</h1>
        <div style={styles.subtitle}>
          Upload cargo images or videos to test the AI detection system
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Upload Media</div>
          <div style={styles.cardSubtitle}>Upload an image or video of cargo for AI analysis</div>
          {error && <div style={styles.error}>{error}</div>}

        <div style={styles.cargoIdSection}>
           <div style={styles.cargoIdTitle}>Select Existing Cargo ID (Optional)</div>
            <div style={styles.searchableDropdown}>
              <input
                type="text"
                placeholder="Search and select cargo ID..."
                value={filters.cargoId}
                onChange={(e) => {
                  handleFilterChange('cargoId', e.target.value);
                }}
                style={{
                  ...styles.searchableInput,
                  borderColor: filters.cargoId ? "#10b981" : "#e2e8f0"
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 300)} // Increased timeout
              />
              {showDropdown && (
                <div style={styles.dropdownList}>
                  {loadingCargoIds ? (
                    <div style={styles.dropdownItem}>Loading cargo IDs...</div>
                  ) : filteredCargoIds.length > 0 ? (
                    filteredCargoIds.map((id) => (
                      <div
                        key={id}
                        style={{ ...styles.dropdownItem, backgroundColor: "#fff" }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#fff";
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          console.log("Selecting cargo ID:", id);
                          handleFilterChange('cargoId', id);
                          setShowDropdown(false);
                        }}
                      >
                        {id}
                      </div>
                    ))
                  ) : (
                    <div style={styles.dropdownItem}>No cargo IDs found</div>
                  )}
                </div>
              )}
            </div>
          </div>



          <div style={styles.uploadBox}>
            <div style={styles.fieldLabel}>
              Upload File <span style={styles.required}>*</span>
            </div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.mp4,.mov"
              style={{ display: "none" }}
              id="file-upload"
              onChange={e => setFile(e.target.files[0])}
            />
            <label htmlFor="file-upload" style={styles.uploadLabel}>
              {file ? file.name : (
                <>
                  Drag and drop your file here or click to browse<br />
                  <span style={{ color: "#64748b", fontSize: 14 }}>
                    Supports JPG, PNG, GIF, MP4, MOV up to 10MB
                  </span>
                </>
              )}
            </label>
          </div>

          {/* File Preview */}
          {previewUrl && (
            <div style={styles.previewContainer}>
              <div style={styles.previewTitle}>File Preview:</div>
              {file.type.startsWith('video/') ? (
                <video 
                  style={styles.previewMedia} 
                  controls 
                  src={previewUrl}
                />
              ) : (
                <img 
                  style={styles.previewMedia} 
                  src={previewUrl} 
                  alt="Preview" 
                />
              )}
            </div>
          )}

          <div style={styles.formRow}>
            <select style={styles.select} value={region} onChange={e => setRegion(e.target.value)}>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="America">America</option>
            </select>
            <select style={styles.select} value={country} onChange={e => setCountry(e.target.value)}>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          <div style={styles.formRow}>
            <select style={styles.select} value={warehouse} onChange={e => setWarehouse(e.target.value)}>
              <option value="Warehouse 1">Warehouse 1</option>
              <option value="Warehouse 2">Warehouse 2</option>
            </select>
            <select style={styles.select} value={stage} onChange={e => setStage(e.target.value)}>
              <option value="">Select Stage</option>
              <option value="Arrival">Arrival</option>
              <option value="Inspection">Inspection</option>
              <option value="Dispatch">Dispatch</option>
            </select>
          </div>

          <div style={styles.dimensionsTitle}>Cargo Dimensions (cm)</div>
          <div style={styles.dimensionsRow}>
            <div style={styles.dimensionInput}>
              <input style={styles.input} type="number" placeholder="60L" value={length} onChange={e => setLength(e.target.value)} />
            </div>
            <div style={styles.dimensionInput}>
              <input style={styles.input} type="number" placeholder="40B" value={breadth} onChange={e => setBreadth(e.target.value)} />
            </div>
            <div style={styles.dimensionInput}>
              <input style={styles.input} type="number" placeholder="25H" value={height} onChange={e => setHeight(e.target.value)} />
            </div>
          </div>

          <button
            style={{
              ...styles.processBtn,
              background: isFormValid ? "#111827" : "#cbd5e1",
              cursor: isFormValid ? "pointer" : "not-allowed",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={!isFormValid || loading}
            onClick={handleSubmit}
          >
            {loading ? "Processing..." : "Process with AI"}
          </button>
        </div>
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
    padding: "32px 48px",
    overflowY: "auto",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    color: "#111827",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 16,
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 32,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    maxWidth: 600,
    margin: "0 auto",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#64748b",
    fontSize: 15,
    marginBottom: 18,
  },
  cargoIdSection: {
    marginBottom: 24,
  },
  cargoIdTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 8,
  },
  searchableDropdown: {
    position: "relative",
  },
  searchableInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    fontSize: 15,
    background: "#f8fafc",
    outline: "none",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#fff",
    borderRadius: 6,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    maxHeight: "200px",
    overflowY: "auto",
  },
  dropdownItem: {
    padding: "10px 12px",
    cursor: "pointer",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    transition: "background-color 0.2s",
  },
  uploadBox: {
    border: "2px dashed #cbd5e1",
    borderRadius: 10,
    padding: "32px 0",
    textAlign: "center",
    marginBottom: 24,
    background: "#f8fafc",
    cursor: "pointer",
  },
  uploadLabel: {
    display: "block",
    cursor: "pointer",
    fontSize: 16,
    color: "#111827",
    fontWeight: 500,
  },
  previewContainer: {
    marginBottom: 24,
    padding: "16px",
    background: "#f8fafc",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 12,
  },
  previewMedia: {
    width: "100%",
    maxHeight: "300px",
    borderRadius: 8,
    objectFit: "contain",
    background: "#fff",
  },
  formRow: {
    display: "flex",
    gap: 16,
    marginBottom: 16,
  },
  select: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    fontSize: 15,
    background: "#f8fafc",
    outline: "none",
  },
  dimensionsTitle: {
    fontWeight: 600,
    fontSize: 15,
    margin: "16px 0 8px 0",
    color: "#111827",
  },
  dimensionsRow: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
  },
  dimensionInput: {
    flex: 1,
    minWidth: 0,
  },
  input: {
    padding: "8px 5px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    fontSize: 15,
    background: "#f8fafc",
    outline: "none",
  },
  processBtn: {
    width: "100%",
    padding: "14px 0",
    borderRadius: 8,
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    border: "none",
    marginTop: 18,
    transition: "background 0.2s",
  },
  error: {
    color: "#dc2626",
    fontSize: 14,
    marginBottom: 16,
    padding: "8px 12px",
    background: "#fee2e2",
    borderRadius: 6,
  },
  fieldLabel: {
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 8,
  },
  required: {
    color: "#dc2626",
  },
};

export default UploadDemoPage;