import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight, Calendar } from 'lucide-react';

export default function InfoModal({ isOpen, onClose, title, description, phase = 3 }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-darkcard rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-darkborder"
        >
          {/* Header Image/Pattern */}
          <div className="h-32 bg-gradient-to-br from-primary-500 to-secondary-500 relative flex items-center justify-center">
            <Sparkles className="text-white/20 w-24 h-24 absolute" />
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/20">
               <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {title}
              </h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-darkbg rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg leading-relaxed">
              {description}
            </p>

            <div className="bg-gray-50 dark:bg-darkbg p-6 rounded-3xl border border-gray-100 dark:border-gray-800 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-primary-500" size={18} />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Target Launch: Phase {phase}</span>
              </div>
              <p className="text-sm text-gray-400 italic">
                Our team is working hard to bring this feature to life. We prioritize your privacy and safety, ensuring every tool is meticulously designed.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-full shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              Continue Exploring <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
