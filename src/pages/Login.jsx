import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [portal, setPortal] = useState('youth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if they are logging into the right portal conceptually
      // Realistically the db knows who they are, but for security feel:
      if (portal === 'professional' && data.role === 'youth') {
        throw new Error("This account is not registered as a professional.");
      }
      if (portal === 'admin' && data.role !== 'admin') {
        throw new Error("This account lacks Administrator privileges.");
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-darkcard p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-darkborder"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo className="text-3xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
            Log in to continue your journey.
          </p>
        </div>

        {/* Portal Segmented Control */}
        <div className="flex bg-gray-100 dark:bg-darkbg p-1 rounded-xl mb-8">
          {['youth', 'professional', 'admin'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPortal(type)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-300 ${
                portal === type 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {type === 'professional' ? 'Mentor/Provider' : type}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
              placeholder={portal === 'admin' ? "admin@svasthya.com" : "you@example.com"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">Remember me</span>
            </label>
            <a href="#" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-70 disabled:hover:translate-y-0 text-lg ${
              portal === 'admin' ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/30' :
              portal === 'professional' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30' :
              'bg-primary-600 hover:bg-primary-500 shadow-primary-500/30'
            }`}
          >
            {loading ? 'Authenticating...' : `Log In to ${portal.charAt(0).toUpperCase() + portal.slice(1)} Portal`}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
            Register for access
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
