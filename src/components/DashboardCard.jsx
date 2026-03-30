import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardCard({ 
  title, 
  description, 
  icon, 
  isBeta, 
  onClick, 
  delay, 
  trend, 
  trendValue,
  variant = 'default',
  className = ''
}) {
  const variants = {
    default: 'bg-white/80 dark:bg-darkcard/50 backdrop-blur-xl border border-gray-100 dark:border-white/10 hover:shadow-2xl hover:border-primary-200/50 dark:hover:border-primary-500/30',
    primary: 'bg-gradient-to-br from-primary-600 to-indigo-700 text-white shadow-xl shadow-primary-500/20 border-transparent hover:scale-[1.02]',
    secondary: 'bg-indigo-50/50 dark:bg-indigo-900/10 backdrop-blur-md text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50 hover:border-indigo-300',
    accent: 'bg-rose-50/50 dark:bg-rose-900/10 backdrop-blur-md text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800/50 hover:border-rose-300'
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={`group p-8 rounded-[2.5rem] transition-all text-left flex flex-col relative overflow-hidden h-full ${variants[variant]} ${className}`}
    >
      <div className={`p-4 rounded-2xl w-fit mb-6 group-hover:rotate-12 transition-all ${
        variant === 'primary' 
          ? 'bg-white/20 text-white' 
          : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100'
      }`}>
        {icon}
      </div>
      
      <div className="flex-1">
        <h3 className={`text-sm font-black uppercase tracking-widest mb-1 opacity-60 ${variant === 'primary' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>{title}</h3>
        <p className={`text-2xl font-black italic tracking-tight ${
          variant === 'primary' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          {description}
        </p>
      </div>

      {trend && (
        <div className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full w-fit ${
          trend === 'up' 
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
            : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
        }`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue} System Growth
        </div>
      )}
      
      {isBeta && (
        <span className="absolute top-8 right-8 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800">
           Phase 3
        </span>
      )}

      {/* Subtle Background Glow */}
      <div className={`absolute -bottom-12 -right-12 w-32 h-32 blur-[64px] rounded-full opacity-20 pointer-events-none ${
        variant === 'primary' ? 'bg-white' : 'bg-primary-500'
      }`} />
    </motion.button>
  );
}
