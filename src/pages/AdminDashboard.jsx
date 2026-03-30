import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, HeartPulse, CreditCard, Calendar, ArrowRight, Search, Activity, ShieldCheck, CheckCircle2, Globe } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [sRes, uRes, sesRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/sessions', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (sRes.ok) setStats(await sRes.json());
        if (uRes.ok) setUsers(await uRes.json());
        if (sesRes.ok) setSessions(await sesRes.json());
      } catch (err) {
        toast.error("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-darkbg text-gray-400 font-black italic tracking-widest animate-pulse">VERIFYING MISSION CONTROL...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Simplified Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3 italic tracking-tight">
              <ShieldCheck className="text-primary-600" size={36} /> Mission Control
            </h1>
            <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 italic">Platform-wide systems overview</p>
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Query system users..." 
                  className="bg-white dark:bg-darkcard border border-gray-100 dark:border-darkborder rounded-2xl pl-10 pr-4 py-3 text-xs font-bold focus:ring-1 focus:ring-primary-500 outline-none w-64 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Bento Grid Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title="Total Youth" 
              description={`${stats?.totalYouth || 0}`} 
              icon={<Users size={24} />} 
              trend="up"
              trendValue="12%"
              delay={0.1}
            />
            <DashboardCard 
              title="Certified Peers" 
              description={`${stats?.totalMentors || 0}`} 
              icon={<UserCheck size={24} />} 
              variant="secondary"
              delay={0.2}
            />
            <DashboardCard 
              title="Clinicians" 
              description={`${stats?.totalTherapists || 0}`} 
              icon={<HeartPulse size={24} />} 
              delay={0.3}
            />
            <DashboardCard 
              title="Impact Donations" 
              description={`₹${(stats?.donationRevenue || 0).toLocaleString()}`} 
              icon={<HeartPulse size={24} className="text-rose-500" />} 
              variant="accent"
              trend="up"
              trendValue="₹5,200"
              delay={0.4}
            />
            <DashboardCard 
              title="Total Platform Cashflow" 
              description={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} 
              icon={<CreditCard size={24} />} 
              variant="primary"
              className="lg:col-span-2"
              delay={0.5}
            />
            <div className="lg:col-span-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative group">
               <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">System Health</p>
                  <h3 className="text-2xl font-black text-emerald-700 italic">Operational</h3>
               </div>
               <div className="flex gap-1 items-end h-8 relative z-10">
                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.6 + (i * 0.1), repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                      className="w-1.5 bg-emerald-500/40 rounded-full"
                    />
                  ))}
               </div>
               <Activity className="absolute -right-4 -bottom-4 text-emerald-500/5 group-hover:scale-110 transition-transform" size={160} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-white dark:bg-darkcard rounded-[2.5rem] border border-gray-100 dark:border-darkborder shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-50 dark:border-darkborder bg-gray-50/50 dark:bg-darkbg/20">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'users' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              User Repository
            </button>
            <button 
              onClick={() => setActiveTab('sessions')}
              className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'sessions' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              System Events
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'users' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* YOUTH COLUMN */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                      <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                         Youth Repository ({filteredUsers.filter(u => u.role === 'youth').length})
                      </h3>
                   </div>
                   <div className="space-y-3">
                      {filteredUsers.filter(u => u.role === 'youth').map(user => (
                        <div key={user._id} className="p-4 bg-gray-50/50 dark:bg-darkbg/30 rounded-2xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all group">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="text-sm font-black text-gray-900 dark:text-white mb-0.5">{user.name}</p>
                                 <p className="text-[10px] text-gray-400 font-bold tracking-tight">{user.email}</p>
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${user.onboardingComplete ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                 {user.onboardingComplete ? 'Active' : 'Pending'}
                              </span>
                           </div>
                        </div>
                      ))}
                      {filteredUsers.filter(u => u.role === 'youth').length === 0 && <p className="text-[10px] text-gray-400 italic">No youth profiles found.</p>}
                   </div>
                </div>

                {/* MENTOR COLUMN */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                      <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                         Certified Peers ({filteredUsers.filter(u => u.role === 'mentor').length})
                      </h3>
                   </div>
                   <div className="space-y-3">
                      {filteredUsers.filter(u => u.role === 'mentor').map(user => (
                        <div key={user._id} className="p-4 bg-gray-50/50 dark:bg-darkbg/30 rounded-2xl border border-transparent hover:border-purple-100 dark:hover:border-purple-900/30 transition-all group">
                           <div className="flex justify-between items-start mb-2">
                              <div>
                                 <p className="text-sm font-black text-gray-900 dark:text-white mb-0.5">{user.name}</p>
                                 <p className="text-[10px] text-gray-400 font-bold tracking-tight">{user.email}</p>
                              </div>
                              <UserCheck size={14} className="text-purple-400" />
                           </div>
                           <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 w-fit px-2 py-0.5 rounded-md">
                              {user.specialization || 'General Mentor'}
                           </p>
                        </div>
                      ))}
                      {filteredUsers.filter(u => u.role === 'mentor').length === 0 && <p className="text-[10px] text-gray-400 italic">No mentors found.</p>}
                   </div>
                </div>

                {/* THERAPIST COLUMN */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                      <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                         Clinical Partners ({filteredUsers.filter(u => u.role === 'therapist').length})
                      </h3>
                   </div>
                   <div className="space-y-3">
                      {filteredUsers.filter(u => u.role === 'therapist').map(user => (
                        <div key={user._id} className="p-4 bg-gray-50/50 dark:bg-darkbg/30 rounded-2xl border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all group">
                           <div className="flex justify-between items-start mb-2">
                              <div>
                                 <p className="text-sm font-black text-gray-900 dark:text-white mb-0.5">{user.name}</p>
                                 <p className="text-[10px] text-gray-400 font-bold tracking-tight">{user.email}</p>
                              </div>
                              <HeartPulse size={14} className="text-emerald-400" />
                           </div>
                           <div className="flex gap-2">
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">
                                 {user.clinicalSpecialization || user.specialization || 'Clinician'}
                              </span>
                              <span className="text-[9px] font-black text-gray-400 border border-gray-100 dark:border-gray-800 px-2 py-0.5 rounded-md">
                                 ₹{user.hourlyRate || 1000}/hr
                              </span>
                           </div>
                        </div>
                      ))}
                      {filteredUsers.filter(u => u.role === 'therapist').length === 0 && <p className="text-[10px] text-gray-400 italic">No therapists found.</p>}
                   </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800">
                      <th className="pb-5 px-4 font-black">Subject</th>
                      <th className="pb-5 px-4 font-black">Practitioner</th>
                      <th className="pb-5 px-4 font-black">Temporal Signature</th>
                      <th className="pb-5 px-4 font-black">Tier</th>
                      <th className="pb-5 px-4 text-right font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {sessions.map(session => (
                      <tr key={session._id} className="hover:bg-gray-50 dark:hover:bg-darkbg/50 transition-colors">
                        <td className="py-5 px-4 font-black text-gray-900 dark:text-white italic">
                          {session.userId?.name || '---'}
                        </td>
                        <td className="py-5 px-4 font-black text-primary-600 tracking-tight">
                          {session.therapistId?.name || '---'}
                        </td>
                        <td className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                           {session.date} • {session.timeSlot}
                        </td>
                        <td className="py-5 px-4">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${session.isFree ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                             {session.isFree ? 'PROMO' : 'STANDARD'}
                           </span>
                        </td>
                        <td className="py-5 px-4 text-right">
                           <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-300">
                             <CheckCircle2 size={12} /> {session.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

