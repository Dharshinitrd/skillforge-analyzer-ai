import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiCompass, FiBriefcase, FiBookOpen, FiCode, FiAward } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import CircularProgress from '../components/CircularProgress';

function DashboardPage({ analysisData, startNewScreening }) {
  // Destructure analysis fields
  const {
    id: analysisId,
    candidate_name,
    email,
    phone,
    ats_score,
    technical_score,
    skill_match_percentage,
    experience_score,
    communication_score,
    final_recommendation,
    resume_summary,
    education = [],
    experience = [],
    projects = [],
    skills = [],
    strengths = [],
    weaknesses = [],
    missing_skills = []
  } = analysisData;

  // Determine Recommendation Badge color styles
  const getRecBadgeStyles = (rec) => {
    switch (rec) {
      case 'Highly Recommended':
        return 'bg-emerald-950/45 text-emerald-400 border-emerald-500/35';
      case 'Recommended':
        return 'bg-blue-950/45 text-blue-400 border-blue-500/35';
      case 'Needs Improvement':
        return 'bg-amber-950/45 text-amber-400 border-amber-500/35';
      case 'Not Suitable':
        return 'bg-rose-950/45 text-rose-400 border-rose-500/35';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700/30';
    }
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* Side Navigation Panel */}
      <Sidebar 
        analysisId={analysisId} 
        candidateName={candidate_name} 
        startNewScreening={startNewScreening} 
      />

      {/* Main Workspace */}
      <main className="flex-1 h-full overflow-y-auto p-8 flex flex-col gap-6">
        
        {/* CANDIDATE HEADER PROFILE CARD */}
        <section className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brandPurple to-brandCyan flex items-center justify-center font-outfit font-extrabold text-2xl text-white shadow-neon-purple/15 shrink-0">
              {candidate_name?.charAt(0) || 'C'}
            </div>
            <div>
              <h2 className="text-2xl font-bold font-outfit text-white leading-tight">{candidate_name || 'Candidate Name'}</h2>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-1.5">
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <FiMail className="text-brandBlue-light" />
                  <a href={`mailto:${email}`}>{email || 'Not Found'}</a>
                </span>
                <span className="flex items-center gap-1.5">
                  <FiPhone className="text-brandCyan-light" />
                  <span>{phone || 'Not Found'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-right items-end">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Hiring Advice</span>
            <div className={`px-4 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider ${getRecBadgeStyles(final_recommendation)}`}>
              {final_recommendation}
            </div>
          </div>
        </section>

        {/* METRICS & SCORE CIRCLES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-center">
            <CircularProgress 
              value={ats_score} 
              label="ATS Score" 
              gradientId="atsGrad"
              startColor="#7c3aed"
              endColor="#c084fc"
            />
          </div>
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-center">
            <CircularProgress 
              value={technical_score} 
              label="Technical Score" 
              gradientId="techGrad"
              startColor="#2563eb"
              endColor="#60a5fa"
            />
          </div>
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-center">
            <CircularProgress 
              value={skill_match_percentage} 
              label="Skill Match" 
              gradientId="matchGrad"
              startColor="#0891b2"
              endColor="#67e8f9"
            />
          </div>
        </section>

        {/* RESUME PROFILE SUMMARY CARD */}
        <section className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit">Resume Summary</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {resume_summary || 'No summary available.'}
          </p>
        </section>

        {/* TWO-COLUMN DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* LEFT COLUMN: TIMELINES & DETAILS */}
          <div className="flex flex-col gap-6">
            
            {/* WORK EXPERIENCE TIMELINE */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
                <FiBriefcase className="text-brandPurple-light" />
                <span>Professional Experience</span>
              </h3>
              
              {experience.length > 0 ? (
                <div className="flex flex-col gap-6 pl-4 border-l border-slate-800 relative">
                  {experience.map((item, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline node */}
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 border border-brandPurple group-hover:scale-125 transition-transform" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.role}</h4>
                        <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                          <span className="font-medium text-brandBlue-light">{item.company}</span>
                          <span className="font-mono text-[10px]">{item.duration}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-light">No experience items detailed.</p>
              )}
            </div>

            {/* PROJECTS LIST */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
                <FiCode className="text-brandCyan-light" />
                <span>Projects</span>
              </h3>
              
              {projects.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 hover:border-slate-800 transition-colors">
                      <h4 className="text-sm font-semibold text-white">{proj.title}</h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-light">{proj.description}</p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {proj.technologies.map((tech, tidx) => (
                            <span key={tidx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-mono border border-slate-700/40">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-light">No projects detailed.</p>
              )}
            </div>

            {/* EDUCATION */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
                <FiBookOpen className="text-brandBlue-light" />
                <span>Education</span>
              </h3>
              
              {education.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{edu.degree}</h4>
                        <span className="text-xs text-brandPurple-light">{edu.institution}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 shrink-0">{edu.year}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-light">No education items detailed.</p>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: SKILLS & CHIPS */}
          <div className="flex flex-col gap-6">
            
            {/* CORE SKILL CHIPS */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
                <FiCompass className="text-brandCyan-light" />
                <span>Skills Found</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium hover:border-brandPurple/40 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* STRENGTHS */}
            <div className="glass-card rounded-2xl p-6 border border-emerald-950/20 bg-emerald-950/5 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 font-outfit flex items-center gap-2">
                <FiAward className="text-emerald-400" />
                <span>Key Strengths</span>
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-300 leading-relaxed font-light">
                {strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* WEAKNESSES */}
            <div className="glass-card rounded-2xl p-6 border-amber-950/20 bg-amber-950/5 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 font-outfit flex items-center gap-2">
                <FiAward className="text-amber-400" />
                <span>Areas of Improvement</span>
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-300 leading-relaxed font-light">
                {weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* MISSING SKILLS */}
            <div className="glass-card rounded-2xl p-6 border-rose-950/20 bg-rose-950/5 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-400 font-outfit flex items-center gap-2">
                <FiAward className="text-rose-400" />
                <span>Missing Requirements</span>
              </h3>
              {missing_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missing_skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-3.5 py-1.5 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-300 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400 font-medium">None! Candidate matches all major target skills.</p>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default DashboardPage;
