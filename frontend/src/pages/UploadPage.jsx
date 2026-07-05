import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiX, FiCheckCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

function UploadPage({ setResumeId, setFilename, filename, resumeId, startNewScreening }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // Validate File Extensions
  const validateAndProcessFile = (selectedFile) => {
    setError("");
    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    
    if (fileExt !== 'pdf' && fileExt !== 'docx') {
      setError("Unsupported file format. Please upload only PDF or DOCX files.");
      setFile(null);
      return;
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit.");
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    uploadResumeFile(selectedFile);
  };

  // Upload to API
  const uploadResumeFile = async (targetFile) => {
    setUploading(true);
    setProgress(10);
    setError("");

    const formData = new FormData();
    formData.append("file", targetFile);

    // Simulate smoother progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 80 ? 80 : prev + 10));
    }, 150);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setResumeId(response.data.resume_id);
        setFilename(response.data.filename);
        setUploading(false);
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setUploading(false);
      setProgress(0);
      const errMsg = err.response?.data?.error || "Failed to upload or parse resume. Please check your backend connection.";
      setError(errMsg);
      setFile(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResumeId(null);
    setFilename("");
    setProgress(0);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProceed = () => {
    if (resumeId) {
      navigate('/job-description');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-10 left-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <FiArrowLeft />
          <span>Home</span>
        </button>
      </div>

      <div className="w-full max-w-xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-outfit text-white">Upload Candidate Resume</h1>
          <p className="text-slate-400 text-sm mt-2">Upload a single resume to begin intelligent screening evaluation.</p>
        </div>

        {/* DRAG & DROP AREA */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`glass-card rounded-2xl border-2 border-dashed py-6 px-8 flex flex-col items-center justify-center gap-3 min-h-[180px] cursor-pointer transition-all duration-300 relative overflow-hidden ${
            isDragActive 
              ? 'border-brandPurple bg-brandPurple/5 scale-[1.01]' 
              : file 
                ? 'border-slate-800 pointer-events-none' 
                : 'border-slate-800 hover:border-slate-700/60 hover:bg-slate-900/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx"
            disabled={uploading || !!file}
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-brandPurple/10 flex items-center justify-center text-brandPurple-light text-3xl shadow-neon-purple/5">
                  <FiUploadCloud />
                </div>
                <div>
                  <p className="text-slate-200 font-semibold">Drag & Drop file here, or browse</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">Acceptable formats: PDF, DOCX (Max 50MB)</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col gap-4"
              >
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-brandBlue/10 flex items-center justify-center text-brandBlue-light text-xl shrink-0">
                      <FiFileText />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-slate-200 text-sm font-semibold truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {(file.size / 1024).toFixed(1)} KB • {file.name.split('.').pop().toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {!uploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                      <FiX />
                    </button>
                  )}
                </div>

                {uploading && (
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Parsing resume layout content...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brandPurple to-brandCyan"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                )}

                {progress === 100 && !uploading && (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs mt-1 justify-center">
                    <FiCheckCircle className="text-sm shrink-0" />
                    <span>Successfully parsed resume data!</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* PROCEED TRIGGER */}
        <button
          onClick={handleProceed}
          disabled={!resumeId || uploading}
          className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
            resumeId && !uploading
              ? 'bg-gradient-to-r from-brandPurple to-brandBlue text-white shadow-neon-purple/20 active:scale-[0.98]'
              : 'bg-slate-900/60 border border-slate-800/80 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Configure Job Description</span>
          <FiArrowRight className="text-base" />
        </button>
      </div>
    </div>
  );
}

export default UploadPage;
