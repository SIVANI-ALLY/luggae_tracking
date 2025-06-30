import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import UploadDemoPage from './pages/UploadDemoPage';
import ResultsPage from './pages/ResultsPage';
import HistoricPage from './pages/HistoricPage';
import DefectSummaryPage from './pages/summary';
import QCDashboard from './pages/QCDashboard';
import IncidentLog from './pages/IncidentLog';
import ReportHub from './pages/ReportHub';
import HistoryQA from './pages/historyqa';
import IncidentDetail from './pages/IncidentDetail';
import ManagerDashboard from './pages/ManagerDashboard';
import QAPerformance from './pages/QAPerformance';
import ManagerReportHub from './pages/ManagerReportHub';
import QAReportHub from './pages/QAReportHub';


function App() {
  return (
    <Router>
     <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<UploadDemoPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/results/:cargoId/:stage" element={<ResultsPage />} />
      <Route path="/report/:cargoId" element={<ResultsPage />} />
      <Route path="/history" element={<HistoricPage />} />
      <Route path="/summary/:cargoId" element={<DefectSummaryPage />} />
      <Route path="/qc-dashboard" element={<QCDashboard />} />
      <Route path="/incident" element={<IncidentLog />} />
      <Route path="/report-hub" element={<ManagerReportHub />} />
      <Route path="/qa-report-hub" element={<QAReportHub />} />
      <Route path="/historyqa" element={<HistoryQA />} />
      <Route path="/incident/:cargoId/:stageName" element={<IncidentDetail />} />
      <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      <Route path="/qa-performance" element={<QAPerformance />} />
      <Route path="/verify/:cargoId/:stageName" element={<IncidentDetail />} />
    </Routes>
    </Router>
  );
}

export default App;