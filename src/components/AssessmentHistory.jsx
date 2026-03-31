import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, Users, ChevronDown, ChevronUp } from 'lucide-react';

const TYPE_META = {
  'GAD-7': { icon: Brain,    color: 'indigo', label: 'Anxiety' },
  'PHQ-9': { icon: Sparkles, color: 'emerald', label: 'Depression' },
  'RQ-10': { icon: Zap,      color: 'amber',  label: 'Resilience' },
  'SCS-8': { icon: Users,    color: 'rose',   label: 'Connectedness' },
};

const SEVERITY_BADGE = {
  'None-Minimal':      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
  'Mild':              'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
  'Moderate':          'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
  'Moderately Severe': 'bg-red-50 dark:bg-red-900/20 text-red-500',
  'Severe':            'bg-red-100 dark:bg-red-900/30 text-red-700',
  'Fragile':           'bg-red-50 dark:bg-red-900/20 text-red-500',
  'Developing':        'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
  'Strong':            'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
  'Champion':          'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
  'Isolated':          'bg-red-50 dark:bg-red-900/20 text-red-600',
  'At-Risk':           'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
  'Connected':         'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
  'Thriving':          'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
};

const COLOR = {
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600' },
};

export default function AssessmentHistory({ assessments = [] }) {
  const [expanded, setExpanded] = useState(null);

  if (assessments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-600">
        <Brain size={32} className="mx-auto mb-3 opacity-30" />
        <p className="text-xs font-bold uppercase tracking-widest">No assessments yet</p>
        <p className="text-[10px] mt-1">Complete an assessment to see your history here</p>
      </div>
    );
  }

  // Show most recent 10, newest first
  const sorted = [...assessments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

  return (
    <div className="space-y-3">
      {sorted.map((ass, i) => {
        const meta = TYPE_META[ass.type] || TYPE_META['GAD-7'];
        const Icon = meta.icon;
        const c = COLOR[meta.color];
        const badgeClass = SEVERITY_BADGE[ass.severity] || 'bg-gray-100 text-gray-600';
        const isOpen = expanded === ass._id;
        const date = new Date(ass.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

        return (
          <motion.div
            key={ass._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-50 dark:bg-darkbg rounded-2xl border border-gray-100 dark:border-darkborder overflow-hidden"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : ass._id)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className={`w-9 h-9 ${c.bg} ${c.text} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{ass.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${badgeClass}`}>
                    {ass.severity}
                  </span>
                </div>
                <p className="text-xs font-black text-gray-800 dark:text-gray-200 truncate">{ass.title}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-black text-gray-900 dark:text-white italic leading-none">{ass.totalScore}</p>
                <p className="text-[8px] text-gray-400 font-bold mt-0.5">{date}</p>
              </div>
              {isOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0 space-y-3">
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                      {ass.clinicalInterpretation}
                    </p>
                    {ass.aiInsight && (
                      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/10 dark:to-indigo-900/10 rounded-xl p-4 border border-primary-100 dark:border-primary-900/20">
                        <p className="text-[8px] font-black text-primary-500 uppercase tracking-widest mb-2">AI Insight</p>
                        <p className="text-[11px] text-gray-700 dark:text-gray-300 italic leading-relaxed">
                          "{ass.aiInsight}"
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
