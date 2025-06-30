import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "./Sidebar.jsx";
import QCSidebar from "../components/Sidebar.jsx";

const FONT_FAMILY = "Inter, Arial, sans-serif";
const BG_COLOR = "#f8fafc";
const CARD_BG = "#fff";
const HEADER_BG = "#fff";
const DETAILS_BG = "#fff";
const ACCENT = "#111827";
const SUBTLE = "#64748b";

const ResultsPage = () => {
  const { cargoId, stage } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  // Determine which sidebar to use based on the route state
  const isFromQC = location.state?.fromQC || false;
  const SidebarComponent = isFromQC ? QCSidebar : Sidebar;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/summary/${cargoId}/${stage}`);
        if (response.data.error) {
          console.log(response.data.error);
          setError(response.data.error);
        } else {
          setResults(response.data);
          console.log(response.data)
        }
      } catch (err) {
        setError("Failed to fetch results");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [cargoId]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "severe": return "#ff1744";
      case "moderate": return "#ff9100";
      case "minor": return "#00e676";
      default: return "#757575";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "#00e676";
    if (confidence >= 0.6) return "#ff9100";
    return "#ff1744";
  };

  const getAverageConfidence = (images) => {
    if (!images?.length) return null;
    const confidences = images.map(img => img.confidence).filter(Boolean);
    return confidences.length ? (confidences.reduce((a, b) => a + b, 0) / confidences.length) : null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" fontFamily={FONT_FAMILY}>
        <Typography variant="h6" color={ACCENT}>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" minHeight="100vh" fontFamily={FONT_FAMILY}>
        <SidebarComponent />
        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          <Paper sx={{ p: 4, textAlign: "center", fontFamily: FONT_FAMILY }}>
            <Typography color="error" variant="h6">No Detection found in this !</Typography>
            <IconButton onClick={() => navigate("/dashboard")} sx={{ mt: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    );
  }

  const details = results.cargoInfo;
  const filteredImages = results.images || [];
  const filteredVideos = results.videos || [];
  const avgConfidence = getAverageConfidence(filteredImages);

  return (
    <Box display="flex" minHeight="100vh" fontFamily={FONT_FAMILY}>
      {/* Sidebar */}
      <Box sx={{ width: 280, display: "flex", bgcolor: "#fff", flexShrink: 0, borderRight: "1px solid #e5e7eb" }}>
        <SidebarComponent />
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} bgcolor={BG_COLOR} p={3} overflow="auto">
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor={HEADER_BG}
          px={5}
          py={3}
          boxShadow="0 1px 3px rgba(0,0,0,0.1)"
          borderRadius="12px"
          mb={3}
        >
          <Typography variant="h4" fontWeight={700} color={ACCENT}>
            Cargo Sight Report
          </Typography>
          <Typography variant="h6" fontWeight={500} color={ACCENT}>
            Cargo Id: <strong>{details.cargoId}</strong>
          </Typography>
        </Box>

        {/* Details */}
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          bgcolor={DETAILS_BG}
          px={5}
          py={3}
          mb={3}
          boxShadow="0 1px 3px rgba(0,0,0,0.1)"
          borderRadius="12px"
          gap={4}
        >
          {[
            { label: "File Type", value: details.fileType },
            { label: "Region", value: details.region || "-" },
            { label: "Warehouse", value: details.warehouse || "-" },
            { label: "Length", value: `${details.length}cm` },
            { label: "Breadth", value: `${details.breadth}cm` },
            { label: "Height", value: `${details.height}cm` }
          ].map(({ label, value }) => (
            <Typography key={label} sx={{ minWidth: 120, color: ACCENT, fontWeight: 500 }}>
              <b>{label}:</b> {value}
            </Typography>
          ))}
        </Box>

        {/* Stage, Damage, Confidence */}
        <Box
          bgcolor={HEADER_BG}
          px={5}
          py={3}
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          gap={4}
          mb={3}
          boxShadow="0 1px 3px rgba(0,0,0,0.1)"
          borderRadius="12px"
        >
          <Typography variant="subtitle1" fontWeight={600} color={ACCENT}>
            <span style={{ textDecoration: 'underline' }}>Stage:</span> {details.stage_name}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="subtitle1" fontWeight={600} color={ACCENT}>
              Damage Types:
            </Typography>
            {results.defects.map((defect) => (
              <Chip
                key={defect.name}
                label={defect.name}
                sx={{
                  backgroundColor: getSeverityColor(defect.severity),
                  color: "white",
                  fontWeight: 600,
                  fontSize: 14,
                  height: 28,
                  fontFamily: FONT_FAMILY
                }}
              />
            ))}
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1" fontWeight={600} color={ACCENT}>
              Confidence Score:
            </Typography>
            {details.fileType === "Video" && avgConfidence !== null && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={avgConfidence * 100}
                  sx={{
                    width: 140,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getConfidenceColor(avgConfidence),
                      borderRadius: 4
                    }
                  }}
                />
                <Typography fontWeight={600} color={getConfidenceColor(avgConfidence)}>
                  {(avgConfidence * 100).toFixed(1)}%
                </Typography>
              </>
            )}
            {details.fileType === "Image" && filteredImages.length > 0 && filteredImages[0].confidence !== undefined && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={filteredImages[0].confidence * 100}
                  sx={{
                    width: 140,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getConfidenceColor(filteredImages[0].confidence),
                      borderRadius: 4
                    }
                  }}
                />
                <Typography fontWeight={600} color={getConfidenceColor(filteredImages[0].confidence)}>
                  {(filteredImages[0].confidence * 100).toFixed(1)}%
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Media Content */}
        <Box bgcolor={DETAILS_BG} px={5} py={4} minHeight={400} boxShadow="0 1px 3px rgba(0,0,0,0.1)" borderRadius="12px">
          {details.fileType === "Video" && filteredVideos.length > 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
              <video
                controls
                autoPlay
                muted
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
              gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
              gap={3}
            >
              {filteredImages.length > 0 ? (
                filteredImages.map((img, idx) => (
                  <Paper
                    key={img.id || idx}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: CARD_BG,
                      border: "1px solid #e5e7eb"
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
                      <Typography fontSize={14} color={SUBTLE}>
                        Stage: {img.stage}
                      </Typography>
                      <Typography fontSize={13} color={SUBTLE}>
                        Timestamp: {img.timestamp}
                      </Typography>
                      <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                        {img.defects?.map((defect, i) => (
                          <Chip
                            key={i}
                            label={defect}
                            size="small"
                            sx={{
                              backgroundColor: getSeverityColor(results.defects.find(d => d.name === defect)?.severity || "minor"),
                              color: "white",
                              fontWeight: 600,
                              fontSize: 12,
                              height: 24
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Typography color={SUBTLE}>No images available</Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ResultsPage;
