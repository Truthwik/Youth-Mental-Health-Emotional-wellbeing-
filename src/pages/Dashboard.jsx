import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Gamepad2, BrainCircuit, Activity, HeartHandshake, FileQuestion, BookOpen, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MilestoneTracker from '../components/MilestoneTracker';
import AnalysisResult from '../components/AnalysisResult';
import WellbeingChart from '../components/WellbeingChart';
import AssessmentHistory from '../components/AssessmentHistory';
import DashboardCard from '../components/DashboardCard';
import InfoModal from '../components/InfoModal';
import { toast } from 'sonner';

export default function Dashboard() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({ isOpen: false, title: '', description: '', phase: 3 });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchData();
      
      const isFirstLoad = !sessionStorage.getItem('dashboard_loaded');
      if (isFirstLoad) {
        const userName = JSON.parse(storedUser)?.name?.split(' ')[0] || 'Friend';
        toast(`Welcome back, ${userName}!`, {
          description: "Your wellbeing journey continues today.",
        });
        sessionStorage.setItem('dashboard_loaded', 'true');
      }
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [mRes, aRes, assRes] = await Promise.all([
        fetch('/api/milestones', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/notes/analysis', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/assessments', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (mRes.ok) setMilestones(await mRes.json());
      if (aRes.ok) setAnalysis(await aRes.json());
      if (assRes.ok) setAssessments(await assRes.json());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Simplified Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-darkcard p-8 sm:p-12 rounded-[3rem] shadow-sm border border-gray-100 dark:border-darkborder flex flex-col md:flex-row gap-8 items-center justify-between"
        >
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white italic tracking-tight">
              {t('dashboard.welcome', { name: user.name?.split(' ')[0] })}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl font-medium leading-relaxed">
               {t('dashboard.subtitle_youth')}
            </p>
            {user.communityTags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.communityTags.slice(0, 3).map(tag => (
                   <span key={tag} className="inline-flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 dark:border-primary-900/30">
                      <Sparkles size={10} /> {tag.replace('_', ' ')}
                   </span>
                ))}
              </div>
            )}
          </div>
          <div className="bg-primary-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary-500/20 text-center min-w-[200px]">
             <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp size={20} className="text-primary-200" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Progress Rank</span>
             </div>
             <p className="text-4xl font-black italic">Level {user.level || 1}</p>
             <div className="w-full bg-white/20 h-1 rounded-full mt-4 overflow-hidden">
                <motion.div initial={{width:0}} animate={{width:`${(user.xp || 0)%100}%`}} className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
             </div>
          </div>
        </motion.div>

        {/* Milestone & Charts */}
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <MilestoneTracker 
              milestones={milestones} 
              onSelect={(id) => navigate(`/milestone/${id}`)} 
            />
          </div>
          <div className="lg:col-span-3">
             <div className="bg-white dark:bg-darkcard border border-gray-100 dark:border-darkborder rounded-[3.5rem] p-10 shadow-sm h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">Resilience Index</h3>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white italic">Wellbeing Journey</h4>
                  </div>
                  <button 
                    onClick={() => navigate('/assessments')}
                    className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all border border-primary-100 dark:border-primary-900/30"
                  >
                     New Assessment
                  </button>
                </div>
                
                <div className="h-[300px] w-full">
                  <WellbeingChart assessments={assessments} />
                </div>

                {/* Assessment History Timeline */}
                {assessments.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-darkborder">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Recent Assessments</p>
                      <button onClick={() => navigate('/assessments')} className="text-[9px] font-black text-primary-500 uppercase tracking-widest hover:underline">View All →</button>
                    </div>
                    <AssessmentHistory assessments={assessments} />
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* AI Analysis Overlay */}
        {analysis && (
           <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}}>
              <AnalysisResult analysis={analysis} />
           </motion.div>
        )}

        {/* Unified Tool Grid */}
        <div className="space-y-8">
           <div className="flex items-center justify-between px-2">
             <div>
               <h2 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tight">Wellbeing Toolkit</h2>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Personalized resources</p>
             </div>
             <span className="bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-500/20">v2.1 Stable</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                title="Zen Play" 
                description="Interactive visual mindfulness and breathing rituals." 
                icon={<Gamepad2 size={24} />} 
                variant="primary"
                onClick={() => navigate('/relax')}
                trend="up"
                trendValue="3 Sessions"
                delay={0.1}
              />
              <DashboardCard 
                title="Svasthya AI" 
                description="1-on-1 Support" 
                icon={<BrainCircuit size={24} />} 
                onClick={() => window.dispatchEvent(new CustomEvent('svasthya-open-chat'))}
                delay={0.2}
              />
              <DashboardCard 
                title="Support Directory" 
                description="Find Mentors" 
                icon={<HeartHandshake size={24} />} 
                variant="secondary"
                onClick={() => navigate('/community')}
                delay={0.3}
              />
              <DashboardCard 
                title="Daily Journal" 
                description="Record Evolution" 
                icon={<BookOpen size={24} />} 
                onClick={() => navigate('/notes')}
                delay={0.4}
              />
              <DashboardCard 
                title="Psychometric Lab" 
                description="GAD-7, PHQ-9, RQ-10, SCS-8" 
                icon={<FileQuestion size={24} />} 
                onClick={() => navigate('/assessments')}
                delay={0.5}
              />
              <DashboardCard 
                title="Wellness Space" 
                description="Shared Support" 
                icon={<Sparkles size={24} />} 
                variant="accent"
                onClick={() => navigate('/community')}
                delay={0.6}
              />
           </div>
        </div>

        <InfoModal 
          {...modalData} 
          onClose={() => setModalData({ ...modalData, isOpen: false })} 
        />

      </div>
    </div>
  );
}
