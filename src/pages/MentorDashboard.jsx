import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, MessageSquare, Star, Award, TrendingUp, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { toast } from 'sonner';

export default function MentorDashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [stats, setStats] = useState({ mentees: 12, sessions: 45, rating: 4.9 });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-darkcard p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-darkborder flex flex-col md:flex-row gap-8 items-center justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
              Welcome, {user.name?.split(' ')[0]} <Award className="text-yellow-500" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl text-lg">
              Your guidance is making a <strong>real difference</strong> in the lives of Hyderabad's youth.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-primary-50 dark:bg-primary-900/20 px-6 py-4 rounded-3xl border border-primary-100 dark:border-primary-900/30 text-center">
                <p className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Impact Score</p>
                <p className="text-2xl font-black text-primary-700 dark:text-primary-300">92%</p>
             </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white dark:bg-darkcard p-6 rounded-3xl border border-gray-100 dark:border-darkborder">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Mentees</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stats.mentees}</h3>
           </div>
           <div className="bg-white dark:bg-darkcard p-6 rounded-3xl border border-gray-100 dark:border-darkborder">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Sessions</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stats.sessions}</h3>
           </div>
           <div className="bg-white dark:bg-darkcard p-6 rounded-3xl border border-gray-100 dark:border-darkborder">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Avg Rating</p>
              <div className="flex items-center gap-2">
                 <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stats.rating}</h3>
                 <Star size={20} className="text-yellow-500 fill-current" />
              </div>
           </div>
           <div className="bg-primary-600 p-6 rounded-3xl text-white shadow-xl shadow-primary-500/20">
              <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-2">Next Session</p>
              <h3 className="text-xl font-bold">Today, 4:00 PM</h3>
           </div>
        </div>

        {/* Tool Grid */}
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mentor Toolkit</h2>
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                title="Mentee Progress" 
                description="View wellness milestones and growth patterns for your assigned youth." 
                icon={<TrendingUp size={24} />} 
                onClick={() => toast.info("Progress tracking is currently in Phase 3.")}
              />
              <DashboardCard 
                title="Message Center" 
                description="Coordinate with your mentees via encrypted 1-on-1 chats." 
                icon={<MessageSquare size={24} />} 
                onClick={() => navigate('/community')}
              />
              <DashboardCard 
                title="Availability" 
                description="Set your weekly hours for upcoming mentorship slots." 
                icon={<Calendar size={24} />} 
                onClick={() => toast.info("Schedule management coming soon.")}
              />
              <DashboardCard 
                title="Ethics & Guidelines" 
                description="Professional conduct resources for peer mentorship." 
                icon={<ShieldCheck size={24} />} 
                onClick={() => toast.info("Guidelines are being updated.")}
              />
              <DashboardCard 
                title="Community Forum" 
                description="Connect with other mentors to share experiences and advice." 
                icon={<HeartHandshake size={24} />} 
                onClick={() => navigate('/community')}
              />
           </div>
        </div>

      </div>
    </div>
  );
}
