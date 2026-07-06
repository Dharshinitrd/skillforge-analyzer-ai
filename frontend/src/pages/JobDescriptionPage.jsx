import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiCpu, FiFileText } from 'react-icons/fi';
import axios from 'axios';

const LOADING_MESSAGES = [
  "Reading parsed resume tokens...",
  "Injecting context into Gemini generative engine...",
  "Mapping candidate skills against requirements...",
  "Calculating ATS structure and alignment scores...",
  "Checking projects, timelines, and credentials...",
  "Formulating recommendation summaries...",
  "Finalizing assessment metrics..."
];

const JOB_TEMPLATES = [
  {
    title: "Java Full Stack Developer",
    content: "We are looking for a Java Full Stack Developer with Spring Boot, React, REST API, Docker, AWS and MySQL. Experience in designing clean, scalable architectures and optimizing database queries is highly preferred."
  },
  {
    title: "Python Backend Engineer",
    content: "Seeking a Python Backend Engineer proficient in Python Flask/Django, SQLite/PostgreSQL, Redis, and RESTful API integrations. Candidates should have experience writing robust test suites and containerizing services using Docker."
  },
  {
    title: "Frontend React Developer",
    content: "Looking for a Frontend React Developer with expertise in React.js, Tailwind CSS, Vite, Redux/Context API, Framer Motion, and Axios integrations. Experience building highly interactive, responsive dashboards is a big plus."
  }
];

function JobDescriptionPage({ resumeId, filename, jobDescription, setJobDescription, setAnalysisData }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const navigate = useNavigate();

  // Initialize default template if empty
  useEffect(() => {
    if (!jobDescription) {
      setJobDescription(JOB_TEMPLATES[0].content);
    }
  }, [jobDescription, setJobDescription]);

  // Cycle loading messages
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please provide a valid Job Description.");
      return;
    }

    setLoading(true);
    setLoadingMsgIndex(0);
    setError("");

    try {
      const response = await axios.post(
  "https://skillforge-analyzer-ai-1.onrender.com/api/analyze",
  {
    resume_id: resumeId,
    job_description: jobDescription
  }
);
    

      setAnalysisData(response.data);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.error || "Analysis failed. Please check Gemini API configurations and database state.";
      setError(errMsg);
    }
  };

  const selectTemplate = (content) => {
    setJobDescription(content);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Back to upload button */}
      <div className="absolute top-10 left-10">
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <FiArrowLeft />
          <span>Upload Resume</span>
        </button>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-outfit text-white">Compare with Job Description</h1>
          <p className="text-slate-400 text-sm mt-2">Paste your target requirements below or use a quick template.</p>
        </div>

        {/* Selected resume pill */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 self-center">
          <FiFileText className="text-brandBlue-light text-base shrink-0" />
          <span className="text-xs text-slate-300 font-medium max-w-xs truncate">{filename}</span>
        </div>

        {/* Templates selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-outfit">Quick Templates</label>
          <div className="flex flex-wrap gap-2">
            {JOB_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => selectTemplate(tmpl.content)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-800 hover:text-white text-slate-300 text-xs transition-colors"
              >
                {tmpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-outfit">Job Requirements</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-56 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-200 text-sm focus:border-brandPurple focus:ring-1 focus:ring-brandPurple/30 transition-all font-light resize-none leading-relaxed"
            placeholder="Describe the job duties, required tech stacks, and expected profiles..."
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Analyze trigger */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !jobDescription.trim()}
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl bg-gradient-to-r from-brandPurple to-brandBlue text-white font-semibold text-sm active:scale-[0.98] shadow-neon-purple/20 hover:opacity-95 transition-all"
        >
          <FiCpu className="text-lg" />
          <span>Analyze Resume using Gemini AI</span>
        </button>
      </div>

      {/* PROFESSIONAL LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#070913]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative flex items-center justify-center w-36 h-36 mb-8">
              {/* Outer neon spinning track */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-brandPurple/30 animate-spin"></div>
              
              {/* Inner pulsed track */}
              <div className="absolute w-24 h-24 rounded-full border-2 border-brandCyan/20 animate-ping"></div>

              {/* Core active rotating loader */}
              <div className="w-20 h-20 rounded-full border-t-4 border-l-4 border-brandCyan animate-spin"></div>
            </div>

            <motion.div
              key={loadingMsgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-md"
            >
              <h3 className="text-lg font-bold font-outfit text-white leading-tight">SkillForge Screen Intelligence</h3>
              <p className="text-slate-400 text-sm mt-2 min-h-[40px] leading-relaxed">
                {LOADING_MESSAGES[loadingMsgIndex]}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default JobDescriptionPage;
