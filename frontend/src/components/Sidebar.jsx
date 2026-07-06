import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUpload,
  FiFileText,
  FiAward,
  FiGrid,
  FiPlus,
  FiArrowLeft
} from "react-icons/fi";
import axios from 'axios';

function Sidebar({ analysisId, candidateName, startNewScreening }) {
  const navigate = useNavigate();

  const handleDownloadReport = async () => {
  try {
    const response = await axios({
      url: `https://skillforge-analyzer-ai-1.onrender.com/api/report?analysis_id=${analysisId}`,
      method: "GET",
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;

    const cleanName = candidateName
      ? candidateName.replace(/\s+/g, "_")
      : "Candidate";

    link.download = `SkillForge_Report_${cleanName}.pdf`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error("Download Error:", error);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log(error.response.data);
    }

    alert("Failed to download PDF report.");
  }
};
  const handleNewScreening = () => {
    startNewScreening();
    navigate('/upload');
  };

  return (
    <aside className="w-80 h-full glass-card border-r border-slate-800 flex flex-col justify-between p-6">
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brandPurple to-brandCyan flex items-center justify-center font-outfit font-extrabold text-xl shadow-neon-purple text-white">
            SF
          </div>
          <div>
            <h1 className="font-outfit font-bold text-lg leading-tight tracking-wider text-gradient">
              SkillForge AI
            </h1>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Screening Agent
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-brandPurple/20 to-brandBlue/10 border-l-4 border-brandPurple text-white shadow-neon-purple/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`
            }
          >
            <FiGrid className="text-xl" />
            <span className="font-medium text-sm">Dashboard</span>
          </NavLink>

          <NavLink
            to="/suggestions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-brandPurple/20 to-brandBlue/10 border-l-4 border-brandPurple text-white shadow-neon-purple/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`
            }
          >
            <FiAward className="text-xl" />
            <span className="font-medium text-sm">AI Suggestions</span>
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        {/* Download PDF button */}
        <button
          onClick={handleDownloadReport}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-brandBlue to-brandCyan text-white font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-neon-cyan/20"
        >
          <FiFileText className="text-lg" />
          <span>Download PDF Report</span>
        </button>

        {/* Start New Screening button */}
        <button
          onClick={handleNewScreening}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium text-sm active:scale-95 transition-all"
        >
          <FiPlus className="text-lg" />
          <span>New Screening</span>
        </button>

        {/* Return to landing */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <FiArrowLeft />
          <span>Back to Landing</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
