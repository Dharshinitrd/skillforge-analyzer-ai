import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiCpu, FiCheckCircle, FiFileText, FiTarget, FiActivity, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

function LandingPage({ startNewScreening }) {
  const navigate = useNavigate();

  const handleStart = () => {
    startNewScreening();
    navigate('/upload');
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* PROFESSIONAL NAVBAR */}
      <header className="sticky top-0 z-50 w-full glass-card border-b border-slate-800/80 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
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

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#hero" className="hover:text-white transition-colors">Home</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <button
          onClick={handleStart}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brandPurple to-brandBlue text-white font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-neon-purple/20"
        >
          Try Demo
        </button>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center max-w-5xl mx-auto relative">
        {/* Animated Background Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-brandPurple/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="px-4 py-1.5 rounded-full border border-brandPurple/30 bg-brandPurple/5 text-brandPurple-light text-xs font-mono tracking-wider uppercase">
            ⚡ Powered by Google Gemini AI
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit leading-tight tracking-tight text-white max-w-4xl">
            Recruitment, Forged with <span className="text-gradient">Intelligence</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-light">
            Automatically analyze resumes, compare candidates with job descriptions, calculate ATS scores, and generate AI hiring recommendations instantly.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brandPurple via-brandBlue to-brandCyan text-white font-semibold shadow-neon-purple/30 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <FiUpload className="text-lg" />
            <span>Upload Resume</span>
          </button>
          
          <button
            onClick={handleStart}
            className="px-8 py-4 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-200 font-semibold hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98]"
          >
            Try Demo
          </button>
        </motion.div>

        {/* Animated UI Preview Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl mt-16 p-2 rounded-2xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-md shadow-glass"
        >
          <div className="rounded-xl overflow-hidden bg-slate-900/60 aspect-[16/9] flex flex-col items-center justify-center p-8 border border-white/5 relative">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Dynamic UI simulation elements */}
            <div className="relative flex flex-col items-center gap-4 z-10 w-full max-w-md">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-brandPurple animate-spin"></div>
                <div className="w-16 h-16 rounded-full border-4 border-brandCyan animate-pulse"></div>
              </div>
              <div className="h-2 w-48 bg-slate-800 rounded-full shimmer overflow-hidden"></div>
              <div className="h-2 w-32 bg-slate-800 rounded-full shimmer overflow-hidden"></div>
              <div className="grid grid-cols-3 gap-2 w-full mt-4">
                <div className="h-10 bg-slate-800/60 rounded-lg border border-slate-700/40 flex items-center justify-center text-[10px] font-mono text-slate-400">ATS: 92%</div>
                <div className="h-10 bg-slate-800/60 rounded-lg border border-slate-700/40 flex items-center justify-center text-[10px] font-mono text-slate-400">FIT: 88%</div>
                <div className="h-10 bg-slate-800/60 rounded-lg border border-slate-700/40 flex items-center justify-center text-[10px] font-mono text-slate-400">DEC: RECOM</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATISTICS */}
      <section className="border-y border-slate-800 bg-slate-950/20 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col gap-1.5">
            <span className="text-4xl md:text-5xl font-extrabold font-outfit text-white">1000+</span>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Resumes Analyzed</span>
          </div>
          <div className="flex flex-col gap-1.5 border-y md:border-y-0 md:border-x border-slate-800 py-6 md:py-0">
            <span className="text-4xl md:text-5xl font-extrabold font-outfit text-white">95%</span>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Accuracy Rate</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-4xl md:text-5xl font-extrabold font-outfit text-white">10+</span>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">AI Metrics Tracked</span>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white">Features Built for Modern Teams</h2>
          <p className="text-slate-400 mt-3 text-sm md:text-base max-w-xl mx-auto">Get deep AI insights that bypass manual reviews and speed up evaluation cycles.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col gap-4 hover:border-brandPurple/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-brandPurple/10 flex items-center justify-center text-brandPurple-light text-2xl">
              <FiUpload />
            </div>
            <h3 className="text-lg font-semibold font-outfit text-white">Resume Upload</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Easily upload PDFs and DOCX files. Our parser handles structure and layout mapping instantly.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col gap-4 hover:border-brandBlue/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-brandBlue/10 flex items-center justify-center text-brandBlue-light text-2xl">
              <FiCpu />
            </div>
            <h3 className="text-lg font-semibold font-outfit text-white">Resume Parsing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Extract textual timelines, work durations, projects, qualifications, and core contact details.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col gap-4 hover:border-brandCyan/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-brandCyan/10 flex items-center justify-center text-brandCyan-light text-2xl">
              <FiTarget />
            </div>
            <h3 className="text-lg font-semibold font-outfit text-white">ATS Score</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Calculate compliance scores indicating resume performance against top screening rules.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col gap-4 hover:border-brandPurple/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-brandPurple/10 flex items-center justify-center text-brandPurple-light text-2xl">
              <FiActivity />
            </div>
            <h3 className="text-lg font-semibold font-outfit text-white">Skill Match</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Get comparative metric maps showing matching and missing technical proficiencies.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col gap-4 hover:border-brandBlue/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-brandBlue/10 flex items-center justify-center text-brandBlue-light text-2xl">
              <FiCheckCircle />
            </div>
            <h3 className="text-lg font-semibold font-outfit text-white">AI Recommendation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Receive clear decisions (Highly Recommended, Needs Improvement) backed by detailed summaries.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl border border-slate-800 flex flex-col gap-4 hover:border-brandCyan/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-brandCyan/10 flex items-center justify-center text-brandCyan-light text-2xl">
              <FiFileText />
            </div>
            <h3 className="text-lg font-semibold font-outfit text-white">PDF Report</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Generate and download fully formatted dynamic PDF summaries of evaluation profiles.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="mt-auto border-t border-slate-900 bg-slate-950/40 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brandPurple to-brandCyan flex items-center justify-center font-outfit font-extrabold text-sm text-white">
              SF
            </div>
            <span className="font-outfit font-bold text-sm tracking-wider text-slate-300">SkillForge AI</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white text-lg transition-colors">
              <FiGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white text-lg transition-colors">
              <FiLinkedin />
            </a>
            <a href="mailto:support@skillforge.ai" className="text-slate-400 hover:text-white text-lg transition-colors">
              <FiMail />
            </a>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            &copy; 2026 SkillForge AI. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
