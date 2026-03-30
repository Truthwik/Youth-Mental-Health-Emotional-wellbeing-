import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, Gamepad2, BrainCircuit, Activity, HeartHandshake, FileQuestion, BookOpen, Quote, Sun, Cloud, CloudRain, CloudLightning, Thermometer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MilestoneTracker from '../components/MilestoneTracker';
import AnalysisResult from '../components/AnalysisResult';
import NGOAnalytics from '../components/NGOAnalytics';
import InfoModal from '../components/InfoModal';
import WellbeingChart from '../components/WellbeingChart';
import { toast } from 'sonner';

const ModuleCard = ({ title, description, icon, isBeta, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className="group bg-white dark:bg-darkcard border border-gray-100 dark:border-darkborder p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary-100 dark:hover:border-primary-900/50 transition-all text-left flex flex-col relative overflow-hidden h-full"
  >
    <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 group-hover:bg-primary-100 transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">
      {description}
    </p>
    
    {isBeta && (
      <span className="absolute top-6 right-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
        Phase 3
      </span>
    )}
  </motion.button>
);

export default function Dashboard() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({ isOpen: false, title: '', description: '', phase: 3 });
  const [quote, setQuote] = useState({ text: 'The journey of a thousand miles begins with a single step.', author: 'Lao Tzu' });
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchData();
      fetchQuote();
      fetchWeather();
      
      // Welcome toast
      const isFirstLoad = !sessionStorage.getItem('dashboard_loaded');
      if (isFirstLoad) {
        const userName = storedUser ? JSON.parse(storedUser)?.name?.split(' ')[0] : 'Friend';
        toast(`Welcome back, ${userName || 'Friend'}!`, {
          description: "Your wellbeing journey continues today.",
        });
        sessionStorage.setItem('dashboard_loaded', 'true');
      }

      // Fetch fresh profile to get community tags from onboarding
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data) {
              const merged = { ...JSON.parse(storedUser), ...data };
              localStorage.setItem('user', JSON.stringify(merged));
              setUser(merged);
            }
          })
          .catch(() => {});
      }
    }
  }, [navigate]);

  const fetchQuote = async () => {
    try {
      // Using a proxy or direct if CORS allows, else fallback
      const res = await fetch('https://zenquotes.io/api/random');
      const data = await res.json();
      if (data && data[0]) {
        setQuote({ text: data[0].q, author: data[0].a });
      }
    } catch (err) {
      console.log("Quote fetch failed, using default.");
    }
  };

  const fetchWeather = async () => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        // Placeholder API key - User should replace with their own
        const API_KEY = 'd2d0f411cb2c0b7898ceb3f53a4025cc'; 
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
        const data = await res.json();
        if (res.ok) {
          setWeather(data);
        }
      } catch (err) {
        console.log("Weather fetch failed.");
      }
    });
  };

  const getWeatherTip = () => {
    if (!weather) return "Loading your environmental tip...";
    const main = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;

    if (main.includes('clear')) return "It's a clear day! Natural sunlight helps boost your mood and regulate your sleep cycle. Try a 5-minute walk.";
    if (main.includes('cloud')) return "It's a bit cloudy. Perfect weather for a cozy indoor meditation or some light stretching.";
    if (main.includes('rain')) return "Rainy day! The sound of rain is naturally grounding. Listen to the rhythm and focus on your breath.";
    if (temp < 15) return "It's a bit chilly. Staying warm can help reduce physical tension. Have a warm drink!";
    return "The environment is just right. Take a deep breath and enjoy the present moment.";
  };

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="w-6 h-6" />;
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('clear')) return <Sun className="text-orange-500" />;
    if (main.includes('cloud')) return <Cloud className="text-gray-400" />;
    if (main.includes('rain')) return <CloudRain className="text-blue-400" />;
    if (main.includes('storm')) return <CloudLightning className="text-purple-500" />;
    return <Thermometer className="text-primary-500" />;
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [mRes, aRes] = await Promise.all([
        fetch('http://localhost:5000/api/milestones', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/notes/analysis', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const mData = await mRes.json();
      const aData = await aRes.json();

      if (mRes.ok) setMilestones(mData);
      if (aRes.ok) setAnalysis(aData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Avoid flicker before redirect

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="bg-white dark:bg-darkcard p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-darkborder flex flex-col md:flex-row gap-8 items-center justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('dashboard.welcome', { name: user?.name?.split(' ')[0] || 'Friend' })}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg mb-4">
              {user.role === 'youth' 
                ? t('dashboard.subtitle_youth')
                : t('dashboard.subtitle_support', { role: user.role })}
            </p>
            {/* Community Tags */}
            {user.communityTags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.communityTags.slice(0, 3).map(tag => {
                  const labels = {
                    academic_stress: { emoji: '📚', text: 'Academic Stress' },
                    social_anxiety: { emoji: '💬', text: 'Social Confidence' },
                    family_conflict: { emoji: '🏠', text: 'Family Support' },
                    grief_loss: { emoji: '💗', text: 'Grief & Healing' },
                    identity_crisis: { emoji: '🌈', text: 'Identity & Purpose' },
                    substance_risk: { emoji: '🌿', text: 'Wellbeing & Recovery' },
                    self_harm_risk: { emoji: '🆘', text: 'Crisis Support' },
                    general_wellness: { emoji: '💚', text: 'General Wellness' },
                  };
                  const l = labels[tag] || { emoji: '💚', text: tag };
                  return (
                    <span key={tag} className="inline-flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-bold border border-primary-100 dark:border-primary-900/40">
                      {l.emoji} {l.text}
                    </span>
                  );
                })}
                {user.isCrisisRisk && (
                  <span className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-100 dark:border-red-900/40">
                    🆘 Priority Support Active
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="hidden md:flex bg-primary-50 dark:bg-primary-900/20 p-4 rounded-full border-4 border-white dark:border-darkcard shadow-lg shrink-0">
              <Activity className="w-12 h-12 text-primary-500" />
            </div>
            {user.role === 'youth' && (
              <div className="bg-gray-50 dark:bg-darkbg px-6 py-4 rounded-3xl border border-gray-100 dark:border-darkborder shadow-inner w-full md:w-64">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">{t('dashboard.wellbeing_level')}</span>
                  <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Level {user.level || 1}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.xp || 0) % 100}%` }}
                    className="bg-primary-500 h-full rounded-full shadow-[0_0_8px_rgba(var(--primary-500-rgb),0.5)]"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-bold text-right">{t('dashboard.next_level', { xp: (user.xp || 0) % 100 })}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Milestone Tracker & Analysis Section (Youth Only) */}
        {user.role === 'youth' ? (
          <>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <MilestoneTracker 
                milestones={milestones} 
                onSelect={(id) => navigate(`/milestone/${id}`)} 
              />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-darkcard border border-gray-100 dark:border-darkborder rounded-[3.5rem] p-8 sm:p-12 shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white italic">{t('dashboard.evolution_title')}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{t('dashboard.evolution_subtitle')}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary-500">
                      <div className="w-2 h-2 rounded-full bg-primary-500" /> {t('dashboard.resilience')}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400">
                      <div className="w-2 h-2 rounded-full bg-purple-400" /> {t('dashboard.balance')}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <WellbeingChart />
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-darkcard bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-[10px] font-bold text-primary-600">
                           {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-darkcard bg-gray-50 dark:bg-darkbg flex items-center justify-center text-[10px] font-bold text-gray-400">
                         +8
                      </div>
                   </div>
                   <p className="text-[10px] font-bold text-gray-500 italic">"You are doing better than 85% of peers in resilience!"</p>
                </div>
              </div>
            </div>
          </div>
          
          {analysis && (
            <div className="mt-8">
              <AnalysisResult analysis={analysis} />
            </div>
          )}
          </>
        ) : (
          <div className="bg-white dark:bg-darkcard p-8 sm:p-12 rounded-[3.5rem] border border-gray-100 dark:border-darkborder shadow-sm">
            <NGOAnalytics />
          </div>
        )}

        {/* Daily Insights Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-primary-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group"
          >
            <Quote className="absolute -top-4 -right-4 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform" />
            <div className="relative z-10">
              <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block backdrop-blur-sm">{t('dashboard.daily_inspiration')}</span>
              <p className="text-xl font-medium leading-relaxed mb-4 italic">"{quote.text}"</p>
              <p className="text-sm text-primary-100 font-bold">— {quote.author}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-white dark:bg-darkcard border border-gray-100 dark:border-darkborder rounded-[2.5rem] p-8 shadow-sm flex items-center gap-6"
          >
            <div className="bg-gray-50 dark:bg-darkbg p-4 rounded-3xl shrink-0">
              {getWeatherIcon()}
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 block">{t('dashboard.environmental_wellbeing')}</span>
              <p className="text-gray-900 dark:text-white font-bold leading-tight">
                {getWeatherTip()}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-2">{t('dashboard.wellbeing_tools')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard
              delay={0.1}
              icon={<FileQuestion size={28} />}
              title={t('tools.assessments.title')}
              description={t('tools.assessments.desc')}
              onClick={() => setModalData({ isOpen: true, title: 'In-Depth Assessments', description: 'Our comprehensive assessments go deeper into identifying patterns of anxiety and stress. This feature is entering security audits and will launch soon.', phase: 4 })}
            />
            <ModuleCard
              delay={0.2}
              icon={<Gamepad2 size={28} />}
              title={t('tools.games.title')}
              description={t('tools.games.desc')}
              onClick={() => setModalData({ isOpen: true, title: 'Mindfulness Games', description: 'We are building interactive WebGL games that help lower heart rate and focus the mind through rhythmic play.', phase: 4 })}
            />
            <ModuleCard
              delay={0.3}
              icon={<HeartHandshake size={28} />}
              title={t('tools.community.title')}
              description={t('tools.community.desc')}
              isBeta={true}
              onClick={() => setModalData({ isOpen: true, title: 'Encrypted Community', description: 'A safe, fully anonymous forum where empathy is the only currency. Launching for all verified students in Phase 3.', phase: 3 })}
            />
            <ModuleCard
              delay={0.4}
              icon={<Users size={28} />}
              title={t('tools.mentorship.title')}
              description={t('tools.mentorship.desc')}
              isBeta={true}
              onClick={() => setModalData({ isOpen: true, title: 'Certified Mentorship', description: 'Our mentorship matching system connects you with senior students and professional counselors for 1-on-1 support.', phase: 3 })}
            />
            <ModuleCard
              delay={0.5}
              icon={<BrainCircuit size={28} />}
              title={t('tools.chatbot.title')}
              description={t('tools.chatbot.desc')}
              onClick={() => window.dispatchEvent(new CustomEvent('svasthya-open-chat'))}
            />
            <ModuleCard
              delay={0.6}
              icon={<BookOpen size={28} />}
              title="📔 My Journal"
              description="Write daily notes and let AI analyse your mood, suggest coping tips, and recommend movies, books, songs, and more."
              onClick={() => navigate('/notes')}
            />
          </div>
        </div>

        <InfoModal 
          {...modalData} 
          onClose={() => setModalData({ ...modalData, isOpen: false })} 
        />

      </div>
    </div>
  );
}
