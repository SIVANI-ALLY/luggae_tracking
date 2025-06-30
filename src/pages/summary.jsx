import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Box, Paper, Typography, Chip } from '@mui/material';

const DefectSummaryPage = () => {
  const { cargoId } = useParams();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [stages, setStages] = useState(["All Stages"]);
  const [defects, setDefects] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [activeStage, setActiveStage] = useState("All Stages");
  const [selectedDefects, setSelectedDefects] = useState([]);
  const [modalMedia, setModalMedia] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/summary/${cargoId}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setSummaryData(data);
        setDefects(data.defects || []);
        setImages(data.images || []);
        setVideos(data.videos || []);
        setLoading(false);
      });  
  }, [cargoId]);
  useEffect(() => {
    const allStages = Array.from(new Set([
      ...images.map(img => img.stage),
      ...videos.map(vid => vid.stage)
    ])).sort();
    setStages(["All Stages", ...allStages]);
    setActiveStage("All Stages");
  }, [images, videos]);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const stageMatch = activeStage === "All Stages" || img.stage === activeStage;
      const defectMatch = selectedDefects.length === 0 ||
        selectedDefects.some((d) => img.defects.includes(d));
      return stageMatch && defectMatch;
    });
  }, [images, activeStage, selectedDefects]);

  const filteredVideos = useMemo(() => {
    if (activeStage === "All Stages") return videos;
    return videos.filter((v) => v.stage === activeStage);
  }, [videos, activeStage]);

  const toggleDefect = (defect) => {
    setSelectedDefects((prev) =>
      prev.includes(defect)
        ? prev.filter((d) => d !== defect)
        : [...prev, defect]
    );
  };

  const clearFilters = () => {
    setActiveStage("All Stages");
    setSelectedDefects([]);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div>No data found.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, Arial, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "32px 40px", background: "#f8fafc" }}>
        {/* Header Section */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#111827" }}>
            Cargo Defect Summary
          </h1>
          <div style={{ fontSize: 16, color: "#64748b", marginTop: 8 }}>
            Review all incident results and media for this cargo
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 24, alignItems: "center" }}>
            <div><b>Cargo ID:</b> {summaryData.cargoInfo?.cargoId || ""}</div>
            <div><b>File Type:</b> {summaryData.cargoInfo?.fileType || ""}</div>
            <div><b>Length:</b> {summaryData.cargoInfo?.length || ""}</div>
            <div><b>Breadth:</b> {summaryData.cargoInfo?.breadth || ""}</div>
            <div><b>Height:</b> {summaryData.cargoInfo?.height || ""}</div>
            <div style={{ marginLeft: "auto" }}>
              <input
                type="text"
                placeholder="Search by cargo id"
                style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 16px", fontSize: 14, background: "#fff" }}
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stage Filters */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, overflowX: "auto" }}>
          {stages.map((stage) => (
            <button
              key={stage}
              style={{ padding: "8px 22px", borderRadius: 8, fontWeight: 600, fontSize: 15, background: activeStage === stage ? "#2563eb" : "#e0e7ff", color: activeStage === stage ? "#fff" : "#2563eb", border: "none", boxShadow: activeStage === stage ? "0 2px 8px rgba(37,99,235,0.08)" : "none", cursor: "pointer" }}
              onClick={() => setActiveStage(stage)}
            >
              {stage}
            </button>
          ))}
          <button
            style={{ marginLeft: "auto", padding: "8px 16px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, fontWeight: 500, cursor: "pointer" }}
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* Defect Filter Chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {defects.map((def) => (
            <button
              key={def.name}
              onClick={() => toggleDefect(def.name)}
              style={{ padding: "6px 14px", borderRadius: 20, fontWeight: 500, fontSize: 14, border: "1px solid #e5e7eb", background: selectedDefects.includes(def.name) ? "#2563eb" : def.severity === "severe" ? "#fee2e2" : def.severity === "moderate" ? "#fef9c3" : "#dcfce7", color: selectedDefects.includes(def.name) ? "#fff" : def.severity === "severe" ? "#b91c1c" : def.severity === "moderate" ? "#b45309" : "#15803d" }}
            >
              {def.name}
            </button>
          ))}
        </div>

        {/* Media Section */}
        <Box bgcolor="#fff" px={5} py={4} minHeight={400} boxShadow="0 1px 3px rgba(0,0,0,0.1)" borderRadius="12px">
          {summaryData.cargoInfo?.fileType === "Video" && filteredVideos.length > 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
              <video
                controls
                style={{ 
                  width: "80%", 
                  maxWidth: 700, 
                  borderRadius: 12, 
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  backgroundColor: "#f8fafc"
                }}
                src={filteredVideos[0].url}
              />
            </Box>
          ) : (
            <Box 
              display="grid" 
              gridTemplateColumns="repeat(3, 1fr)" 
              gap={3}
              sx={{
                '@media (max-width: 1200px)': {
                  gridTemplateColumns: 'repeat(2, 1fr)',
                },
                '@media (max-width: 768px)': {
                  gridTemplateColumns: '1fr',
                }
              }}
            >
              {filteredImages.length > 0 ? (
                filteredImages.map((img, idx) => (
                  <Box key={img.id || idx}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        height: '100%'
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`Processed ${img.stage}`}
                        style={{ 
                          width: "100%", 
                          borderRadius: 8, 
                          objectFit: "cover", 
                          maxHeight: 260,
                          border: "1px solid #e5e7eb"
                        }}
                      />
                      <Box mt={2}>
                        <Typography fontSize={14} color="#64748b" fontFamily="Inter, Arial, sans-serif">
                          Stage: {img.stage}
                        </Typography>
                        <Typography fontSize={13} color="#64748b" fontFamily="Inter, Arial, sans-serif">
                          Timestamp: {img.timestamp}
                        </Typography>
                        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                          {img.defects && img.defects.map((defect, i) => (
                            <Chip
                              key={i}
                              label={defect}
                              size="small"
                              sx={{
                                backgroundColor: img.defects.includes(defect) ? "#2563eb" : "#e5e7eb",
                                color: img.defects.includes(defect) ? "#fff" : "#64748b",
                                fontWeight: 600,
                                fontSize: 12,
                                height: 24,
                                fontFamily: "Inter, Arial, sans-serif",
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                ))
              ) : (
                <Typography color="#64748b" fontFamily="Inter, Arial, sans-serif">
                  No images available
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </div>

      {/* Modal */}
      {modalMedia && (
        <div
          onClick={() => setModalMedia(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}
        >
          {modalMedia.type === "image" ? (
            <img src={modalMedia.src} alt="Modal" style={{ maxHeight: "80%", maxWidth: "90%" }} />
          ) : (
            <video src={modalMedia.src} style={{ maxHeight: "80%", maxWidth: "90%" }} controls autoPlay />
          )}
        </div>
      )}
    </div>
  );
};

export default DefectSummaryPage;
