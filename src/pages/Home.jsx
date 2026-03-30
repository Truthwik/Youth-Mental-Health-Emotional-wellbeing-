import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldX, ShieldCheck, Activity, LineChart, Users, ArrowRight, HeartPulse, UserPlus, Info, Smartphone, EyeOff } from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
        {/* 2. HERO SECTION */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-darkbg dark:to-darkcard">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400 text-sm font-medium mb-6">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-500"></span>
                  </span>
                  {t('hero.badge')}
                </div>
                <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                  {t('hero.title_part1')} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">{t('hero.title_wellbeing')}</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg leading-relaxed">
                  {t('hero.description')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2">
                    {t('hero.get_support')} <ArrowRight size={18} />
                  </button>
                  <button className="bg-white dark:bg-darkborder hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-3.5 rounded-full font-semibold outline outline-1 outline-gray-200 dark:outline-gray-600 shadow-sm transition-all transform hover:-translate-y-1">
                    {t('hero.become_volunteer')}
                  </button>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2} className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-secondary-200 dark:from-primary-900/40 dark:to-secondary-900/40 rounded-[3rem] transform rotate-3 scale-105 -z-10 blur-xl opacity-60"></div>
                <img src="/mainpage1.png" alt="Youth community support illustration" className="w-full h-auto drop-shadow-2xl rounded-3xl" />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 3. WHY THIS MATTERS (PROBLEM CONTEXT) */}
        <section id="why-it-matters" className="py-24 bg-white dark:bg-darkcard border-t border-gray-100 dark:border-darkborder/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('navbar.why_it_matters', 'Why This Matters')}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Young people today face mounting emotional stress from academic pressure, social expectations, and family dynamics. 
                Mental health stigma continues to be the biggest barrier. Many who need help do not seek it, simply because the environment does not feel safe enough.
              </p>
            </FadeIn>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FadeIn delay={0.1}>
                <div className="bg-primary-50 dark:bg-darkbg rounded-3xl p-8 text-center h-full hover:shadow-md transition-shadow">
                  <div className="text-5xl font-black text-primary-600 dark:text-primary-400 mb-4">50%</div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">of mental health conditions begin before age 14</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="bg-secondary-50 dark:bg-darkbg rounded-3xl p-8 text-center h-full hover:shadow-md transition-shadow">
                  <div className="text-5xl font-black text-secondary-600 dark:text-secondary-400 mb-4">90%</div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">of affected youth in low-income settings receive no mental health care</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="bg-blue-50 dark:bg-darkbg rounded-3xl p-8 text-center h-full hover:shadow-md transition-shadow">
                  <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-4">1 <span className="text-3xl">in</span> 7</div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">adolescents globally experience a mental health condition</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 4. WHAT ARE WE SOLVING? (CHALLENGES) */}
        <section className="py-24 bg-slate-50 dark:bg-darkbg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{t('home.challenges_title', 'What Challenges Are We Addressing?')}</h2>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: 'No Safe Spaces', desc: 'Many young people lack stigma-free environments where they can openly share emotional struggles. Fear of judgment prevents them from seeking support.', icon: <ShieldX /> },
                { title: 'Resource Inaccessibility', desc: 'Mental health awareness tools, counseling support, and early wellbeing resources are unavailable in many schools and communities.', icon: <Info /> },
                { title: 'Absence of Early Intervention', desc: 'Mental health issues often escalate because there are no systems to identify early warning signs or provide timely guidance.', icon: <Activity /> },
                { title: 'NGO Visibility Gap', desc: 'Organizations working to support youth lack structured data and insights needed to monitor youth wellbeing and measure intervention impact.', icon: <LineChart /> }
              ].map((card, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-white dark:bg-darkcard p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-darkborder/50">
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{card.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* 5. OUR SOLUTION */}
        <section id="solutions" className="py-24 bg-white dark:bg-darkcard">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="text-secondary-600 dark:text-secondary-400 font-semibold tracking-wider text-sm uppercase mb-3 block">{t('home.solution_tag', 'Our Solution')}</span>
                <h2 className="text-3xl md:text-4xl font-bold">{t('home.solution_title', 'What This Platform Delivers')}</h2>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Youth-Friendly Digital Tools', desc: 'Accessible digital tools for self-assessments, mood tracking, and guided activities.', icon: <Smartphone /> },
                { title: 'Peer Mentorship Networks', desc: 'Community-led support networks connecting youth with trained peer mentors.', icon: <Users /> },
                { title: 'Anonymous Help Channels', desc: 'Safe and confidential spaces to seek help without fear of stigma.', icon: <EyeOff /> },
                { title: 'NGO Wellbeing Dashboard', desc: 'Data-driven insights to track trends and identify areas requiring targeted support.', icon: <LineChart /> }
              ].map((feature, i) => (
                <FadeIn key={i} delay={i * 0.1} className="flex flex-col">
                  <div className="flex-1 bg-slate-50 dark:bg-darkbg p-8 rounded-3xl rounded-tr-[3rem] border border-gray-100 dark:border-darkborder/50 hover:-translate-y-2 transition-transform duration-300">
                    <div className="text-secondary-500 mb-6">{feature.icon}</div>
                    <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* 6. HOW IT WORKS (TIMELINE) */}
        <section id="how-it-works" className="py-24 bg-primary-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-800 rounded-full filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-900 rounded-full filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeIn className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">{t('navbar.how_it_works')}</h2>
              <p className="text-primary-200 mt-4 max-w-2xl mx-auto">{t('home.how_it_works_subtitle', 'A seamless journey to better mental health and supportive community.')}</p>
            </FadeIn>

            <div className="relative">
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-primary-800 -translate-y-1/2"></div>

              <div className="grid lg:grid-cols-5 gap-8">
                {[
                  { step: '01', title: 'Join Platform', desc: 'Youth join and access resources directly.' },
                  { step: '02', title: 'Daily Tools', desc: 'Use mood tracking & assessments.' },
                  { step: '03', title: 'Connect', desc: 'Meet peer mentors & communities.' },
                  { step: '04', title: 'Seek Help', desc: 'Use anonymous ask channels.' },
                  { step: '05', title: 'NGO Impact', desc: 'Organizations deploy interventions.' }
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.15} className="relative group">
                    <div className="bg-primary-800 lg:bg-primary-900 border-2 border-primary-700 w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto relative z-10 group-hover:bg-secondary-500 group-hover:border-secondary-500 transition-colors shadow-lg">
                      {item.step}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-primary-200 text-sm">{item.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. IMPACT */}
        <section id="impact" className="py-24 bg-white dark:bg-darkcard">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <FadeIn>
                <img src="/mainpage_impact.webp" alt="Support Ecosystem" className="w-full h-auto rounded-3xl shadow-xl" />
              </FadeIn>
              <FadeIn delay={0.2}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.impact_title', 'Creating a Support Ecosystem for Youth')}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                  {t('home.impact_desc', 'This platform is designed not just as an app, but as an ecosystem that connects youth, mentors, and organizations. By combining digital wellbeing tools, community support networks, and data insights, the platform helps create safer environments where young people can seek help early and build resilience.')}
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <UserPlus />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Youth</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center text-secondary-600 dark:text-secondary-400">
                      <HeartPulse />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Mentors</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <ShieldCheck />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">NGOs</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 8. CALL TO ACTION */}
        <section className="py-24 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-darkbg dark:to-primary-900/20 text-center border-t border-gray-100 dark:border-darkborder/50">
          <div className="max-w-4xl mx-auto px-4">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                {t('home.cta_title', 'Together We Can Build Safer Spaces for Youth')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
                {t('home.cta_subtitle', 'Join us in transforming how young people access mental health support.')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-full font-semibold outline-none focus:ring-4 ring-primary-500/30 transition-all">
                  Join the Community
                </button>
                <button className="bg-white dark:bg-darkcard hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white px-8 py-3.5 rounded-full font-semibold outline outline-1 outline-gray-200 dark:outline-gray-600 transition-all">
                  Partner With Us
                </button>
                <button className="bg-secondary-600 hover:bg-secondary-500 text-white px-8 py-3.5 rounded-full font-semibold outline-none focus:ring-4 ring-secondary-500/30 transition-all">
                  Volunteer as a Peer Mentor
                </button>
              </div>
            </FadeIn>
          </div>
        </section>
    </>
  );
}
