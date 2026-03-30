import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Signup() {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: 'youth',
    licenseNumber: '', specialization: '', adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }));
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Helper for radio buttons
  const renderRoleOption = (value, label, activeColorClass, baseColorClass) => {
    const isSelected = formData.role === value;
    return (
      <div 
        onClick={() => setFormData({ ...formData, role: value })}
        className={`border rounded-xl py-3 px-2 cursor-pointer transition-all duration-200 text-center flex flex-col items-center justify-center
          ${isSelected ? `${activeColorClass} scale-[1.02] shadow-sm` : `${baseColorClass} opacity-70 hover:opacity-100`}`}
      >
        <span className="font-semibold text-xs sm:text-sm">{label}</span>
        {isSelected && (
           <motion.div layoutId="selection-ring" className="w-1.5 h-1.5 bg-current rounded-full mt-1" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-white dark:bg-darkcard p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-darkborder"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo className="text-3xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
            Join the safest digital community for youth wellbeing.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                placeholder="First and Last Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email" name="email" required value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input
              type="password" name="password" required value={formData.password} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">I am registering as a:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {renderRoleOption('youth', 'Youth', 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-1 ring-primary-500', 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400')}
              {renderRoleOption('mentor', 'Mentor', 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500', 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400')}
              {renderRoleOption('therapist', 'Therapist', 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500', 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400')}
              {renderRoleOption('admin', 'Admin', 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 ring-1 ring-purple-500', 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400')}
            </div>
          </div>

          {/* Conditional Role Fields */}
          <AnimatePresence>
            {(formData.role === 'therapist' || formData.role === 'mentor' || formData.role === 'admin') && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className="bg-gray-50 dark:bg-darkbg p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4"
              >
                {formData.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">System Security Code (Required)</label>
                    <input
                      type="password" name="adminCode" required value={formData.adminCode} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                      placeholder="Admin secret phrase"
                    />
                  </div>
                )}
                
                {formData.role === 'therapist' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Medical License Number (Required)</label>
                    <input
                      type="text" name="licenseNumber" required value={formData.licenseNumber} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                      placeholder="e.g. MH-12345678"
                    />
                  </div>
                )}

                {(formData.role === 'therapist' || formData.role === 'mentor') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Area of Specialization</label>
                    <input
                      type="text" name="specialization" value={formData.specialization} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                      placeholder={formData.role === 'therapist' ? "e.g. Cognitive Behavioral Therapy, Trauma" : "e.g. Academic Stress, Peer Pressure"}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 py-3.5 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 mt-4 disabled:opacity-70 disabled:hover:translate-y-0 text-lg"
          >
            {loading ? 'Creating Account...' : 'Finish Registration'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
            Log in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
