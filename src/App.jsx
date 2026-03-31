import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Link } from 'react-router-dom';
import { Moon, Sun, HeartPulse, User, LogOut, ChevronDown, ShieldCheck, BrainCircuit, Activity, Calendar as CalendarIcon, Menu, X } from 'lucide-react';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MentorDashboard from './pages/MentorDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import MilestoneActivity from './pages/MilestoneActivity';
import Onboarding from './pages/Onboarding';
import Notes from './pages/Notes';
import Community from './pages/Community';
import TherapistProfile from './pages/TherapistProfile';
import Donate from './pages/Donate';
import AdminDashboard from './pages/AdminDashboard';
import MindGames from './pages/MindGames';
import Profile from './pages/Profile';
import CalendarModule from './pages/CalendarModule';
import AssessmentPage from './pages/AssessmentPage';
import MenteeProgress from './pages/MenteeProgress';
import Logo from './components/Logo';
import Chatbot from './components/Chatbot';
import LanguageSelector from './components/LanguageSelector';

const UniversalDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role === 'mentor') return <MentorDashboard />;
  if (user.role === 'therapist') return <TherapistDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <Dashboard />;
};

export default function App() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wellbeingMenuOpen, setWellbeingMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Link to="/#why-it-matters" className="hover:text-primary-500 transition-colors">About</Link>
            <Link to="/#solutions" className="hover:text-primary-500 transition-colors">Solutions</Link>
            <Link to="/#impact" className="hover:text-primary-500 transition-colors">Impact</Link>
            
            {user && (
              <div className="relative" onMouseEnter={() => setWellbeingMenuOpen(true)} onMouseLeave={() => setWellbeingMenuOpen(false)}>
                <button className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold hover:opacity-80 transition-opacity">
                  My Journey <ChevronDown size={14} className={`transition-transform ${wellbeingMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {wellbeingMenuOpen && (
                    <motion.div 
                       initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}
                       className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-darkcard border border-gray-100 dark:border-darkborder rounded-2xl shadow-xl p-2 z-[100]"
                    >
                        <Link to="/calendar" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkbg transition-colors rounded-xl font-black italic">
                          <CalendarIcon size={16} className="text-primary-500" /> Real-time Planning
                        </Link>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkbg transition-colors rounded-xl">
                          <User size={16} className="text-gray-400" /> {t('nav.profile', 'Profile')}
                        </Link>
                        <Link to="/relax" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkbg transition-colors rounded-xl">
                          <BrainCircuit size={16} className="text-primary-500" /> {t('nav.relax', 'Zen Hub')}
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors font-bold rounded-xl">
                            <ShieldCheck size={16} /> {t('nav.admin', 'Mission Control')}
                          </Link>
                        )}
                        <hr className="my-1 border-gray-100 dark:border-gray-800" />
                        <Link to="/assessments" onClick={() => setWellbeingMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-all group">
                          <BrainCircuit size={16} className="text-emerald-500" />
                          <div className="text-left">
                            <p className="text-xs font-black uppercase">Psychometric Lab</p>
                            <p className="text-[9px] text-gray-400 font-bold">Clinical GAD-7 & PHQ-9</p>
                          </div>
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkbg transition-colors rounded-xl">
                          <Activity size={16} className="text-primary-500" /> Dashboard
                        </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Link to="/donate" className="text-primary-600 dark:text-primary-400 font-black hover:text-primary-500 transition-colors flex items-center gap-1.5 py-1 px-3 bg-primary-300/10 dark:bg-primary-900/20 rounded-full border border-primary-100 dark:border-primary-800/30">
               Support Us
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSelector />
            
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-darkborder/50 text-gray-600 dark:text-gray-300 transition-colors" aria-label="Toggle Dark Mode">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-darkbg hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full transition-all"
                >
                  <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 p-1.5 rounded-full">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-semibold hidden sm:block text-gray-800 dark:text-gray-200">
                    {user.name.split(' ')[0]} {/* First name only */}
                  </span>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-darkcard border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-darkbg">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1 mt-0.5">
                          {t('navbar.logged_in_as', 'Logged in as')} {user.role}
                        </p>
                      </div>
                      <div className="p-2 space-y-1">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-xl transition-colors"
                          >
                            <ShieldCheck size={16} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                        >
                          <LogOut size={16} /> {t('navbar.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-primary-500 font-medium text-sm transition-colors">
                  {t('navbar.login')}
                </Link>
                <Link to="/signup" className="hidden sm:block bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">
                  {t('hero.get_support')}
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-1" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 dark:border-darkborder bg-white dark:bg-darkcard overflow-hidden"
            >
              <div className="px-4 py-4 space-y-5 flex flex-col">
                <Link to="/#why-it-matters" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-bold hover:text-primary-500">About Svasthya</Link>
                <Link to="/#solutions" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-bold hover:text-primary-500">Solutions</Link>
                
                {user && (
                  <>
                    <hr className="border-gray-100 dark:border-darkborder" />
                    <span className="text-xs font-black text-gray-400 tracking-wider uppercase">Your Journey</span>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-bold hover:text-primary-500">Dashboard</Link>
                    <Link to="/calendar" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-bold hover:text-primary-500">Calendar & Events</Link>
                    <Link to="/relax" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-bold hover:text-primary-500">Zen Hub</Link>
                    <Link to="/assessments" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 font-bold hover:text-primary-500">Assessments</Link>
                  </>
                )}
                
                <hr className="border-gray-100 dark:border-darkborder" />
                <Link to="/donate" onClick={() => setMobileMenuOpen(false)} className="text-primary-600 font-bold">Support Our NGOs</Link>
                
                {!user && (
                  <div className="pt-2 flex flex-col gap-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 py-3 rounded-xl border border-gray-200 dark:border-gray-700">Login</Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center font-bold text-white bg-primary-600 hover:bg-primary-500 py-3 rounded-xl shadow-lg shadow-primary-500/20">Get Support / Sign up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/assessments" element={<AssessmentPage />} />
          <Route path="/mentor/mentees" element={<MenteeProgress />} />
          <Route path="/dashboard" element={<UniversalDashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/community" element={<Community />} />
          <Route path="/therapists/:id" element={<TherapistProfile />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/relax" element={<MindGames />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<CalendarModule />} />
          <Route path="/milestone/:type" element={<MilestoneActivity />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-darkcard border-t border-gray-100 dark:border-darkborder pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <HeartPulse className="text-primary-500 w-6 h-6" />
                <Logo className="text-lg" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t('footer.tagline', 'A digitally safe sanctuary for adolescent mental wellbeing, connecting youth to the resilience they need.')}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('footer.platform', 'Platform')}</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/#" className="hover:text-primary-500 transition-colors">{t('footer.about', 'About Us')}</Link></li>
                <li><Link to="/#" className="hover:text-primary-500 transition-colors">{t('footer.resources', 'Resources')}</Link></li>
                <li><Link to="/#" className="hover:text-primary-500 transition-colors">{t('footer.features', 'Features')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('footer.community', 'Community')}</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/#" className="hover:text-primary-500 transition-colors">{t('footer.ngos', 'Partner NGOs')}</Link></li>
                <li><Link to="/#" className="hover:text-primary-500 transition-colors">{t('footer.mentor', 'Become a Mentor')}</Link></li>
                <li><Link to="/#" className="hover:text-primary-500 transition-colors">{t('footer.forums', 'Support Forums')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('footer.legal', 'Legal')}</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/#" className="hover:text-primary-500 transition-colors">{t('footer.privacy', 'Privacy Policy')}</Link></li>
                <li><Link to="/#" className="hover:text-primary-500 transition-colors">{t('footer.terms', 'Terms of Service')}</Link></li>
                <li><Link to="/#" className="hover:text-primary-500 transition-colors">{t('footer.contact', 'Contact')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 dark:border-darkborder/50 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {t('footer.copyright', 'Svasthya Digital Wellbeing Platform. All rights reserved.')}
          </div>
        </div>
      </footer>

      <Chatbot />
      <Toaster position="top-center" richColors />
    </div>
  );
}
