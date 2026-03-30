import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Heart, ShieldCheck, Sparkles, Plus, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import PaymentModal from '../components/PaymentModal';

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [showPayment, setShowPayment] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customVal, setCustomVal] = useState('');

  const impactPoints = [
    { amount: 500, label: "Fund a Counseling Session", icon: "🤝", description: "Provide a 45-minute professional therapy session for a youth in crisis." },
    { amount: 1500, label: "Community Safe-Space", icon: "🌍", description: "Keep the servers running and moderate the support groups for a month." },
    { amount: 3000, label: "Digital Resilience Kit", icon: "🎒", description: "Develop and translate wellbeing activities into 5 more regional languages." },
  ];

  const handleDonate = () => {
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
           <motion.div initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-200 dark:border-primary-900/50 shadow-inner">
             <Heart size={32} fill="currentColor" />
           </motion.div>
           <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Support Our Mission</h1>
           <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
             Svasthya is built to ensure no adolescent ever feels alone in their mental health journey. Your contribution directly funds crisis support and server costs.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
           
          { impactPoints.map((point, i) => (
             <motion.div 
                key={i} 
                initial={{opacity:0, x: -20}} 
                animate={{opacity:1, x:0}} 
                transition={{delay: i * 0.1}}
                className="bg-white dark:bg-darkcard p-8 rounded-3xl border border-gray-100 dark:border-darkborder shadow-sm hover:shadow-xl hover:border-primary-200 transition-all group flex items-start gap-6"
             >
                <div className="text-4xl shrink-0 group-hover:scale-110 transition-transform">
                   {point.icon}
                </div>
                <div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{point.label}</h3>
                   <p className="text-gray-500 text-sm leading-relaxed mb-4">{point.description}</p>
                   <div className="text-primary-600 dark:text-primary-400 font-black text-xl">₹{point.amount}</div>
                </div>
             </motion.div>
          ))}

          {/* Donation Form */}
          <motion.div initial={{opacity:0, y: 20}} animate={{opacity:1, y: 0}} className="bg-white dark:bg-darkcard rounded-3xl p-8 border border-gray-100 dark:border-darkborder shadow-2xl relative overflow-hidden">
             
             <div className="absolute top-0 right-0 p-8 opacity-5 text-primary-500">
                <Sparkles size={120} />
             </div>

             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 relative z-10">Choose Impact Amount</h2>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
                {[500, 1000, 1500, 3000].map(amt => (
                   <button 
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setIsCustom(false); }}
                      className={`py-4 rounded-2xl font-black text-lg border-2 transition-all ${
                         selectedAmount === amt && !isCustom 
                         ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md shadow-primary-500/10'
                         : 'border-gray-100 dark:border-darkborder text-gray-500 dark:text-gray-400 hover:border-primary-200'
                      }`}
                   >
                     ₹{amt}
                   </button>
                ))}
                <button 
                   onClick={() => setIsCustom(true)}
                   className={`col-span-2 py-4 rounded-2xl font-black text-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      isCustom 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md shadow-primary-500/10'
                      : 'border-gray-100 dark:border-darkborder text-gray-500 dark:text-gray-400 hover:border-primary-200'
                   }`}
                >
                   <Plus size={20} /> Other Amount
                </button>
             </div>

             <AnimatePresence>
                {isCustom && (
                   <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="mb-8 overflow-hidden">
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary-500">₹</span>
                         <input 
                            type="number" 
                            placeholder="Enter custom amount" 
                            value={customVal}
                            onChange={(e) => {setCustomVal(e.target.value); setSelectedAmount(parseInt(e.target.value) || 0); }}
                            className="w-full bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-4 text-xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                         />
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>

             <button 
                onClick={handleDonate}
                disabled={selectedAmount <= 0}
                className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:bg-gray-400 text-white font-bold py-5 rounded-3xl shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-3 text-lg"
             >
                Confirm Donation Contribution <Heart size={20} fill="currentColor" />
             </button>

             <div className="mt-8 pt-8 border-t border-gray-100 dark:border-darkborder flex items-center gap-2 justify-center opacity-70">
                <ShieldCheck className="text-green-500" size={16} />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Powered by Razorpay Secure Payments</p>
             </div>

          </motion.div>

        </div>

      </div>

      <PaymentModal 
         isOpen={showPayment} 
         onClose={() => setShowPayment(false)} 
         amount={selectedAmount} 
         description="Svasthya Platform Donation"
         onConfirm={async (orderId, paymentId) => {
            try {
               const token = localStorage.getItem('token');
               const user = JSON.parse(localStorage.getItem('user') || '{}');
               const response = await fetch('/api/donations/record', {
                  method: 'POST',
                  headers: { 
                     'Content-Type': 'application/json',
                     'Authorization': token ? `Bearer ${token}` : ''
                  },
                  body: JSON.stringify({
                     amount: selectedAmount,
                     razorpayOrderId: orderId,
                     razorpayPaymentId: paymentId,
                     donorName: user.name || 'Anonymous'
                  })
               });

               if (!response.ok) throw new Error("Database record failed");

               toast.success("Donation successful! Thank you for your support.");
               setSelectedAmount(500); // Reset UI
               setShowPayment(false);
            } catch (err) {
               console.error("Donation record failed:", err);
               toast.error("Payment verified but record failed. Please contact support.");
            }
         }} 
      />
    </div>
  );
}
