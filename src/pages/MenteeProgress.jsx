import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, AlertCircle, ChevronLeft, Brain, Target,
  Zap, BarChart2, ShieldCheck, TrendingUp, Star, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
};

const CATEGORY_LABELS = {
  academic_stress:  'Academic Stress',
  social_anxiety:   'Social Anxiety',
  family_conflict:  'Family Conflict',
  grief_loss:       'Grief & Loss',
  identity_crisis:  'Identity',
  substance_risk:   'Substance Risk',
  self_harm_risk:   '⚠ Self-Harm Risk',
  general_wellness: 'General Wellness',
};

export default function MenteeProgress() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/ratings/mentees/progress', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setMentees(data))
      .catch(() => toast.error('Could not load mentee data.'))
      .finally(() => setLoading(false));
  }, []);

  const crisisCount = mentees.filter(m => m.isCrisisRisk).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden"
        >
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-70 hover:opacity-100 mb-6 transition-opacity"
          >
            <ChevronLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black italic mb-2 flex items-center gap-3">
            <Users size={28} /> Mentee Progress Hub
          </h1>
          <p className="text-sm opacity-75 font-medium">Phase 4 — Track your youth members' wellbeing over time</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/10 border border-white/20 px-5 py-3 rounded-2xl">
              <p className="text-[9px] font-black opacity-70 uppercase tracking-widest mb-1">Total Mentees</p>
              <p className="text-xl font-black">{mentees.length}</p>
            </div>
            {crisisCount > 0 && (
              <div className="bg-red-500/20 border border-red-400/30 px-5 py-3 rounded-2xl flex items-center gap-3">
                <AlertCircle size={16} className="text-red-300" />
                <div>
                  <p className="text-[9px] font-black opacity-70 uppercase tracking-widest mb-1">Crisis Flagged</p>
                  <p className="text-xl font-black text-red-200">{crisisCount}</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </motion.div>

        {/* Crisis Alert */}
        {crisisCount > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-3xl p-6 flex items-start gap-4"
          >
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-red-700 dark:text-red-300 mb-1">{crisisCount} mentee(s) flagged for crisis risk</p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 font-medium">
                Please reach out to these individuals immediately and follow the Svasthya Safeguarding Protocol. Consider escalating to a clinical therapist.
              </p>
            </div>
          </motion.div>
        )}

        {/* Mentee Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white dark:bg-darkcard rounded-3xl border border-gray-100 dark:border-darkborder animate-pulse" />
            ))}
          </div>
        ) : mentees.length === 0 ? (
          <div className="bg-white dark:bg-darkcard rounded-[3rem] p-16 text-center border border-gray-100 dark:border-darkborder">
            <Users size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white italic mb-2">No Mentees Yet</h3>
            <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto">
              Youth who book sessions with you will appear here with their full wellbeing profile.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mentees.map((m, i) => {
              const isOpen = expanded === m._id;
              const sevBadge = m.latestAssessment
                ? SEVERITY_BADGE[m.latestAssessment.severity] || 'bg-gray-100 text-gray-500'
                : null;

              return (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-white dark:bg-darkcard rounded-[2.5rem] border shadow-sm overflow-hidden transition-all ${
                    m.isCrisisRisk
                      ? 'border-red-200 dark:border-red-900/40 shadow-red-100 dark:shadow-none'
                      : 'border-gray-100 dark:border-darkborder'
                  }`}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : m._id)}
                    className="w-full flex items-center gap-5 p-6 text-left hover:bg-gray-50 dark:hover:bg-darkbg/60 transition-colors"
                  >
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                      m.isCrisisRisk
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                        : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                    }`}>
                      {m.name?.charAt(0) || '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-black text-gray-900 dark:text-white truncate">{m.name}</p>
                        {m.isCrisisRisk && (
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 text-[8px] font-black uppercase tracking-widest rounded-full flex-shrink-0">
                            ⚠ Crisis Risk
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold">
                        {CATEGORY_LABELS[m.primaryCategory] || 'General Wellness'} · Level {m.level} · {m.xp} XP
                      </p>
                    </div>

                    {/* Latest Assessment */}
                    <div className="text-right shrink-0 hidden sm:block">
                      {m.latestAssessment ? (
                        <>
                          <p className="text-xs font-black text-gray-900 dark:text-white italic">{m.latestAssessment.type}: {m.latestAssessment.score}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${sevBadge}`}>
                            {m.latestAssessment.severity}
                          </span>
                        </>
                      ) : (
                        <p className="text-[10px] text-gray-400 font-bold">No assessment</p>
                      )}
                    </div>

                    {/* Milestone Progress */}
                    <div className="shrink-0 hidden md:flex flex-col items-end gap-1 w-28">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Milestones</p>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.milestonePercent}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <p className="text-[9px] font-black text-primary-500">{m.milestonePercent}%</p>
                    </div>

                    {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                  </button>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 grid sm:grid-cols-3 gap-5 border-t border-gray-100 dark:border-gray-800">
                          {/* Milestone Detail */}
                          <div className="bg-gray-50 dark:bg-darkbg rounded-2xl p-5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Target size={12} /> Milestones
                            </p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white italic">{m.completedMilestones}/{m.milestoneCount}</p>
                            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${m.milestonePercent}%` }} />
                            </div>
                          </div>

                          {/* XP & Level */}
                          <div className="bg-gray-50 dark:bg-darkbg rounded-2xl p-5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Zap size={12} /> Growth
                            </p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white italic">{m.xp} XP</p>
                            <p className="text-[10px] text-gray-500 font-bold mt-1">Level {m.level} · {m.primaryCategory ? CATEGORY_LABELS[m.primaryCategory] : 'General'}</p>
                          </div>

                          {/* Latest Assessment */}
                          <div className="bg-gray-50 dark:bg-darkbg rounded-2xl p-5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Brain size={12} /> Latest Assessment
                            </p>
                            {m.latestAssessment ? (
                              <>
                                <p className="text-2xl font-black text-gray-900 dark:text-white italic">{m.latestAssessment.score}</p>
                                <p className="text-[10px] font-bold text-gray-500 mt-1">{m.latestAssessment.type}</p>
                                <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${sevBadge}`}>
                                  {m.latestAssessment.severity}
                                </span>
                              </>
                            ) : (
                              <p className="text-sm text-gray-400 italic">Not yet taken</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
