import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BreathingCircle() {
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [count, setCount] = useState(4);

  useEffect(() => {
    let timer;
    if (count > 0) {
      timer = setTimeout(() => setCount(count - 1), 1000);
    } else {
      if (phase === 'Inhale') {
        setPhase('Hold');
        setCount(4);
      } else if (phase === 'Hold') {
        setPhase('Exhale');
        setCount(4);
      } else {
        setPhase('Inhale');
        setCount(4);
      }
    }
    return () => clearTimeout(timer);
  }, [count, phase]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-darkcard rounded-[3.5rem] border border-gray-100 dark:border-darkborder shadow-sm overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-primary-500/5 pointer-events-none" />
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Glow */}
        <motion.div
          animate={{ 
            scale: phase === 'Inhale' ? 1.5 : phase === 'Hold' ? 1.5 : 1,
            opacity: phase === 'Inhale' ? 0.3 : 0.1
          }}
          transition={{ duration: phase === 'Hold' ? 0 : 4, ease: "easeInOut" }}
          className="absolute w-44 h-44 bg-primary-400 rounded-full blur-3xl"
        />

        {/* The Circle */}
        <motion.div
          animate={{ 
            scale: phase === 'Inhale' ? 1.5 : phase === 'Hold' ? 1.5 : 1,
          }}
          transition={{ duration: phase === 'Hold' ? 0 : 4, ease: "easeInOut" }}
          className="w-32 h-32 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center z-10"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white font-black text-xl italic"
            >
              {phase}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-12 text-center relative z-20">
        <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">{count}</p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Seconds remaining</p>
      </div>
      
      <div className="mt-8 flex gap-2">
         {[1,2,3].map(i => (
           <div key={i} className={`w-1.5 h-1.5 rounded-full ${phase === (i === 1 ? 'Inhale' : i === 2 ? 'Hold' : 'Exhale') ? 'bg-primary-500 w-4' : 'bg-gray-200 dark:bg-gray-800'} transition-all`} />
         ))}
      </div>
    </div>
  );
}
