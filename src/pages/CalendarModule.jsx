import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Video, User, 
  Plus, Search, Filter, ChevronRight, LayoutGrid, List
} from 'lucide-react';
import CalendarHub from '../components/CalendarHub';
import { toast } from 'sonner';

export default function CalendarModule() {
  const [view, setView] = useState('grid');
  const [bookings, setBookings] = useState([]);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00',
    type: 'Meditation',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.token) {
       toast.error("Session expired. Please login again.");
       return;
    }
    setUser(storedUser);
    fetchData(storedUser.token);

    const interval = setInterval(() => fetchData(storedUser.token), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (token) => {
    if (!token || token === 'undefined') {
      setLoading(false);
      return;
    }
    try {
      const [bRes, pRes] = await Promise.all([
        fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/personal-events', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (bRes.status === 401) {
         console.warn("Unauthorized access. Token might be stale.");
         return;
      }

      if (bRes.ok) setBookings(await bRes.json());
      if (pRes.ok) setPersonalEvents(await pRes.json());
    } catch (err) {
      console.error("Data sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('/api/personal-events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newEvent)
      });
      
      if (res.ok) {
        toast.success("Wellbeing Event Added!");
        setShowModal(false);
        fetchData(token);
        setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], timeSlot: '09:00', type: 'Meditation', notes: '' });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save event.");
      }
    } catch (err) {
      toast.error("Connection error. Is the server running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allEvents = [
    ...bookings.map(b => ({ ...b, source: 'booking' })),
    ...personalEvents.map(p => ({ ...p, source: 'personal' }))
  ];

  const upcomingSessions = allEvents
    .filter(b => new Date(b.date) >= new Date().setHours(0,0,0,0))
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header - Advanced Control */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-darkcard p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-darkborder relative overflow-hidden">
           <div className="relative z-10">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tight flex items-center gap-3">
                 <CalendarIcon size={32} className="text-primary-500" /> Planning Hub
              </h1>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 ml-11">Real-time Session Management</p>
           </div>
           
           <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
              <div className="flex bg-gray-100 dark:bg-darkbg p-1.5 rounded-2xl border border-gray-200 dark:border-darkborder">
                 <button 
                   onClick={() => setView('grid')}
                   className={`p-2.5 rounded-xl transition-all ${view === 'grid' ? 'bg-white dark:bg-darkcard shadow-sm text-primary-600' : 'text-gray-400'}`}
                 >
                    <LayoutGrid size={18} />
                 </button>
                 <button 
                   onClick={() => setView('list')}
                   className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-white dark:bg-darkcard shadow-sm text-primary-600' : 'text-gray-400'}`}
                 >
                    <List size={18} />
                 </button>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all ml-auto md:ml-0"
              >
                 <Plus size={14} /> New Growth Event
              </button>
           </div>

           <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
           
           {/* Sidebar: Upcoming & Analytics */}
           <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-white dark:bg-darkcard rounded-[2.5rem] p-8 border border-gray-100 dark:border-darkborder shadow-sm">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                    Live Allotment 
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 </h3>
                 <div className="space-y-4">
                    {upcomingSessions.length > 0 ? upcomingSessions.map((session, i) => (
                      <div key={i} className="group relative flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-primary-900/10 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-darkborder active:scale-95 cursor-pointer">
                         <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl">
                            <Clock size={16} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate">{session.therapistId?.name || "Wellbeing Session"}</p>
                            <p className="text-[9px] text-gray-400 font-bold mt-0.5">{new Date(session.date).toLocaleDateString([], {month:'short', day:'numeric'})} • {session.timeSlot}</p>
                         </div>
                         <ChevronRight size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    )) : (
                      <p className="text-xs text-gray-400 italic text-center py-4">No sessions allotted yet.</p>
                    )}
                 </div>
              </div>

              {/* Status Badge */}
              <div className="bg-gradient-to-br from-indigo-600 to-primary-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20">
                 <div className="flex items-center gap-2 mb-4 opacity-80">
                    <Video size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Connectivity Status</span>
                 </div>
                 <h4 className="text-xl font-black italic mb-2">Digital Portal Ready</h4>
                 <p className="text-[10px] opacity-70 leading-relaxed font-bold">Your allotted slots are automatically synchronized with our encrypted video rooms.</p>
              </div>
           </div>

           {/* Main Calendar Space */}
           <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                 {view === 'grid' ? (
                   <motion.div 
                     key="grid"
                     initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}
                     className="h-full"
                   >
                      <CalendarHub events={allEvents} userRole={user?.role} />
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="list"
                     initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}
                     className="bg-white dark:bg-darkcard rounded-[3rem] p-10 border border-gray-100 dark:border-darkborder shadow-sm"
                   >
                      <div className="space-y-6">
                         <h2 className="text-xl font-black text-gray-900 dark:text-white italic">Full Manifest of Bookings</h2>
                         <div className="space-y-2">
                            {allEvents.map((b, i) => (
                              <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-darkbg rounded-3xl border border-gray-100 dark:border-darkborder">
                                 <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 bg-white dark:bg-darkcard rounded-2xl flex items-center justify-center border border-gray-100 dark:border-darkborder shadow-sm ${b.source === 'booking' ? 'text-primary-600' : 'text-teal-500'}`}>
                                       {b.source === 'booking' ? <CalendarIcon size={20} /> : <Plus size={20} />}
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-gray-900 dark:text-white uppercase">
                                         {b.source === 'booking' ? b.therapistId?.name : b.title}
                                       </p>
                                       <p className="text-[10px] text-gray-400 font-bold">
                                         {new Date(b.date).toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'})} • {b.timeSlot}
                                       </p>
                                    </div>
                                 </div>
                                 {b.source === 'booking' ? (
                                   <button className="px-6 py-2.5 bg-white dark:bg-darkcard border border-gray-200 dark:border-darkborder rounded-xl text-[10px] font-black uppercase tracking-widest text-primary-600 hover:bg-primary-600 hover:text-white transition-all">
                                      Join Room
                                   </button>
                                 ) : (
                                   <span className="text-[9px] font-black uppercase tracking-widest text-teal-600 px-3 py-1 bg-teal-50 dark:bg-teal-900/20 rounded-full">Manual Note</span>
                                 )}
                              </div>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}}
               className="relative bg-white dark:bg-darkcard w-full max-w-md rounded-[3rem] p-10 shadow-2xl overflow-hidden"
             >
                <div className="relative z-10">
                   <h2 className="text-2xl font-black text-gray-900 dark:text-white italic mb-2 tracking-tight">Manual Entry</h2>
                   <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-8">Personal Wellbeing Milestone</p>

                   <form onSubmit={handleAddEvent} className="space-y-6">
                      <div>
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Event Title</label>
                         <input 
                           required type="text" placeholder="e.g. Morning Meditation"
                           value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                           className="w-full bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkborder rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 ring-primary-500/20 transition-all dark:text-white"
                         />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Date</label>
                            <input 
                              required type="date"
                              value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkborder rounded-2xl px-4 py-4 text-xs focus:outline-none focus:ring-2 ring-primary-500/20 transition-all dark:text-white"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Time</label>
                            <input 
                              required type="time"
                              value={newEvent.timeSlot} onChange={(e) => setNewEvent({...newEvent, timeSlot: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkborder rounded-2xl px-4 py-4 text-xs focus:outline-none focus:ring-2 ring-primary-500/20 transition-all dark:text-white"
                            />
                         </div>
                      </div>

                      <div>
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Activity Tone</label>
                         <select 
                           value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                           className="w-full bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkborder rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 ring-primary-500/20 appearance-none dark:text-white"
                         >
                            <option value="Meditation">🧘 Meditation</option>
                            <option value="Study">📚 Deep Study</option>
                            <option value="Social">🤝 Peer Social</option>
                            <option value="Reflection">📝 Self Reflection</option>
                            <option value="Exercise">🏃 Movement</option>
                         </select>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-primary-500/20 transition-all active:scale-[0.98] uppercase tracking-widest text-[11px] disabled:opacity-50 disabled:cursor-wait"
                      >
                         {isSubmitting ? 'Securing Portal Entry...' : 'Secure Entry'}
                      </button>
                   </form>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
