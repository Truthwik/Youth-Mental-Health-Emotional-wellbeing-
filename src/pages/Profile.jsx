import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, Award, Edit3, Save, X, 
  Briefcase, Star, Clock, Calendar, CheckCircle2,
  ChevronRight, Camera, Settings, Bell, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import CalendarHub from '../components/CalendarHub';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    clinicalSpecialization: '',
    bio: '',
    hourlyRate: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!storedUser.token || storedUser.token === 'undefined') {
        setLoading(false);
        setUser(null);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      });
      const data = await response.json();
      
      const bookingsRes = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      });
      const bookingsData = await bookingsRes.json();
      
      if (response.ok) {
        setUser(data);
        setBookings(bookingsData || []);
        setFormData({
          name: data.name || '',
          specialization: data.specialization || '',
          clinicalSpecialization: data.clinicalSpecialization || '',
          bio: data.bio || '',
          hourlyRate: data.hourlyRate || '',
        });
      } else {
        // Clear user if token is invalid
        setUser(null);
        if (response.status === 401) {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      toast.error("Failed to load profile data");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        fetchUserData();
        
        // Update local storage name if changed
        const newUser = { ...storedUser, name: formData.name };
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("An error occurred during update");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkbg">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkbg text-gray-500">
      Account not found. Please log in again.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[3rem] shadow-2xl opacity-90 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <motion.div 
               animate={{ x: [0, 20, 0], y: [0, 10, 0] }} 
               transition={{ duration: 10, repeat: Infinity }}
               className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" 
            />
          </div>
          
          <div className="absolute -bottom-12 left-10 flex items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-darkcard border-4 border-white dark:border-darkcard shadow-xl flex items-center justify-center text-4xl font-black text-primary-600 italic overflow-hidden">
                {user.name.charAt(0)}
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-primary-500 text-white rounded-xl shadow-lg border-2 border-white dark:border-darkcard hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            <div className="mb-4">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3 italic">
                {user.name}
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest text-white border border-white/30">
                  {user.role}
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm tracking-tight flex items-center gap-2">
                <Mail size={14} className="text-primary-500" /> {user.email}
              </p>
            </div>
          </div>

          <div className="absolute top-10 right-10 flex gap-2">
             <button 
               onClick={() => setIsEditing(!isEditing)}
               className="flex items-center gap-2 px-6 py-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-2xl border border-white/30 font-black text-[10px] uppercase tracking-widest transition-all"
             >
               {isEditing ? <X size={14} /> : <Edit3 size={14} />}
               {isEditing ? 'Cancel' : 'Edit Profile'}
             </button>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-20">
          
          {/* Left Column - Stats & Identity */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Achievement Card (Youth Only) */}
            {user.role === 'youth' && (
              <div className="bg-white dark:bg-darkcard rounded-[2.5rem] p-8 border border-gray-100 dark:border-darkborder shadow-sm">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Award size={14} className="text-primary-500" /> Milestones & Growth
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-4xl font-black text-primary-600 italic">Lv.{user.level || 1}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase">{user.xp || 0} XP</p>
                   </div>
                   <div className="h-2 w-full bg-gray-100 dark:bg-darkbg rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${(user.xp % 100) || 20}%` }} 
                        className="h-full bg-primary-500" 
                      />
                   </div>
                   <p className="text-[10px] text-gray-400 font-bold text-center">{(100 - (user.xp % 100)) || 80} XP to next level</p>
                </div>
              </div>
            )}

            {/* Tags Card (Youth Only) */}
            {(user.role === 'youth' && user.communityTags?.length > 0) && (
              <div className="bg-white dark:bg-darkcard rounded-[2.5rem] p-8 border border-gray-100 dark:border-darkborder shadow-sm">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Identity Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {user.communityTags.map((tag, i) => (
                    <span key={i} className="px-4 py-1.5 bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary-100 dark:border-primary-900/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Security Quick Actions */}
            <div className="bg-white dark:bg-darkcard rounded-[2.5rem] p-8 border border-gray-100 dark:border-darkborder shadow-sm">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 italic">Account Security</h3>
               <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-darkbg/50 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-darkborder transition-all group">
                     <div className="flex items-center gap-3">
                        <Lock size={16} className="text-gray-400 group-hover:text-primary-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Change Password</span>
                     </div>
                     <ChevronRight size={14} className="text-gray-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-darkbg/50 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-darkborder transition-all group">
                     <div className="flex items-center gap-3">
                        <Bell size={16} className="text-gray-400 group-hover:text-primary-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Notifications</span>
                     </div>
                     <ChevronRight size={14} className="text-gray-300" />
                  </button>
               </div>
            </div>
          </div>

          {/* Right Column - Forms & Bio */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* New Calendar Bento Card */}
            <CalendarHub events={bookings} userRole={user.role} />

            <div className="bg-white dark:bg-darkcard rounded-[3rem] p-10 border border-gray-100 dark:border-darkborder shadow-sm min-h-full relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form 
                    key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleUpdate} className="space-y-8 relative z-10"
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                          <input 
                            type="text" value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-darkbg border-2 border-transparent focus:border-primary-500 rounded-3xl px-6 py-4 text-gray-900 dark:text-white font-bold outline-none transition-all"
                          />
                       </div>
                       {(user.role === 'mentor' || user.role === 'therapist') && (
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Specialization</label>
                             <input 
                               type="text" value={formData.specialization} 
                               onChange={e => setFormData({...formData, specialization: e.target.value})}
                               className="w-full bg-gray-50 dark:bg-darkbg border-2 border-transparent focus:border-primary-500 rounded-3xl px-6 py-4 text-gray-900 dark:text-white font-bold outline-none transition-all"
                             />
                          </div>
                       )}
                    </div>

                    {(user.role === 'therapist') && (
                       <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Clinical Specialization</label>
                             <input 
                               type="text" value={formData.clinicalSpecialization} 
                               onChange={e => setFormData({...formData, clinicalSpecialization: e.target.value})}
                               className="w-full bg-gray-50 dark:bg-darkbg border-2 border-transparent focus:border-primary-500 rounded-3xl px-6 py-4 text-gray-900 dark:text-white font-bold outline-none transition-all"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Hourly Rate (₹)</label>
                             <input 
                               type="number" value={formData.hourlyRate} 
                               onChange={e => setFormData({...formData, hourlyRate: e.target.value})}
                               className="w-full bg-gray-50 dark:bg-darkbg border-2 border-transparent focus:border-primary-500 rounded-3xl px-6 py-4 text-gray-900 dark:text-white font-bold outline-none transition-all"
                             />
                          </div>
                       </div>
                    )}

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Personal Bio / Statement</label>
                       <textarea 
                         rows={4} value={formData.bio} 
                         onChange={e => setFormData({...formData, bio: e.target.value})}
                         className="w-full bg-gray-50 dark:bg-darkbg border-2 border-transparent focus:border-primary-500 rounded-3xl px-6 py-4 text-gray-900 dark:text-white font-medium outline-none transition-all resize-none"
                         placeholder="Tell the community about yourself..."
                       />
                    </div>

                    <button 
                      type="submit"
                      className="flex items-center gap-2 px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all ml-auto hover:-translate-y-1"
                    >
                      <Save size={14} /> Save Configuration
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-10"
                  >
                    <div>
                       <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 italic flex items-center gap-2">
                          <Settings size={22} className="text-primary-500" />
                          Profile Blueprint
                       </h2>
                       <div className="prose dark:prose-invert">
                          <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                            {user.bio || "No professional biography has been established yet. Click edit to refine your profile and share your story with the Svasthya community."}
                          </p>
                       </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8 border-t border-gray-50 dark:border-gray-800 pt-10">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <Shield size={14} className="text-primary-500" /> Operational Role
                          </h4>
                          <div className="p-5 bg-gray-50 dark:bg-darkbg rounded-3xl border border-gray-100 dark:border-darkborder">
                             <p className="text-lg font-black text-gray-900 dark:text-white italic capitalize">{user.role}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Verified Account Status</p>
                          </div>
                       </div>

                       {(user.role === 'mentor' || user.role === 'therapist') && (
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase size={14} className="text-primary-500" /> Practice Focus
                             </h4>
                             <div className="p-5 bg-gray-50 dark:bg-darkbg rounded-3xl border border-gray-100 dark:border-darkborder">
                                <p className="text-lg font-black text-gray-900 dark:text-white italic">{user.clinicalSpecialization || user.specialization || "General Support"}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Specialized Discipline</p>
                             </div>
                          </div>
                       )}
                    </div>

                    {user.role === 'therapist' && (
                       <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} className="text-primary-500" /> Temporal Value
                             </h4>
                             <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
                                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 italic">₹{user.hourlyRate || 1000} / hr</p>
                                <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-tighter mt-1">Standard Clinical Fee</p>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-primary-500" /> Experience Level
                             </h4>
                             <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/30">
                                <p className="text-lg font-black text-blue-600 dark:text-blue-400 italic">Senior Associate</p>
                                <p className="text-[10px] text-blue-500/60 font-bold uppercase tracking-tighter mt-1">Validated Professional Tier</p>
                             </div>
                          </div>
                       </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Background Accent Decorative */}
              <div className="absolute -bottom-10 -right-10 opacity-5 dark:opacity-10 pointer-events-none">
                 <Shield size={300} className="text-primary-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
