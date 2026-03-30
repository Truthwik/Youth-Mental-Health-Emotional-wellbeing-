import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ className = "text-xl" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Premium Lotus/Pulse SVG Icon */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg"
        />
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-600 dark:text-primary-400 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 6 3c-2 0-3.6 1.6-3.6 3.6 0 2.4 2.1 4.7 4.5 7.1L12 19l5.1-5.3c2.4-2.4 4.5-4.7 4.5-7.1 0-2-1.6-3.6-3.6-3.6a3.6 3.6 0 0 0-3 1.7c-.6-1.1-1.8-1.7-3-1.7z" />
          <path d="M12 13V13" className="animate-pulse" />
        </svg>
      </div>

      <div className="relative inline-block font-sans font-black tracking-tighter text-gray-900 dark:text-white pb-1 pt-1">
        svasthya
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-0 left-0 h-[2px] bg-primary-500 rounded-full" 
        />
      </div>
    </div>
  );
}
