import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
import {
  BookOpen, Plus, Trash2, Sparkles, Loader2, Film, Music, MonitorPlay,
  Headphones, ChevronRight, Calendar, Hash, X, Save
} from 'lucide-react';

// ─── Mood config ──────────────────────────────────────────────────────────────
const MOOD_CONFIG = {
  Happy: { emoji: '😊', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  Hopeful: { emoji: '🌱', color: 'bg-green-100 text-green-700 border-green-200' },
  Grateful: { emoji: '🙏', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  Calm: { emoji: '😌', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  Confused: { emoji: '🤔', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  Anxious: { emoji: '😰', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  Overwhelmed: { emoji: '😵', color: 'bg-red-100 text-red-700 border-red-200' },
  Sad: { emoji: '😢', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  Lonely: { emoji: '🌧️', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  Angry: { emoji: '😤', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  Tired: { emoji: '😑', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  Jealous: { emoji: '😒', color: 'bg-rose-100 text-rose-700 border-rose-200' }
};

const MOOD_SCORE_COLORS = {
  high: 'from-green-400 to-emerald-500',
  mid: 'from-yellow-400 to-orange-400',
  low: 'from-red-400 to-rose-500',
};

function getMoodScoreColor(score) {
  if (score >= 7) return MOOD_SCORE_COLORS.high;
  if (score >= 4) return MOOD_SCORE_COLORS.mid;
  return MOOD_SCORE_COLORS.low;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Recommendation Tab Component ────────────────────────────────────────────
const REC_TABS = [
  { key: 'movies', icon: <Film size={15} />, label: 'Movies' },
  { key: 'books', icon: <BookOpen size={15} />, label: 'Books' },
  { key: 'songs', icon: <Music size={15} />, label: 'Songs' },
  { key: 'youtube', icon: <MonitorPlay size={15} />, label: 'YouTube' },
  { key: 'podcasts', icon: <Headphones size={15} />, label: 'Podcasts' },
];

function RecommendationCard({ item, type }) {
  const subtitle = item.author || item.artist || item.channel || null;
  const query = encodeURIComponent(`${item.title} ${subtitle || ''}`);
  const searchLink =
    type === 'youtube' ? `https://www.youtube.com/results?search_query=${query}` :
      type === 'songs' ? `https://open.spotify.com/search/${encodeURIComponent(item.title)}` :
        type === 'podcasts' ? `https://open.spotify.com/search/${query}` :
          `https://www.google.com/search?q=${query}`;

  return (
    <a
      href={searchLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-1.5 p-3 rounded-2xl border border-gray-100 dark:border-darkborder bg-gray-50 dark:bg-darkbg hover:border-primary-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{item.title}</p>
        <ChevronRight size={14} className="text-gray-400 group-hover:text-primary-500 shrink-0 mt-0.5 transition-colors" />
      </div>
      {subtitle && <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">{subtitle}</p>}
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.reason}</p>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('movies');
  const [polling, setPolling] = useState(null); // noteId being polled
  const textareaRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchNotes(); }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Poll for AI analysis completion
  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/notes/${polling}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.analysisComplete) {
          setNotes(prev => prev.map(n => n._id === polling ? data : n));
          setSelected(data);
          setPolling(null);
          clearInterval(interval);
        }
      } catch { clearInterval(interval); setPolling(null); }
    }, 3000);
    return () => clearInterval(interval);
  }, [polling, token]);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setNotes(data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content })
      });
      const note = await res.json();
      setNotes(prev => [note, ...prev]);
      setSelected(note);
      setComposing(false);
      setTitle(''); setContent('');
      // Start polling for AI analysis
      if (!note.analysisComplete) setPolling(note._id);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotes(prev => prev.filter(n => n._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const mood = selected?.mood ? MOOD_CONFIG[selected.mood] : null;
  const recommendations = selected?.recommendations || {};
  const activeRecs = recommendations[activeTab] || [];

  const chartData = [...notes]
    .filter(n => n.analysisComplete && n.moodScore)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-14)
    .map(n => ({
      date: new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: n.moodScore,
      mood: n.mood
    }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-6 h-full">

        {/* ── LEFT: Notes List ── */}
        <div className="lg:w-80 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary-500 w-5 h-5" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Journal</h1>
            </div>
            <button
              onClick={() => { setComposing(true); setSelected(null); }}
              className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white px-3 py-2 rounded-full text-xs font-bold transition-colors shadow-md shadow-primary-500/20"
            >
              <Plus size={14} /> New Entry
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
            {notes.length === 0 && !composing && (
              <div className="text-center py-16 text-gray-400">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No entries yet.<br />Write your first note!</p>
              </div>
            )}
            {notes.map(note => {
              const m = note.mood ? MOOD_CONFIG[note.mood] : null;
              return (
                <motion.button
                  key={note._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => { setSelected(note); setComposing(false); }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${selected?._id === note._id
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-100 dark:border-darkborder bg-white dark:bg-darkcard hover:border-primary-200 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {note.title || 'Untitled Entry'}
                    </p>
                    {m && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${m.color}`}>
                        {m.emoji} {note.mood}
                      </span>
                    )}
                    {!note.analysisComplete && (
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0">
                        <Loader2 size={11} className="animate-spin" /> Analyzing
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{note.content}</p>
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-400">
                    <Calendar size={11} />
                    {formatDate(note.createdAt)}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Editor or Note Detail ── */}
        <div className="flex-1 min-h-[600px]">
          <AnimatePresence mode="wait">

            {/* Compose */}
            {composing && (
              <motion.div
                key="compose"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-darkcard rounded-3xl border border-gray-100 dark:border-darkborder shadow-sm p-6 sm:p-8 h-full flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-primary-500" /> New Entry
                  </h2>
                  <button onClick={() => setComposing(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkbg">
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Give this entry a title (optional)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="How are you feeling today? Write freely — this is your safe space. The AI will read your entry and offer insights, coping tips, and content recommendations tailored just for you..."
                  className="flex-1 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none min-h-[300px] leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{content.trim().split(/\s+/).filter(Boolean).length} words</span>
                  <button
                    onClick={handleSave}
                    disabled={!content.trim() || saving}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md shadow-primary-500/20"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {saving ? 'Saving...' : 'Analyse & Save'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Note Detail */}
            {selected && !composing && (
              <motion.div
                key={selected._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-darkcard rounded-3xl border border-gray-100 dark:border-darkborder shadow-sm p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-120px)]"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selected.title || 'Untitled Entry'}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Calendar size={11} /> {formatDate(selected.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Note body */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {selected.content}
                </p>

                {/* Categories */}
                {selected.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selected.categories.map(cat => (
                      <span key={cat} className="flex items-center gap-1 text-[11px] font-bold bg-gray-100 dark:bg-darkbg text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">
                        <Hash size={10} /> {cat.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Analysis */}
                {!selected.analysisComplete ? (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/40">
                    <Loader2 size={20} className="text-primary-500 animate-spin shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-primary-700 dark:text-primary-400">AI is analysing your entry...</p>
                      <p className="text-xs text-primary-500 mt-0.5">Mood, insights, and recommendations will appear shortly.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Mood + Score */}
                    {mood && (
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkborder">
                        <div className="text-4xl">{mood.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold px-3 py-0.5 rounded-full border ${mood.color}`}>{selected.mood}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Insight */}
                    {selected.aiInsight && (
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/10 border border-primary-100 dark:border-primary-900/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={16} className="text-primary-500" />
                          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">AI Insight</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">"{selected.aiInsight}"</p>
                      </div>
                    )}

                    {/* Suggestions */}
                    {selected.suggestions?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">💡 Coping Suggestions</h3>
                        <div className="space-y-2">
                          {selected.suggestions.map((s, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-darkbg border border-gray-100 dark:border-darkborder">
                              <span className="text-primary-500 font-black text-sm shrink-0">{i + 1}.</span>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {Object.keys(recommendations).some(k => recommendations[k]?.length > 0) && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">🎯 Curated For You</h3>
                        {/* Tabs */}
                        <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-darkbg p-1 rounded-xl overflow-x-auto">
                          {REC_TABS.filter(tab => (recommendations[tab.key]?.length || 0) > 0).map(tab => (
                            <button
                              key={tab.key}
                              onClick={() => setActiveTab(tab.key)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.key
                                  ? 'bg-white dark:bg-darkcard text-primary-600 dark:text-primary-400 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                              {tab.icon} {tab.label}
                            </button>
                          ))}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {activeRecs.map((item, i) => (
                            <RecommendationCard key={i} item={item} type={activeTab} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Empty state or Chart */}
            {!composing && !selected && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full min-h-[500px]"
              >
                {notes.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-9 h-9 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Your journal is empty</h3>
                      <p className="text-sm text-gray-400 mb-6">Write freely — the AI will analyse your mood and suggest movies, books, songs and more.</p>
                      <button
                        onClick={() => setComposing(true)}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md shadow-primary-500/20 flex items-center gap-2 mx-auto"
                      >
                        <Plus size={16} /> Write First Entry
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-darkcard rounded-3xl border border-gray-100 dark:border-darkborder shadow-sm p-6 sm:p-8 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                       <div>
                         <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                           <Sparkles size={24} className="text-primary-500" /> Emotional Landscape
                         </h2>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Your recent mood journey</p>
                       </div>
                    </div>
                    
                    {chartData.length > 0 ? (
                      <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                            <Tooltip
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 700 }}
                              labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                              formatter={(value, name, props) => {
                                const m = MOOD_CONFIG[props.payload.mood];
                                return [value + '/10 ' + (m ? m.emoji : ''), 'Mood ' + props.payload.mood];
                              }}
                            />
                            <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                         Write more entries to generate your visual journey!
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
