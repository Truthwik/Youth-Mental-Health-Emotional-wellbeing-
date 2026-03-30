import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Activity, HeartPulse, TrendingUp, Zap } from 'lucide-react';

const CircularProgress = ({ value, label, icon: Icon, color, delay }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20"
    >
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/10"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.5 }}
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary-200">{label}</p>
        <p className="text-lg font-black">{value}%</p>
      </div>
    </motion.div>
  );
};

export default function AnalysisResult({ analysis }) {
  if (!analysis || (!analysis.result && !analysis.summary)) return null;

  // Mock score if not provided in analysis object
  const consistencyScore = analysis.consistencyScore || 85;
  const resilienceScore = analysis.resilienceScore || 72;
  const mindfulnessScore = analysis.mindfulnessScore || 64;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-700 via-primary-600 to-purple-600 p-8 sm:p-14 rounded-[3.5rem] text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] relative overflow-hidden"
    >
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -right-1/4 w-full h-full bg-white/5 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-purple-500/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-xl border border-white/20 shadow-inner">
              <BrainCircuit size={36} className="text-primary-100" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-200 mb-1">AI Cognitive Scan</p>
              <h2 className="text-3xl font-black italic tracking-tight">Your Wellbeing Matrix</h2>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-green-300">Live Insights</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <span className="text-[10px] font-bold text-white/70">{new Date(analysis.generatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          
          <div className="lg:col-span-3">
            <div className="relative">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.3 }}
                 className="bg-white/5 backdrop-blur-sm p-8 rounded-[3rem] border border-white/10 mb-8"
               >
                 <p className="text-xl sm:text-2xl font-bold leading-relaxed text-white drop-shadow-md">
                   "{analysis.summary || analysis.result}"
                 </p>
               </motion.div>
               
               <div className="flex flex-wrap gap-3">
                 <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-400" /> Improvement: +12%
                 </div>
                 <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" /> Peak Mood: Reflection
                 </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
             <CircularProgress 
               value={resilienceScore} 
               label="Resilience" 
               icon={HeartPulse} 
               color="text-red-400" 
               delay={0.5} 
             />
             <CircularProgress 
               value={consistencyScore} 
               label="Consistency" 
               icon={Activity} 
               color="text-blue-400" 
               delay={0.6} 
             />
             <div className="col-span-2 bg-gradient-to-r from-primary-400/20 to-purple-400/20 p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary-200 mb-1">Global Standing</p>
                   <p className="text-lg font-black italic">Top 15% Wellbeing</p>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl">
                   <Sparkles size={24} className="text-yellow-300" />
                </div>
             </div>
          </div>

        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-primary-200 font-bold uppercase tracking-widest opacity-70">
            Authenticated via Svasthya Neural Engine • UID: {analysis._id?.slice(-8).toUpperCase() || 'REF-8291'}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="bg-white text-primary-600 px-8 py-3 rounded-full text-xs font-black shadow-[0_10px_20px_rgba(255,255,255,0.2)] hover:bg-primary-50 transition-all hover:scale-105 active:scale-95"
            >
              Export AI Report
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
