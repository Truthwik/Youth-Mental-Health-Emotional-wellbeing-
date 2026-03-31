import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, ChevronRight, ChevronLeft, ShieldCheck,
  AlertCircle, Sparkles, Brain, Zap, Users, LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// ── Question Banks ──────────────────────────────────────────────────────────
const INSTRUMENTS = {
  'GAD-7': {
    title: 'Anxiety Assessment',
    label: 'GAD-7',
    subtitle: 'Generalized Anxiety Disorder Scale',
    description: 'Measures how often anxiety, nervousness, and worry have affected you over the last 2 weeks.',
    icon: Brain,
    color: 'indigo',
    optionType: 'frequency', // Not at all → Nearly every day
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen'
    ]
  },
  'PHQ-9': {
    title: 'Depression Assessment',
    label: 'PHQ-9',
    subtitle: 'Patient Health Questionnaire',
    description: 'Screens for mood and interest patterns that indicate depression over the last 2 weeks.',
    icon: Sparkles,
    color: 'emerald',
    optionType: 'frequency',
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself or that you are a failure',
      'Trouble concentrating on things',
      'Moving or speaking unusually slowly — or being unusually restless',
      'Thoughts that you would be better off dead or of hurting yourself'
    ]
  },
  'RQ-10': {
    title: 'Resilience Quotient',
    label: 'RQ-10',
    subtitle: 'Svasthya Resilience Index',
    description: 'Measures your ability to adapt and recover from challenges. An original Svasthya wellness instrument.',
    icon: Zap,
    color: 'amber',
    optionType: 'agreement', // Never → Always (0-3 slider)
    questions: [
      'When something goes wrong, I find a way to work through it',
      'I believe setbacks make me stronger in the long run',
      'I have at least one person I can turn to when things get hard',
      'I am able to manage my emotions during stressful situations',
      'I find meaning in difficult experiences',
      'I can identify my own strengths and use them when I need to',
      'I feel confident in my ability to solve problems',
      'I bounce back quickly after disappointments',
      'I am able to stay hopeful even in tough times',
      'I regularly practice something that restores my energy (e.g. exercise, art, rest)'
    ]
  },
  'SCS-8': {
    title: 'Social Connectedness Scale',
    label: 'SCS-8',
    subtitle: 'Svasthya Belonging Index',
    description: 'Measures how seen, valued, and connected you feel in your world. An original Svasthya wellness instrument.',
    icon: Users,
    color: 'rose',
    optionType: 'likert', // 1-5 scale
    questions: [
      'I feel like I belong somewhere — at home, school, or with a group',
      'There are people in my life who truly understand me',
      'I feel comfortable asking for help when I need it',
      'I rarely feel invisible or overlooked by those around me',
      'I feel like my presence matters to at least one person',
      'I have people I enjoy spending time with regularly',
      'I feel safe being honest about how I feel with someone I trust',
      'Overall, I feel connected to the world around me'
    ]
  }
};

const FREQUENCY_OPTIONS = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 }
];

const AGREEMENT_OPTIONS = [
  { label: 'Never', value: 0 },
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Always', value: 3 }
];

const LIKERT_OPTIONS = [
  { label: 'Strongly Disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly Agree', value: 5 }
];

const COLOR_CLASSES = {
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600', border: 'border-indigo-200 dark:border-indigo-800', selected: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600', border: 'border-emerald-200 dark:border-emerald-800', selected: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600', border: 'border-amber-200 dark:border-amber-800', selected: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600', border: 'border-rose-200 dark:border-rose-800', selected: 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700' },
};

const SEVERITY_COLORS = {
  'None-Minimal': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  'Mild': 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  'Moderate': 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  'Moderately Severe': 'text-red-500 bg-red-50 dark:bg-red-900/20',
  'Severe': 'text-red-700 bg-red-100 dark:bg-red-900/30',
  'Fragile': 'text-red-500 bg-red-50 dark:bg-red-900/20',
  'Developing': 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  'Strong': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  'Champion': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  'Isolated': 'text-red-600 bg-red-50 dark:bg-red-900/20',
  'At-Risk': 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  'Connected': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  'Thriving': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
};

// ── Main Component ──────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [mode, setMode] = useState('home'); // 'home' | 'single' | 'comprehensive'
  const [activeType, setActiveType] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  // Comprehensive mode
  const COMP_SEQUENCE = ['GAD-7', 'PHQ-9', 'RQ-10', 'SCS-8'];
  const [compIndex, setCompIndex] = useState(0);
  const [compResults, setCompResults] = useState([]);
  const navigate = useNavigate();

  const instrument = activeType ? INSTRUMENTS[activeType] : null;
  const questions = instrument?.questions || [];
  const options = instrument?.optionType === 'likert' ? LIKERT_OPTIONS : instrument?.optionType === 'agreement' ? AGREEMENT_OPTIONS : FREQUENCY_OPTIONS;
  const colors = instrument ? COLOR_CLASSES[instrument.color] : COLOR_CLASSES.indigo;

  const startSingle = (type) => {
    setMode('single');
    setActiveType(type);
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  const startComprehensive = () => {
    setMode('comprehensive');
    setCompIndex(0);
    setActiveType(COMP_SEQUENCE[0]);
    setStep(0);
    setAnswers([]);
    setResult(null);
    setCompResults([]);
  };

  const handleSelect = (val) => {
    const newAnswers = [...answers];
    newAnswers[step] = val;
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 280);
    }
  };

  const submitAssessment = async (type, answersToSubmit) => {
    const token = localStorage.getItem('token');
    if (!token) { toast.error('Session expired. Please log in.'); return null; }

    const inst = INSTRUMENTS[type];
    const res = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, title: inst.title, answers: answersToSubmit })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Submission failed');
    return data;
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      if (mode === 'single') {
        const data = await submitAssessment(activeType, answers);
        setResult(data);
        toast.success('Assessment complete!');
      } else {
        // Comprehensive: submit current, then advance
        const data = await submitAssessment(activeType, answers);
        const newResults = [...compResults, data];
        setCompResults(newResults);

        if (compIndex < COMP_SEQUENCE.length - 1) {
          const nextIdx = compIndex + 1;
          setCompIndex(nextIdx);
          setActiveType(COMP_SEQUENCE[nextIdx]);
          setStep(0);
          setAnswers([]);
          toast.success(`${activeType} complete! Starting ${COMP_SEQUENCE[nextIdx]}...`);
        } else {
          // All done
          setResult({ comprehensive: true, results: newResults });
          toast.success('Full Wellness Report complete!');
        }
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Result Screen ───────────────────────────────────────────────────────
  if (result) {
    if (result.comprehensive) {
      return <ComprehensiveResult results={result.results} onBack={() => { setMode('home'); setResult(null); }} navigate={navigate} />;
    }
    return <SingleResult result={result} instrument={instrument} questions={questions} colors={colors} onBack={() => { setMode('home'); setResult(null); setActiveType(null); }} navigate={navigate} />;
  }

  // ── Home Screen ─────────────────────────────────────────────────────────
  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tight mb-3">
              Wellbeing Assessments
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Clinical & Svasthya-Original Psychometric Instruments
            </p>
          </div>

          {/* Comprehensive CTA */}
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={startComprehensive}
            className="w-full mb-10 p-8 rounded-[2.5rem] bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-left flex items-center justify-between shadow-2xl shadow-primary-500/20 relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LayoutGrid size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80">Recommended</span>
              </div>
              <h2 className="text-2xl font-black italic mb-1">Full Wellness Report</h2>
              <p className="text-sm opacity-75 font-medium">Complete all 4 assessments in one session. Get a comprehensive AI-powered insight letter.</p>
            </div>
            <ChevronRight size={32} className="shrink-0 opacity-60 group-hover:translate-x-1 transition-transform" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </motion.button>

          {/* Individual Instrument Cards */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Or choose individually</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.entries(INSTRUMENTS).map(([key, inst]) => {
              const Icon = inst.icon;
              const c = COLOR_CLASSES[inst.color];
              return (
                <motion.button
                  key={key}
                  whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                  onClick={() => startSingle(key)}
                  className="bg-white dark:bg-darkcard p-8 rounded-[2rem] border border-gray-100 dark:border-darkborder shadow-sm text-left flex flex-col gap-4 relative overflow-hidden group"
                >
                  <div className={`p-3 ${c.bg} ${c.text} rounded-xl w-fit`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{key}</p>
                    <h3 className="text-base font-black text-gray-900 dark:text-white italic leading-tight">{inst.title}</h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-2 leading-relaxed">{inst.description.split('.')[0]}.</p>
                  </div>
                  <div className={`flex items-center gap-1 text-[9px] font-black ${c.text} uppercase tracking-widest`}>
                    {inst.questions.length} questions <ChevronRight size={12} />
                  </div>
                  <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${c.bg} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                </motion.button>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-10 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30 rounded-3xl flex items-start gap-4">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-[10px] text-amber-800 dark:text-amber-200/60 font-semibold leading-relaxed">
              GAD-7 and PHQ-9 are validated clinical screening tools. RQ-10 and SCS-8 are original Svasthya Wellness Instruments inspired by established research. None of these replace a formal clinical diagnosis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Question Screen ─────────────────────────────────────────────────────
  const totalSteps = mode === 'comprehensive' 
    ? COMP_SEQUENCE.reduce((t, k) => t + INSTRUMENTS[k].questions.length, 0)
    : questions.length;
  const completedSteps = mode === 'comprehensive'
    ? COMP_SEQUENCE.slice(0, compIndex).reduce((t, k) => t + INSTRUMENTS[k].questions.length, 0) + step
    : step;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { setMode('home'); setActiveType(null); setResult(null); }}
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-primary-500 transition-all"
          >
            <ChevronLeft size={14} /> Exit
          </button>
          <div className="text-center">
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${colors.text}`}>{activeType}</p>
            {mode === 'comprehensive' && (
              <p className="text-[9px] text-gray-400 font-bold">Assessment {compIndex + 1} of {COMP_SEQUENCE.length}</p>
            )}
          </div>
          <span className="text-[10px] font-black text-gray-400 tabular-nums">
            {step + 1} / {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
          <motion.div
            className={`h-full bg-gradient-to-r from-primary-500 to-indigo-500`}
            animate={{ width: `${((completedSteps + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeType}-${step}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-darkcard rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-darkborder mb-8"
          >
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${colors.text} mb-4`}>
              {instrument?.subtitle}
            </p>
            <h2 className="text-xl font-black text-gray-900 dark:text-white italic leading-snug mb-10">
              {questions[step]}
            </h2>

            <div className={`grid gap-3 ${options.length === 5 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {options.map((opt) => {
                const isSelected = answers[step] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`p-4 rounded-2xl border-2 text-sm font-bold text-left transition-all duration-200 ${
                      isSelected ? colors.selected : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-darkbg text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className={`text-[9px] font-black block uppercase tracking-widest mb-0.5 ${isSelected ? '' : 'text-gray-300 dark:text-gray-600'}`}>
                      {instrument?.optionType === 'likert' ? opt.value : opt.value}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            className="p-4 text-gray-300 dark:text-gray-600 hover:text-primary-500 disabled:opacity-0 transition-all"
          >
            <ChevronLeft size={22} />
          </button>

          {step === questions.length - 1 && answers[step] !== undefined && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleFinish}
              disabled={submitting}
              className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-all uppercase tracking-widest text-[10px] disabled:opacity-60"
            >
              {submitting
                ? 'Generating Insight...'
                : mode === 'comprehensive' && compIndex < COMP_SEQUENCE.length - 1
                  ? `Next: ${COMP_SEQUENCE[compIndex + 1]} →`
                  : 'Finish & Get Insight'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Single Result Component ─────────────────────────────────────────────────
function SingleResult({ result, instrument, questions, colors, onBack, navigate }) {
  const Icon = instrument?.icon || ShieldCheck;
  const maxScore = questions.length * (instrument?.optionType === 'likert' ? 5 : 3);
  const pct = Math.round((result.totalScore / maxScore) * 100);
  const sevColor = SEVERITY_COLORS[result.severity] || 'text-primary-600 bg-primary-50';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white dark:bg-darkcard rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-darkborder mb-6">
          <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center mb-6`}>
            <Icon size={28} />
          </div>

          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{result.type} Result</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white italic mb-6">{result.title}</h2>

          {/* Score Bar */}
          <div className="bg-gray-50 dark:bg-darkbg rounded-2xl p-6 mb-6 border border-gray-100 dark:border-darkborder">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Clinical Score</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white italic">{result.totalScore}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-indigo-400"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sevColor}`}>
              {result.severity}
            </span>
          </div>

          {/* Clinical Interpretation */}
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6">
            {result.clinicalInterpretation}
          </p>

          {/* AI Insight */}
          {result.aiInsight && (
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/10 dark:to-indigo-900/10 border border-primary-100 dark:border-primary-900/20 rounded-3xl p-6 mb-6">
              <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Sparkles size={12} /> AI Insight Letter
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic font-medium">
                "{result.aiInsight}"
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 text-white font-black py-4 rounded-2xl hover:bg-primary-500 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-primary-500/20"
          >
            Dashboard
          </button>
          <button
            onClick={onBack}
            className="bg-white dark:bg-darkcard text-gray-700 dark:text-gray-300 font-black py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all uppercase text-[10px] tracking-widest border border-gray-100 dark:border-darkborder"
          >
            Try Another
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Comprehensive Report ────────────────────────────────────────────────────
function ComprehensiveResult({ results, onBack, navigate }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white italic mb-2">Full Wellness Report</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Your complete Svasthya wellbeing profile</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {results.map((r, i) => {
            const inst = INSTRUMENTS[r.type];
            const Icon = inst?.icon || ShieldCheck;
            const c = COLOR_CLASSES[inst?.color || 'indigo'];
            const sevColor = SEVERITY_COLORS[r.severity] || 'text-primary-600 bg-primary-50';

            return (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-darkcard rounded-[2rem] p-7 border border-gray-100 dark:border-darkborder shadow-sm"
              >
                <div className={`w-10 h-10 ${c.bg} ${c.text} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={18} />
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{r.type}</p>
                <h4 className="text-base font-black text-gray-900 dark:text-white italic mb-3">{r.title}</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${sevColor}`}>
                    {r.severity}
                  </span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white italic">{r.totalScore}</span>
                </div>
                {r.aiInsight && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed italic border-t border-gray-100 dark:border-gray-800 pt-3">
                    "{r.aiInsight.slice(0, 120)}..."
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-black py-4 rounded-2xl hover:opacity-90 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-primary-500/20"
          >
            View Dashboard
          </button>
          <button
            onClick={onBack}
            className="bg-white dark:bg-darkcard text-gray-700 dark:text-gray-300 font-black py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all uppercase text-[10px] tracking-widest border border-gray-100 dark:border-darkborder"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    </div>
  );
}
