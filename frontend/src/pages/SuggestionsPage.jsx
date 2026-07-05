import React from 'react';
import { FiTrendingUp, FiBook, FiAward, FiCode, FiLayers } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';

function SuggestionsPage({ analysisData, startNewScreening }) {
  const {
    id: analysisId,
    candidate_name,
    suggestions = {}
  } = analysisData;

  const {
    resume_improvements = [],
    recommended_courses = [],
    recommended_certifications = [],
    recommended_projects = [],
    recommended_technologies = []
  } = suggestions;

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
        
        {/* HEADER SECTION */}
        <section className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Target Learning Path</span>
          <h2 className="text-2xl font-bold font-outfit text-white leading-tight">AI SkillForge Suggestions</h2>
          <p className="text-xs text-slate-400 mt-1">Customized developmental steps to increase {candidate_name}'s marketability and role alignment.</p>
        </section>

        {/* TWO-COLUMN DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* LEFT COLUMN: RESUME IMPROVEMENTS & TECHNOLOGIES */}
          <div className="flex flex-col gap-6">
            
            {/* RESUME IMPROVEMENTS */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
                <FiTrendingUp className="text-brandPurple-light" />
                <span>Resume Improvements</span>
              </h3>
              {resume_improvements.length > 0 ? (
                <ul className="flex flex-col gap-3 text-xs text-slate-350 leading-relaxed font-light pl-4 list-disc marker:text-brandPurple">
                  {resume_improvements.map((imp, idx) => (
                    <li key={idx} className="hover:text-white transition-colors">
                      {imp}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-400 font-medium">No improvements needed! The resume follows standard layouts.</p>
              )}
            </div>

            {/* RECOMMENDED TECHNOLOGIES TO LEARN */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
                <FiLayers className="text-brandCyan-light" />
                <span>Recommended Technologies</span>
              </h3>
              {recommended_technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recommended_technologies.map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-850 text-slate-300 text-xs font-mono font-medium hover:border-brandCyan/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-light">No additional technologies recommended.</p>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: COURSES, CERTS, & PROJECTS */}
          <div className="flex flex-col gap-6">
            
            {/* RECOMMENDED PROJECTS */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
                <FiCode className="text-brandBlue-light" />
                <span>Recommended Practice Projects</span>
              </h3>
              {recommended_projects.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {recommended_projects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 hover:border-slate-800 transition-colors">
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{proj}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-light">No custom practice projects recommended.</p>
              )}
            </div>

            {/* RECOMMENDED COURSES */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
                <FiBook className="text-brandPurple-light" />
                <span>Recommended Courses</span>
              </h3>
              {recommended_courses.length > 0 ? (
                <ul className="flex flex-col gap-3 text-xs text-slate-350 leading-relaxed font-light pl-4 list-disc marker:text-brandPurple">
                  {recommended_courses.map((course, idx) => (
                    <li key={idx} className="hover:text-white transition-colors">
                      {course}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 font-light">No courses recommended.</p>
              )}
            </div>

            {/* RECOMMENDED CERTIFICATIONS */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
                <FiAward className="text-brandCyan-light" />
                <span>Recommended Certifications</span>
              </h3>
              {recommended_certifications.length > 0 ? (
                <ul className="flex flex-col gap-3 text-xs text-slate-350 leading-relaxed font-light pl-4 list-disc marker:text-brandCyan">
                  {recommended_certifications.map((cert, idx) => (
                    <li key={idx} className="hover:text-white transition-colors">
                      {cert}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 font-light">No certifications recommended.</p>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default SuggestionsPage;
