import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, UserCheck, Stethoscope, Video, FileText, Settings, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { toast } from 'sonner';

export default function TherapistDashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setSessions(await res.json());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-darkcard p-8 sm:p-12 rounded-[3rem] shadow-sm border border-gray-100 dark:border-darkborder flex flex-col md:flex-row gap-8 items-center justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
              Dr. {user.name} <Stethoscope className="text-primary-500" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl text-lg">
              Clinical Specialization: <strong>{user.clinicalSpecialization || 'Adolescent Psychology'}</strong>
            </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-4 rounded-3xl border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-3">
                <ShieldCheck className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">Verified Expert</span>
             </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Session Management Column */}
           <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <Calendar className="text-gray-400" size={24} /> Upcoming Sessions
              </h2>
              
              {sessions.length > 0 ? (
                <div className="space-y-4">
                   {sessions.map(ses => (
                     <div key={ses._id} className="bg-white dark:bg-darkcard p-6 rounded-3xl border border-gray-100 dark:border-darkborder shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gray-50 dark:bg-darkbg rounded-2xl flex items-center justify-center font-bold text-lg text-primary-600">
                              {ses.userId?.name?.charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold text-gray-900 dark:text-white">{ses.userId?.name}</p>
                              <p className="text-xs text-gray-400 font-medium">{ses.date} • {ses.timeSlot}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary-500 transition-colors">
                              <Video size={14} /> Join Meeting
                           </button>
                           <button className="bg-gray-50 dark:bg-darkbg text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-darkborder px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">
                              Details
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-darkbg/50 p-12 rounded-[3.5rem] border border-gray-100 dark:border-darkborder text-center">
                   <p className="text-gray-400 font-bold italic">"No scheduled sessions at this time."</p>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 pt-4">
                 <Activity className="text-gray-400" size={24} /> Practice Toolkit
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                 <DashboardCard 
                    title="Clinical Cases" 
                    description="Access in-depth assessments and milestone history for your patients." 
                    icon={<FileText size={24} />} 
                    variant="secondary"
                    onClick={() => toast.info("Detailed case records coming in Phase 3.")}
                 />
                 <DashboardCard 
                    title="Profile Settings" 
                    description="Update your bio, photo, and clinical specialization for the directory." 
                    icon={<Settings size={24} />} 
                    variant="secondary"
                    onClick={() => toast.info("Profile editor loading in Phase 3.")}
                 />
              </div>
           </div>

           {/* Stats & Tools Column */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-primary-600 text-white p-8 rounded-[3.5rem] shadow-xl shadow-primary-500/20 flex flex-col items-center justify-center text-center">
                 <UserCheck size={48} className="mb-4 opacity-50" />
                 <h2 className="text-4xl font-black mb-2">{sessions.length}</h2>
                 <p className="text-sm font-bold uppercase tracking-widest opacity-80">Total Svasthya Patients</p>
              </div>

              <div className="bg-white dark:bg-darkcard p-8 rounded-[3rem] border border-gray-100 dark:border-darkborder shadow-sm">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Patient Analytics</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500 font-medium tracking-wide">Completion Rate</span>
                       <span className="font-black text-primary-600">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-darkbg h-1.5 rounded-full overflow-hidden">
                       <div className="w-[98%] h-full bg-emerald-500" />
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2">
                       <span className="text-gray-500 font-medium tracking-wide">Avg Rating</span>
                       <span className="font-black text-indigo-600">4.9/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-darkbg h-1.5 rounded-full overflow-hidden">
                       <div className="w-[98%] h-full bg-indigo-500" />
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => navigate('/community')}
                className="w-full bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 font-bold py-5 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/30 hover:bg-indigo-100 transition-all flex items-center justify-center gap-3"
              >
                 Open Professional Forum
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
