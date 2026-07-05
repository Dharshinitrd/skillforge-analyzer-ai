import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import JobDescriptionPage from './pages/JobDescriptionPage';
import DashboardPage from './pages/DashboardPage';
import SuggestionsPage from './pages/SuggestionsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  // Global States shared between screening flow and dashboard
  const [resumeId, setResumeId] = useState(null);
  const [filename, setFilename] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisData, setAnalysisData] = useState(null);

  // Clear session to start a new screening
  const startNewScreening = () => {
    setResumeId(null);
    setFilename("");
    setJobDescription("");
    setAnalysisData(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage startNewScreening={startNewScreening} />} 
        />
        <Route 
          path="/upload" 
          element={
            <UploadPage 
              setResumeId={setResumeId} 
              setFilename={setFilename} 
              filename={filename}
              resumeId={resumeId}
              startNewScreening={startNewScreening}
            />
          } 
        />
        <Route 
          path="/job-description" 
          element={
            resumeId ? (
              <JobDescriptionPage 
                resumeId={resumeId} 
                filename={filename}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                setAnalysisData={setAnalysisData}
              />
            ) : (
              <Navigate to="/upload" replace />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            analysisData ? (
              <DashboardPage 
                analysisData={analysisData} 
                startNewScreening={startNewScreening}
              />
            ) : (
              <Navigate to="/upload" replace />
            )
          } 
        />
        <Route 
          path="/suggestions" 
          element={
            analysisData ? (
              <SuggestionsPage 
                analysisData={analysisData} 
                startNewScreening={startNewScreening}
              />
            ) : (
              <Navigate to="/upload" replace />
            )
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
