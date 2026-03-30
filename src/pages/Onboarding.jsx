import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, HeartPulse, Phone, AlertTriangle } from 'lucide-react';

// ─── Question Definitions ────────────────────────────────────────────────────

const YOUTH_QUESTIONS = [
  {
    id: 'q1',
    type: 'multi',
    question: "What are you going through right now? (Select all that apply)",
    subtitle: "This helps us match you with the right peer community. There are no wrong answers.",
    options: [
      { label: "Exam / academic pressure", value: "exam_pressure" },
      { label: "Social isolation or loneliness", value: "isolation" },
      { label: "Peer pressure or bullying", value: "peer_pressure" },
      { label: "Family conflict at home", value: "family" },
      { label: "Grief or loss of someone close", value: "grief" },
      { label: "Confusion about my identity or future", value: "identity" },
      { label: "Substance use (mine or someone else's)", value: "substance" },
      { label: "Thoughts of hurting myself", value: "self_harm" },
      { label: "Just looking to improve my mental health", value: "general" },
    ],
  },
  {
    id: 'q2',
    type: 'scale',
    question: "How often do you feel overwhelmed in a typical week?",
    subtitle: "Be honest — this is a safe space.",
    options: [
      { label: "Rarely (1–2 days)", value: "rarely" },
      { label: "Sometimes (3–4 days)", value: "sometimes" },
      { label: "Very often (5–6 days)", value: "often" },
      { label: "Every single day", value: "every_day" },
    ],
  },
  {
    id: 'q3',
    type: 'single',
    question: "Where does most of your stress come from?",
    subtitle: "Pick the biggest source right now.",
    options: [
      { label: "🏫 School / College", value: "school" },
      { label: "🏠 Home / Family", value: "home" },
      { label: "👥 Friends / Social life", value: "social" },
      { label: "💭 My own thoughts", value: "thoughts" },
      { label: "📱 Social media", value: "social_media" },
      { label: "💸 Financial pressure", value: "financial" },
    ],
  },
  {
    id: 'q4',
    type: 'single',
    question: "Have you been able to talk to anyone about how you're feeling?",
    subtitle: "No judgment — many people haven't.",
    options: [
      { label: "Yes, I have a trusted person", value: "yes_trusted" },
      { label: "A little bit, but not fully", value: "partial" },
      { label: "No, I keep it to myself", value: "no" },
      { label: "I don't feel safe talking to anyone", value: "unsafe" },
    ],
  },
  {
    id: 'q5',
    type: 'single',
    question: "What kind of support would help you the most?",
    subtitle: "We'll personalise your dashboard based on this.",
    options: [
      { label: "🤝 Peer community (people like me)", value: "peer_community" },
      { label: "🧠 AI companion / journaling", value: "ai_support" },
      { label: "🎯 Structured activities & exercises", value: "activities" },
      { label: "👨‍⚕️ Professional therapist guidance", value: "therapist" },
      { label: "📚 Learning resources & self-help", value: "resources" },
    ],
  },
];

const MENTOR_QUESTIONS = [
  {
    id: 'q1',
    type: 'single',
    question: "What personal challenge have you successfully navigated?",
    subtitle: "Your lived experience is your superpower as a mentor.",
    options: [
      { label: "🏆 Academic burnout / failure", value: "academic_recovery" },
      { label: "👥 Social isolation / confidence", value: "social_rebuilding" },
      { label: "🏠 Difficult family environment", value: "family_survivor" },
      { label: "💔 Grief and loss", value: "grief_navigator" },
      { label: "🌈 Identity struggles", value: "identity_journey" },
      { label: "🚫 Substance use recovery", value: "substance_recovery" },
    ],
  },
  {
    id: 'q2',
    type: 'single',
    question: "How long ago did your recovery or transformation begin?",
    subtitle: "This helps us understand your perspective.",
    options: [
      { label: "Less than 1 year ago", value: "recent" },
      { label: "1–3 years ago", value: "1_3_years" },
      { label: "3–5 years ago", value: "3_5_years" },
      { label: "More than 5 years ago", value: "5_plus" },
    ],
  },
  {
    id: 'q3',
    type: 'single',
    question: "What age group are you most comfortable supporting?",
    subtitle: "We'll match you with youth in your preferred range.",
    options: [
      { label: "12–15 (early teens)", value: "12_15" },
      { label: "15–18 (mid-teens)", value: "15_18" },
      { label: "18–22 (young adults)", value: "18_22" },
      { label: "Any age, I'm flexible", value: "any" },
    ],
  },
  {
    id: 'q4',
    type: 'single',
    question: "What mentoring style fits you best?",
    subtitle: "Every mentor is different — that's a strength.",
    options: [
      { label: "🎧 Active listener", value: "listener" },
      { label: "📋 Goal-setter and planner", value: "planner" },
      { label: "💬 Encouraging cheerleader", value: "encourager" },
      { label: "📖 Sharing my personal story", value: "storyteller" },
    ],
  },
  {
    id: 'q5',
    type: 'single',
    question: "How many hours per week can you dedicate to mentoring?",
    subtitle: "Be realistic — consistency matters more than volume.",
    options: [
      { label: "1–2 hours/week", value: "1_2h" },
      { label: "3–5 hours/week", value: "3_5h" },
      { label: "5–10 hours/week", value: "5_10h" },
      { label: "10+ hours/week", value: "10h_plus" },
    ],
  },
];

const THERAPIST_QUESTIONS = [
  {
    id: 'q1',
    type: 'single',
    question: "What is your primary clinical specialization?",
    subtitle: "This will be shown to youth seeking professional help.",
    options: [
      { label: "🧠 Cognitive Behavioral Therapy (CBT) / Trauma", value: "cbt_trauma" },
      { label: "👨‍👩‍👧 Family Systems Therapy", value: "family_therapy" },
      { label: "💔 Grief and Bereavement Counseling", value: "grief_counseling" },
      { label: "🚫 Addiction and Substance Counseling", value: "addiction_counseling" },
      { label: "🧒 General Adolescent Psychology", value: "adolescent_psychology" },
      { label: "🆘 Crisis Intervention", value: "crisis_intervention" },
    ],
  },
  {
    id: 'q2',
    type: 'single',
    question: "How many years have you worked with adolescents?",
    subtitle: "",
    options: [
      { label: "Less than 1 year", value: "less_1" },
      { label: "1–3 years", value: "1_3" },
      { label: "3–7 years", value: "3_7" },
      { label: "7+ years", value: "7_plus" },
    ],
  },
  {
    id: 'q3',
    type: 'single',
    question: "What is your preferred session format?",
    subtitle: "",
    options: [
      { label: "💻 Video call only", value: "video" },
      { label: "📞 Audio call only", value: "audio" },
      { label: "💬 Text / chat only", value: "text" },
      { label: "🔀 Flexible (any format)", value: "flexible" },
    ],
  },
  {
    id: 'q4',
    type: 'multi',
    question: "Which languages can you conduct sessions in?",
    subtitle: "Select all that apply.",
    options: [
      { label: "English", value: "english" },
      { label: "Telugu", value: "telugu" },
      { label: "Hindi", value: "hindi" },
      { label: "Tamil", value: "tamil" },
      { label: "Kannada", value: "kannada" },
      { label: "Other regional language", value: "other" },
    ],
  },
  {
    id: 'q5',
    type: 'single',
    question: "Are you certified in crisis or suicide intervention?",
    subtitle: "Certified therapists will be prioritised for high-risk youth cases.",
    options: [
      { label: "✅ Yes, I am certified", value: "yes" },
      { label: "🔄 Training in progress", value: "in_progress" },
      { label: "❌ Not yet", value: "no" },
    ],
  },
];

const COMMUNITY_LABELS = {
  academic_stress: { label: "Academic Stress Community", color: "bg-blue-100 text-blue-700", emoji: "📚" },
  social_anxiety: { label: "Social Confidence Community", color: "bg-purple-100 text-purple-700", emoji: "💬" },
  family_conflict: { label: "Family Support Community", color: "bg-orange-100 text-orange-700", emoji: "🏠" },
  grief_loss: { label: "Grief & Healing Community", color: "bg-pink-100 text-pink-700", emoji: "💗" },
  identity_crisis: { label: "Identity & Purpose Community", color: "bg-yellow-100 text-yellow-700", emoji: "🌈" },
  substance_risk: { label: "Wellbeing & Recovery Community", color: "bg-teal-100 text-teal-700", emoji: "🌿" },
  self_harm_risk: { label: "Crisis Support (Private)", color: "bg-red-100 text-red-700", emoji: "🆘" },
  general_wellness: { label: "General Wellness Community", color: "bg-green-100 text-green-700", emoji: "💚" },
};

// ─── Reusable Option Components ──────────────────────────────────────────────

function OptionCard({ option, selected, onClick, multi }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 font-medium text-sm ${
        selected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-md shadow-primary-500/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-darkbg text-gray-700 dark:text-gray-300 hover:border-primary-300 hover:bg-primary-50/40'
      }`}
    >
      <div className={`w-5 h-5 rounded-${multi ? 'md' : 'full'} border-2 flex items-center justify-center shrink-0 transition-all ${
        selected ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-600'
      }`}>
        {selected && <div className={`${multi ? 'w-2.5 h-2' : 'w-2 h-2 rounded-full'} bg-white`} />}
      </div>
      <span>{option.label}</span>
    </button>
  );
}

// ─── Crisis Banner ───────────────────────────────────────────────────────────

function CrisisBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-6 mb-6"
    >
      <div className="flex items-start gap-4">
        <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-2xl">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-red-800 dark:text-red-300 font-bold text-lg mb-1">You are not alone</h3>
          <p className="text-red-700 dark:text-red-400 text-sm leading-relaxed mb-4">
            It takes real courage to share what you're going through. We're connecting you directly with a professional support path, and a trained therapist will be available for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:9152987821"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
            >
              <Phone size={16} /> iCall India: 9152987821
            </a>
            <a
              href="tel:1800599019"
              className="flex items-center gap-2 bg-white dark:bg-darkcard border border-red-300 text-red-700 dark:text-red-400 px-5 py-2.5 rounded-full text-sm font-bold transition-colors hover:bg-red-50"
            >
              <Phone size={16} /> Vandrevala: 1800-599-0019
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const role = storedUser.role || 'youth';

  const questions =
    role === 'mentor' ? MENTOR_QUESTIONS :
    role === 'therapist' ? THERAPIST_QUESTIONS :
    YOUTH_QUESTIONS;

  const [step, setStep] = useState(0); // 0 = intro, 1..N = questions, N+1 = result
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);

  const totalSteps = questions.length;
  const isIntro = step === 0;
  const isResult = step === totalSteps + 1;
  const currentQ = questions[step - 1];

  const handleSelect = (qId, value, multi) => {
    if (multi) {
      const prev = answers[qId] || [];
      const updated = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
      setAnswers({ ...answers, [qId]: updated });
    } else {
      setAnswers({ ...answers, [qId]: value });
    }
  };

  const canProceed = () => {
    if (isIntro) return true;
    const ans = answers[currentQ?.id];
    return Array.isArray(ans) ? ans.length > 0 : !!ans;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setIsCrisis(data.isCrisisRisk || false);
        setStep(totalSteps + 1);
      }
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (step === totalSteps) {
      handleSubmit();
    } else {
      setStep(s => s + 1);
    }
  };

  const progress = isResult ? 100 : Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-darkbg dark:via-darkcard dark:to-darkbg flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">

        {/* Header */}
        {!isResult && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <HeartPulse className="text-primary-500 w-6 h-6" />
              <span className="text-primary-600 dark:text-primary-400 font-bold text-sm uppercase tracking-wider">Svasthya Onboarding</span>
            </div>
            {!isIntro && (
              <>
                <p className="text-xs text-gray-500 mb-2 font-medium">Step {step} of {totalSteps}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-darkcard rounded-3xl shadow-xl border border-gray-100 dark:border-darkborder p-8 sm:p-10"
        >

          {/* ── INTRO ── */}
          {isIntro && (
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartPulse className="w-10 h-10 text-primary-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Welcome, {storedUser.name?.split(' ')[0] || 'Friend'} 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8 max-w-md mx-auto">
                {role === 'youth'
                  ? "We have a few quick questions to understand what you're going through and connect you to the right community and support. This will take about 2 minutes."
                  : role === 'mentor'
                  ? "We'd love to understand your journey so we can match you with the youth who'll benefit most from your experience."
                  : "Tell us about your clinical background so we can connect you with youth who need your expertise."}
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 mb-8">
                <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-darkbg px-4 py-2 rounded-full border border-gray-100 dark:border-darkborder">🔒 Completely private</span>
                <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-darkbg px-4 py-2 rounded-full border border-gray-100 dark:border-darkborder">⏱ ~2 minutes</span>
                <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-darkbg px-4 py-2 rounded-full border border-gray-100 dark:border-darkborder">✏️ {totalSteps} questions</span>
              </div>
            </div>
          )}

          {/* ── QUESTION ── */}
          {!isIntro && !isResult && currentQ && (
            <div>
              {/* Check if self-harm is selected */}
              {role === 'youth' && (answers.q1 || []).includes('self_harm') && <CrisisBanner />}

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentQ.question}</h2>
              {currentQ.subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{currentQ.subtitle}</p>}

              <div className="space-y-3">
                {currentQ.options.map(opt => {
                  const isMulti = currentQ.type === 'multi';
                  const selected = isMulti
                    ? (answers[currentQ.id] || []).includes(opt.value)
                    : answers[currentQ.id] === opt.value;
                  return (
                    <OptionCard
                      key={opt.value}
                      option={opt}
                      selected={selected}
                      multi={isMulti}
                      onClick={() => handleSelect(currentQ.id, opt.value, isMulti)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {isResult && result && (
            <div className="text-center">
              {isCrisis ? (
                <>
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">We're here with you</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                    Your safety matters most. We've flagged your profile for priority therapist support. In the meantime, please reach out to a crisis helpline.
                  </p>
                  <CrisisBanner />
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're all set! 🎉</h2>
                  {role === 'youth' && result.communityTags?.length > 0 && (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">We've matched you with these communities:</p>
                      <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {result.communityTags.slice(0, 4).map(tag => {
                          const comm = COMMUNITY_LABELS[tag] || { label: tag, color: 'bg-gray-100 text-gray-700', emoji: '💚' };
                          return (
                            <span key={tag} className={`${comm.color} px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2`}>
                              {comm.emoji} {comm.label}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {role !== 'youth' && (
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Your profile is set up. Head to your dashboard to get started.</p>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── Navigation ── */}
          <div className={`flex mt-8 ${step > 0 && !isResult ? 'justify-between' : 'justify-center'}`}>
            {step > 0 && !isResult && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darkbg font-medium text-sm transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}

            {!isResult ? (
              <button
                onClick={next}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary-500/20 transition-all"
              >
                {loading ? 'Saving...' : step === totalSteps ? 'Finish & See My Communities' : 'Continue'}
                {!loading && <ArrowRight size={16} />}
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-10 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary-500/20 transition-all"
              >
                Go to My Dashboard <ArrowRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
