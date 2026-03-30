import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, ShieldCheck, Clock, Users, ArrowRight, Video, FileText, CheckCircle2 } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { toast } from 'sonner';

export default function TherapistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservedSlots, setReservedSlots] = useState([]);
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [isFree, setIsFree] = useState(false);

  // Helper arrays
  const nextDates = Array.from({length: 6}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // start from tomorrow
    return d;
  });

  const generateSlots = () => {
    return ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  };

  const fetchReserved = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/availability?therapistId=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setReservedSlots(await res.json());
    } catch (err) {
      console.error("Failed to fetch availability:", err);
    }
  };

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [tRes, bRes] = await Promise.all([
          fetch(`/api/community/therapists/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/bookings`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (tRes.ok) {
          setTherapist(await tRes.json());
          fetchReserved();
        } else {
          toast.error("Therapist not found.");
          navigate('/community');
        }

        if (bRes.ok) {
          const bookings = await bRes.json();
          setIsFree(bookings.length === 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapistData();

    // REAL-TIME AVAILABILITY (15s Poll)
    const interval = setInterval(fetchReserved, 15000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  const handleBookingConfirm = async (orderId, paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          therapistId: therapist._id,
          date: selectedDate,
          timeSlot: selectedSlot,
          amount: isFree ? 0 : (therapist.hourlyRate || 1000),
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          isFree: isFree
        })
      });
      if (res.ok) {
        toast.success(isFree ? "Free session booked successfully!" : "Session recorded successfully!");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to record booking.");
      }
    } catch (err) {
      toast.error("Network error while recording booking.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-darkbg text-gray-500">Loading profile...</div>;
  }

  if (!therapist) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6 font-medium text-sm">
          <ChevronLeft size={16} /> Back to Directory
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white dark:bg-darkcard rounded-3xl p-8 border border-gray-100 dark:border-darkborder shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/40 dark:to-indigo-900/30 text-primary-600 dark:text-primary-300 rounded-3xl flex items-center justify-center text-4xl font-black border border-white/50 dark:border-gray-800 shadow-inner">
                  {therapist.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{therapist.name}</h1>
                    <ShieldCheck className="text-blue-500 bg-blue-50 dark:bg-transparent rounded-full" size={20} />
                  </div>
                  <p className="text-primary-600 dark:text-primary-400 font-bold mb-3">{therapist.clinicalSpecialization || therapist.specialization || 'Clinical Psychologist'}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1.5 font-medium"><Star size={16} className="text-yellow-500" fill="currentColor"/> {therapist.rating || 4.8} / 5.0</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400" /> {therapist.yearsExperience || '5+ years'} exp</span>
                    {therapist.sessionLanguages?.length > 0 && <span className="flex items-center gap-1.5"><Users size={16} className="text-gray-400" /> {therapist.sessionLanguages.join(', ')}</span>}
                  </div>
                </div>
              </div>

              <hr className="my-6 border-gray-100 dark:border-darkborder" />
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FileText size={18} className="text-gray-400"/> Professional Bio</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                As a highly trained specialist in adolescent psychology, I focus on creating a secure, judgment-free space where young adults feel truly heard. My approach integrates cognitive behavioral strategies with an empathetic understanding of modern pressures—ensuring we don't just talk, but build actionable frameworks for long-term emotional resilience.
              </p>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Verified Badges & Certifications</h3>
              <div className="flex flex-wrap gap-3">
                {therapist.badges?.map((b, i) => (
                  <span key={i} className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-primary-100 dark:border-primary-900/30 flex items-center gap-2">
                    <CheckCircle2 size={12} /> {b}
                  </span>
                ))}
              </div>
            </motion.div>
            
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white dark:bg-darkcard rounded-3xl p-8 border border-gray-100 dark:border-darkborder shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Video size={18} className="text-primary-500"/> Svasthya Digital Care Guarantee</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">All sessions booked through this platform are fully encrypted, strictly confidential, and conducted via secure 1-on-1 virtual meeting rooms.</p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-gray-800 p-4 rounded-2xl">
                     <p className="text-xs text-gray-400 font-bold uppercase mb-1">Duration</p>
                     <p className="font-bold text-gray-800 dark:text-white">45 Minutes</p>
                   </div>
                   <div className="bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-gray-800 p-4 rounded-2xl">
                     <p className="text-xs text-gray-400 font-bold uppercase mb-1">Cancellations</p>
                     <p className="font-bold text-gray-800 dark:text-white">Free up to 24h</p>
                   </div>
                </div>
            </motion.div>
          </div>

          {/* Booking Widget Column */}
          <div className="lg:col-span-1">
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-white dark:bg-darkcard rounded-3xl border border-gray-100 dark:border-darkborder shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Book a Session</h2>
              
              {/* Date Selection */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">1. Select Date</p>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {nextDates.map((d, i) => {
                    const dateStr = d.toISOString().split('T')[0];
                    const niceDay = d.toLocaleDateString('en-US', { weekday: 'short' });
                    const niceDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={i}
                        onClick={() => { setSelectedDate(dateStr); setSelectedSlot(''); }}
                        className={`shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border-2 transition-all ${
                          isSelected 
                           ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md shadow-primary-500/10' 
                           : 'border-gray-100 dark:border-gray-800 hover:border-primary-300 dark:text-gray-300'
                        }`}
                      >
                         <span className="text-xs font-medium opacity-70 mb-1">{niceDay}</span>
                         <span className="font-bold">{niceDate.split(' ')[1]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mb-8">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">2. Select Time (IST)</p>
                    <div className="grid grid-cols-3 gap-2">
                      {generateSlots().map(slot => {
                        const isReserved = reservedSlots.some(r => r.date === selectedDate && r.timeSlot === slot);
                        return (
                          <button
                            key={slot}
                            onClick={() => !isReserved && setSelectedSlot(slot)}
                            disabled={isReserved}
                            className={`py-2 rounded-xl text-sm font-bold border-2 transition-all relative overflow-hidden ${
                              isReserved 
                               ? 'bg-gray-100 dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-400 cursor-not-allowed opacity-60'
                               : selectedSlot === slot 
                                 ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                 : 'border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                            }`}
                          >
                            {slot}
                            {isReserved && <span className="absolute inset-0 flex items-center justify-center bg-gray-500/10 text-[8px] uppercase tracking-tighter mt-4 font-black">Reserved</span>}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <hr className="my-5 border-gray-100 dark:border-darkborder" />
              
              <div className="flex items-end justify-between mb-4">
                 <div>
                   <p className="text-xs text-gray-500 font-bold uppercase mb-1">{isFree ? 'Promotional Offer' : 'Session Cost'}</p>
                   <div className="flex items-baseline gap-2">
                     <p className="text-2xl font-black text-gray-900 dark:text-white">
                       {isFree ? 'FREE' : `₹${therapist.hourlyRate || 1000}`}
                     </p>
                     {isFree && <p className="text-xs text-gray-400 line-through font-bold">₹{therapist.hourlyRate || 1000}</p>}
                   </div>
                   {isFree && <p className="text-[10px] text-green-500 font-bold mt-1 uppercase tracking-tighter">✨ Your first session is on us!</p>}
                 </div>
              </div>

              <button
                onClick={() => setShowPayment(true)}
                disabled={!selectedDate || !selectedSlot}
                className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/20 transition-all flex justify-center items-center gap-2"
              >
                {isFree ? 'Claim Free Session' : 'Continue to Payment'} <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <PaymentModal 
         isOpen={showPayment} 
         onClose={() => setShowPayment(false)} 
         amount={isFree ? 0 : (therapist.hourlyRate || 1000)} 
         therapistName={therapist.name}
         date={selectedDate}
         timeSlot={selectedSlot}
         isFree={isFree}
         onConfirm={(orderId, paymentId) => handleBookingConfirm(orderId, paymentId)} 
      />
    </div>
  );
}
