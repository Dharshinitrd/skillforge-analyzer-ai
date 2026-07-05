import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brandPurple/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md flex flex-col items-center gap-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-rose-950/20 border border-rose-900/30 flex items-center justify-center text-rose-400 text-4xl shadow-neon-cyan/5">
          <FiAlertCircle />
        </div>

        <div>
          <h1 className="text-8xl font-extrabold font-outfit text-white tracking-tighter">404</h1>
          <h2 className="text-xl font-bold font-outfit text-slate-200 mt-2">Workspace Lost In Orbit</h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed font-light">
            The page you are looking for does not exist or has been shifted. Return to main base.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-brandPurple to-brandBlue text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-neon-purple/20"
        >
          <FiHome className="text-lg" />
          <span>Return to Safety</span>
        </button>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
