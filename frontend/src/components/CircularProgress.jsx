import React from 'react';
import { motion } from 'framer-motion';

function CircularProgress({ 
  value = 0, 
  size = 130, 
  strokeWidth = 10, 
  gradientId = "progressGradient", 
  startColor = "#7c3aed", 
  endColor = "#0891b2", 
  label = "" 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Clamp value between 0 and 100
  const cleanValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circle Canvas */}
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
          
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-800/80 fill-transparent"
            strokeWidth={strokeWidth}
          />
          
          {/* Active progress track */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (cleanValue / 100) * circumference }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Core Value Label (Middle) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-bold font-outfit text-white tracking-tight"
          >
            {cleanValue}%
          </motion.span>
        </div>
      </div>
      
      {label && (
        <span className="text-xs font-medium tracking-wide uppercase text-slate-400 font-outfit">
          {label}
        </span>
      )}
    </div>
  );
}

export default CircularProgress;
