import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, Wind, Maximize2, MousePointer2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BreathingCircle from '../components/BreathingCircle';

const GameCard = ({ title, description, icon: Icon, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-6 rounded-[2.5rem] border-2 transition-all ${
      active 
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100 shadow-lg shadow-primary-500/10' 
        : 'border-gray-100 dark:border-darkborder hover:border-primary-300 bg-white dark:bg-darkcard'
    }`}
  >
    <div className={`p-3 rounded-2xl w-fit mb-4 ${active ? 'bg-primary-500 text-white' : 'bg-gray-50 dark:bg-darkbg text-gray-400'}`}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className={`text-sm ${active ? 'text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400'}`}>{description}</p>
  </button>
);

export default function MindGames() {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState('breath');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-10 font-bold text-sm tracking-wider uppercase"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        <div className="grid lg:grid-cols-4 gap-10">
          
          {/* Menu Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="mb-10">
               <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3 italic">
                  <Sparkles className="text-primary-600" /> Zen Hub
               </h1>
               <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-2 leading-relaxed">Relaxation mini-games to help you center yourself.</p>
            </div>

            <GameCard 
              title="Zen Breath" 
              description="Guided breathing meditation for instant calm." 
              icon={Wind} 
              active={activeGame === 'breath'}
              onClick={() => setActiveGame('breath')}
            />
            
            <GameCard 
              title="Focus Bloom" 
              description="Interactive growth ritual to sharp your focus." 
              icon={Sparkles} 
              active={activeGame === 'bloom'}
              onClick={() => setActiveGame('bloom')}
            />
          </div>

          {/* Main Area Column */}
          <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
                {activeGame === 'breath' && (
                  <motion.div 
                    key="breath" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}}
                    className="h-full flex flex-col items-center justify-center py-20"
                  >
                     <BreathingCircle />
                     <p className="mt-10 text-gray-400 font-bold italic text-sm">"Sync your soul with the rhythm of existence."</p>
                  </motion.div>
                )}

                {activeGame === 'bloom' && (
                  <motion.div 
                    key="bloom" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}}
                    className="h-full bg-white dark:bg-darkcard rounded-[3.5rem] border border-gray-100 dark:border-darkborder p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]"
                  >
                     <div className="absolute top-10 left-10 opacity-10">
                        <Maximize2 size={120} className="text-primary-500" />
                     </div>
                     <motion.div 
                        whileHover={{ scale: 2.5, rotate: 45 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="w-24 h-24 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-2xl shadow-2xl relative z-10 cursor-pointer"
                     />
                     <div className="mt-20 text-center">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 italic flex items-center justify-center gap-2">
                           <MousePointer2 size={24} className="text-primary-500" />
                           Interaction Mode
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm font-medium">Hover and "breathe" with the square. Let its growth reflect your expanding focus.</p>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

