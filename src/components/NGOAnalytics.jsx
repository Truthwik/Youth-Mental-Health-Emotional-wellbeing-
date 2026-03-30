import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, HeartPulse, Activity, ShieldCheck, Download, Filter } from 'lucide-react';

export default function NGOAnalytics() {
  // Mock data for the demonstration
  const stats = [
    { label: 'Total Youth Supported', value: '1,248', change: '+12%', icon: <Users /> },
    { label: 'Community Mood Index', value: '7.8/10', change: '+0.4', icon: <HeartPulse /> },
    { label: 'Milestones Completed', value: '4,592', change: '+18%', icon: <Activity /> },
    { label: 'Safety Incidents', value: '0', change: 'Steady', icon: <ShieldCheck /> }
  ];

  const chartData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 55 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 110 }
  ];

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Community Impact Overview</h2>
          <p className="text-sm text-gray-500">Real-time anonymized data from the Svasthya ecosystem.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-darkcard border border-gray-100 dark:border-darkborder rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-500 transition-all">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-darkcard p-6 rounded-[2rem] border border-gray-100 dark:border-darkborder shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/10 text-primary-500 rounded-2xl">
                {stat.icon}
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white italic">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Impact Chart (Simulated with SVG) */}
      <div className="bg-white dark:bg-darkcard p-8 rounded-[3rem] border border-gray-100 dark:border-darkborder shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-primary-500" /> Wellbeing Trends
            </h3>
            <p className="text-xs text-gray-400">Weekly average of self-reported youth resilience scores.</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold">
            <div className="flex items-center gap-2 text-primary-500 underline underline-offset-4">Current Period</div>
            <div className="flex items-center gap-2 text-gray-300">Previous Year</div>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-gray-100 dark:border-gray-800 pb-2 mb-2 relative">
           {/* Chart Bars */}
           {chartData.map((d, i) => (
             <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / 120) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'circOut' }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-primary-600 to-primary-300 rounded-t-xl relative group-hover:to-secondary-400 transition-all cursor-pointer shadow-lg shadow-primary-500/10"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-opacity whitespace-nowrap z-10">
                    {d.value}%
                  </div>
                </motion.div>
                <span className="text-[10px] font-black text-gray-400 mt-4">{d.month}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Privacy Alert */}
      <div className="bg-primary-900 text-primary-100 p-6 rounded-[2.5rem] border border-white/10 flex flex-col sm:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
           <ShieldCheck className="text-secondary-400" size={32} />
        </div>
        <div className="text-center sm:text-left flex-1">
          <h4 className="text-lg font-black italic">Privacy-First Data Protection</h4>
          <p className="text-sm opacity-70 leading-relaxed max-w-2xl">
            As a registered NGO partner, you only view aggregated and de-identified community trends. No personal student information or individual chat logs are accessible to any external stakeholders.
          </p>
        </div>
      </div>
    </div>
  );
}
