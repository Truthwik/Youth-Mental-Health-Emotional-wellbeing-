import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Video, Clock, User, CheckCircle2, Star, Sparkles 
} from 'lucide-react';

export default function CalendarHub({ events = [], userRole = 'youth' }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Calendar Logic (Native JS)
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    // Previous month filler
    const prevMonthDays = daysInMonth(year, month - 1);
    const fillers = Array.from({ length: firstDay }, (_, i) => ({
      day: prevMonthDays - firstDay + i + 1,
      isCurrentMonth: false
    }));

    // Current month days
    const days = Array.from({ length: totalDays }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
      fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
    }));

    return [...fillers, ...days];
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1));

  // Filter events for specific days
  const getEventsForDate = (dateStr) => {
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="bg-white dark:bg-darkcard rounded-[3rem] border border-gray-100 dark:border-darkborder shadow-sm p-8 h-full flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-primary-500 text-white rounded-2xl shadow-lg shadow-primary-500/20">
              <CalendarIcon size={20} />
           </div>
           <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white italic capitalize">{monthName}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{year} Planning Hub</p>
           </div>
        </div>
        <div className="flex gap-2">
           <button onClick={handlePrevMonth} className="p-2.5 hover:bg-gray-50 dark:hover:bg-darkbg rounded-xl text-gray-400 hover:text-primary-500 transition-all border border-gray-100 dark:border-darkborder">
              <ChevronLeft size={18} />
           </button>
           <button onClick={handleNextMonth} className="p-2.5 hover:bg-gray-50 dark:hover:bg-darkbg rounded-xl text-gray-400 hover:text-primary-500 transition-all border border-gray-100 dark:border-darkborder">
              <ChevronRight size={18} />
           </button>
        </div>
      </div>

      {/* Weekdays Label */}
      <div className="grid grid-cols-7 mb-4 relative z-10">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-black text-gray-300 uppercase tracking-tighter">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 flex-grow gap-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${monthName}-${year}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="col-span-7 grid grid-cols-7 gap-1"
          >
            {monthData.map((d, index) => {
              const dayEvents = d.fullDate ? getEventsForDate(d.fullDate) : [];
              const isToday = d.isCurrentMonth && d.day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
              const hasEvents = dayEvents.length > 0;

              return (
                <button 
                  key={index}
                  onClick={() => d.fullDate && setSelectedDay(d.fullDate === selectedDay ? null : d.fullDate)}
                  disabled={!d.isCurrentMonth}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all group
                    ${!d.isCurrentMonth ? 'opacity-20 cursor-default' : 'hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer'}
                    ${isToday ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20' : ''}
                    ${selectedDay === d.fullDate ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}
                  `}
                >
                  <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-gray-900 dark:text-gray-100'} ${!d.isCurrentMonth ? 'text-gray-300' : ''}`}>
                    {d.day}
                  </span>
                  
                  {/* Event Indicators */}
                  {hasEvents && (
                    <div className="mt-1 flex gap-0.5">
                        {dayEvents.map((e, i) => (
                          <div 
                            key={i} 
                            className={`w-1 h-1 rounded-full ${e.source === 'booking' ? 'bg-primary-500' : 'bg-teal-500'} ${isToday ? 'bg-white' : ''}`}
                          />
                        ))}
                     </div>
                  )}

                  {/* Day Detail Popover */}
                  <AnimatePresence>
                    {selectedDay === d.fullDate && hasEvents && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-60 z-[100] p-4 bg-white dark:bg-darkcard rounded-3xl shadow-2xl border border-gray-100 dark:border-darkborder pointer-events-auto"
                      >
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Sparkles size={12} className="text-primary-500" /> Planned Activities
                         </h4>
                         <div className="space-y-3">
                            {dayEvents.map((e, i) => (
                              <div key={i} className={`p-3 rounded-xl border text-left ${e.source === 'booking' ? 'bg-indigo-50 dark:bg-primary-900/10 border-indigo-100 dark:border-primary-900/30' : 'bg-teal-50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900/30'}`}>
                                 <div className="flex justify-between items-start mb-1">
                                    <p className="text-[9px] font-black text-gray-900 dark:text-white uppercase truncate">
                                       {e.source === 'booking' ? (e.therapistId?.name || "Therapy Session") : e.title}
                                    </p>
                                    <span className={`text-[8px] font-black uppercase ${e.source === 'booking' ? 'text-indigo-600' : 'text-teal-600'}`}>{e.timeSlot}</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-[8px] text-gray-400 font-bold">
                                    {e.source === 'booking' ? <Video size={10} /> : <Sparkles size={10} />}
                                    <span className="truncate">{e.source === 'booking' ? 'Secure Video Portal' : (e.type || 'Personal Growth')}</span>
                                 </div>
                              </div>
                            ))}
                         </div>
                         <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-darkcard border-b border-r border-gray-100 dark:border-darkborder rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend Footer */}
      <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-center gap-6 relative z-10">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Clinical Sessions</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Growth Rituals</span>
         </div>
      </div>

      {/* Decorative Accent */}
      <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none">
         <CalendarIcon size={300} className="text-primary-500" />
      </div>
    </div>
  );
}
