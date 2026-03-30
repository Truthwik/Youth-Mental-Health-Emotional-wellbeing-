import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Printer, Download, Calendar, Clock, User, Hash } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  onConfirm, 
  description, 
  therapistName, 
  date, 
  isFree,
  timeSlot 
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleRazorpayPayment = async () => {
    if (amount === 0 || isFree) {
      onConfirm('FREE', 'FREE'); // Skip Razorpay for free sessions
      setSuccess(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};

      // 1. Fetch Razorpay Key ID from Backend
      const keyRes = await fetch('/api/payment/key', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { key } = await keyRes.json();

      // 2. Create Order on Backend
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount, description })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Order Creation Failed");

      // 3. Open Razorpay Checkout
      const options = {
        key: key, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Svasthya Support",
        description: description,
        order_id: orderData.id,
        handler: async (response) => {
          // 4. Verify Payment
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ orderId: orderData.id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setReceiptData(response);
              setSuccess(true);
              toast.success("Payment Received!");
              
              // Record specific booking after successful verification
              onConfirm(response.razorpay_order_id, response.razorpay_payment_id);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Payment verification error.");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#8b5cf6", // Primary-600
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', function (response){
        toast.error("Payment failed: " + response.error.description);
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:p-0 print:bg-white">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className={`bg-white dark:bg-darkcard w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-darkborder relative transition-all ${success ? 'max-w-xl' : 'max-w-md'} print:shadow-none print:border-none print:w-full print:max-w-none`}
        >
          {success ? (
            <div className="p-8 print:p-0">
               <div className="flex justify-between items-center mb-8 print:hidden">
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                     <CheckCircle2 size={24} /> Payment Confirmed
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-darkbg rounded-full transition-colors">
                     <X size={20} className="text-gray-400" />
                  </button>
               </div>

               {/* DIGITAL RECEIPT UI */}
               <div className="bg-gray-50 dark:bg-darkbg/50 rounded-3xl p-8 border border-gray-100 dark:border-darkborder print:bg-transparent">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Svasthya</h2>
                        <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Official Digital Receipt</p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">Invoice: INV-{receiptData?.razorpay_payment_id ? receiptData.razorpay_payment_id.slice(-6).toUpperCase() : '---'}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</p>
                           <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{description}</p>
                        </div>
                        <div className="space-y-1 text-right">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</p>
                           <p className="text-xl font-black text-primary-600 dark:text-primary-400">₹{amount}</p>
                        </div>
                     </div>

                     <hr className="border-gray-200 dark:border-darkborder border-dashed" />

                     <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        {therapistName && (
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-white dark:bg-darkcard rounded-lg border border-gray-100 dark:border-darkborder">
                                <User size={14} className="text-primary-500" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Professional</p>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{therapistName}</p>
                             </div>
                          </div>
                        )}
                        {date && (
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-white dark:bg-darkcard rounded-lg border border-gray-100 dark:border-darkborder">
                                <Calendar size={14} className="text-primary-500" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{date}</p>
                             </div>
                          </div>
                        )}
                        {timeSlot && (
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-white dark:bg-darkcard rounded-lg border border-gray-100 dark:border-darkborder">
                                <Clock size={14} className="text-primary-500" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Time Slot</p>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{timeSlot}</p>
                             </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-white dark:bg-darkcard rounded-lg border border-gray-100 dark:border-darkborder">
                              <Hash size={14} className="text-primary-500" />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Payment ID</p>
                              <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate w-24 lg:w-32">{receiptData?.razorpay_payment_id}</p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30 text-center">
                        <p className="text-[10px] text-primary-700 dark:text-primary-300 font-bold uppercase tracking-widest">CONFIDENTIALITY GUARANTEED</p>
                        <p className="text-[9px] text-primary-600/70 dark:text-primary-400/70 mt-1 uppercase tracking-tighter">This is a system generated document and does not require a physical signature.</p>
                     </div>
                  </div>
               </div>

               <div className="mt-6 flex gap-3 print:hidden">
                  <button 
                     onClick={handlePrint}
                     className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all border border-transparent shadow-lg"
                  >
                     <Printer size={18} /> Print Receipt
                  </button>
                  <button 
                     onClick={onClose}
                     className="flex-1 bg-white dark:bg-darkcard text-gray-700 dark:text-white font-bold py-3.5 rounded-2xl border border-gray-200 dark:border-darkborder hover:bg-gray-50 transition-all"
                  >
                     Done
                  </button>
               </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gray-50 dark:bg-darkbg p-6 border-b border-gray-100 dark:border-darkborder flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <ShieldCheck className="text-primary-500" /> Razorpay Checkout
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-green-500" /> Secure Payment Gateway
                  </p>
                </div>
                <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Info Area */}
              <div className="p-8 space-y-6">
                <div className="text-center">
                   <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest mb-2">Payment Summary</p>
                   <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">₹{amount}</p>
                   <p className="text-sm font-medium text-gray-400">{description}</p>
                </div>

                <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-2xl border border-primary-100 dark:border-primary-800/30 flex items-start gap-3">
                   <AlertCircle size={18} className="text-primary-500 shrink-0 mt-0.5" />
                   <p className="text-[11px] text-primary-700 dark:text-primary-300 leading-relaxed font-medium">
                     You are about to be redirected to the secure Razorpay payment gateway to finalize your transaction. 
                     Please do not close this window or refresh the page during processing.
                   </p>
                </div>

                <button
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-primary-400 text-white font-bold py-4 rounded-2xl mt-4 shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Preparing...</>
                  ) : (
                    isFree ? 'Confirm Free Session' : `Open Checkout Modal`
                  )}
                </button>
                <div className="flex items-center justify-center gap-4 mt-6 opacity-40">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-3" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-4" />
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
