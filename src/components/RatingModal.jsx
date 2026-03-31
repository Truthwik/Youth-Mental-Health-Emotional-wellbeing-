import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function RatingModal({ isOpen, onClose, toUserId, role, sessionId = null, name }) {
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
  const displayed = hovered || stars;

  const handleSubmit = async () => {
    if (stars === 0) { toast.error('Please select a star rating.'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ toUserId, role, stars, comment, sessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        toast.success(`Thank you! New avg: ${data.newAvg}★`);
        setTimeout(() => { setDone(false); setStars(0); setComment(''); onClose(); }, 2000);
      } else if (res.status === 409) {
        toast.info('You have already rated this session.');
        onClose();
      } else {
        toast.error(data.message || 'Could not submit rating.');
      }
    } catch {
      toast.error('Connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-darkcard rounded-[3rem] p-10 w-full max-w-md shadow-2xl border border-gray-100 dark:border-darkborder relative"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <X size={18} />
            </button>

            {done ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-8">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white italic">Thank You!</h3>
                <p className="text-sm text-gray-500 mt-2">Your feedback helps the community.</p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white italic mb-1">Rate Your Session</h3>
                  <p className="text-xs text-gray-400 font-medium">
                    How was your experience with <strong>{name || 'your mentor'}</strong>?
                  </p>
                </div>

                {/* Star Picker */}
                <div className="flex justify-center gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setStars(s)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        size={36}
                        className={`transition-colors ${s <= displayed ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6 h-4">
                  {displayed ? LABELS[displayed] : ''}
                </p>

                {/* Comment */}
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Share what made this session valuable (optional)..."
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkbg text-sm text-gray-700 dark:text-gray-300 resize-none outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium mb-6"
                />

                <button
                  onClick={handleSubmit}
                  disabled={submitting || stars === 0}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  {submitting ? 'Submitting...' : 'Submit Rating'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
