import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Wind, Brain, Users, ClipboardList } from 'lucide-react';

const icons = {
  breathing: <Wind size={20} />,
  meditation: <Brain size={20} />,
  talking_to_friend: <Users size={20} />,
  mood_check: <CheckCircle2 size={20} />,
  anxiety_test: <ClipboardList size={20} />
};

const labels = {
  breathing: "Breathing Exercise",
  meditation: "Mindful Meditation",
  talking_to_friend: "Talk to a Friend",
  mood_check: "Daily Mood Check",
  anxiety_test: "Anxiety Assessment"
};

export default function MilestoneTracker({ milestones, onSelect }) {
  const required = ['breathing', 'meditation', 'talking_to_friend', 'mood_check', 'anxiety_test'];
  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercentage = (completedCount / required.length) * 100;

  return (
    <div className="bg-white dark:bg-darkcard p-6 rounded-3xl border border-gray-100 dark:border-darkborder shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Wellness Journey</h3>
          <p className="text-sm text-gray-500">Complete milestones to unlock your mental health analysis.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-primary-600">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 dark:bg-darkbg h-3 rounded-full mb-8 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
        />
      </div>

      {/* Milestone List */}
      <div className="space-y-4">
        {required.map((id) => {
          const m = milestones.find(item => item.id === id);
          const isCompleted = m?.completed;

          return (
            <button
              key={id}
              onClick={() => !isCompleted && onSelect(id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                isCompleted 
                ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/30 opacity-70' 
                : 'bg-white dark:bg-darkcard border-gray-100 dark:border-darkborder hover:border-primary-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${isCompleted ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-darkbg text-gray-400'}`}>
                  {icons[id]}
                </div>
                <div className="text-left">
                  <p className={`font-bold text-sm ${isCompleted ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {labels[id]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isCompleted ? 'Completed' : 'Click to start activity'}
                  </p>
                </div>
              </div>
              <div>
                {isCompleted ? <CheckCircle2 size={24} className="text-primary-500" /> : <Circle size={24} className="text-gray-300" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
