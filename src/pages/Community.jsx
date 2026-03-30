import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, ShieldCheck, MessageSquare, Send, 
  Award, Heart, Calendar, Clock, Star, MapPin 
} from 'lucide-react';

export default function Community() {
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' | 'therapists'
  const [groups, setGroups] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  
  const token = localStorage.getItem('token');
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('user'));
  } catch(e) {}

  useEffect(() => {
    fetchGroups();
    fetchTherapists();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchPosts(selectedGroup._id);
      // Optional: Set up an interval or just rely on manual refresh for MVP
      const interval = setInterval(() => fetchPosts(selectedGroup._id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/community/groups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setGroups(data);
      if (data.length > 0 && !selectedGroup) {
        setSelectedGroup(data[0]);
      }
    } catch (err) { console.error('Failed to fetch groups', err); }
  };

  const fetchTherapists = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/community/therapists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const verified = data.filter(d => d.role === 'therapist' || d.__t === 'therapist');
      setTherapists(verified);
    } catch (err) { console.error('Failed to fetch therapists', err); }
  };

  const fetchPosts = async (groupId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/groups/${groupId}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPosts(data.reverse()); // Show older at top to bottom (like chat)
    } catch (err) { console.error('Failed to fetch posts', err); }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !selectedGroup) return;
    setPosting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/community/groups/${selectedGroup._id}/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ content: newPost })
      });
      const post = await res.json();
      setPosts(prev => [...prev, post]);
      setNewPost('');
    } catch (err) { console.error('Failed to create post', err); }
    finally { setPosting(false); }
  };

  const chatContainerRef = useRef(null);
  const prevPostsLength = useRef(0);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => { 
    if (posts.length !== prevPostsLength.current) {
      scrollToBottom(); 
      prevPostsLength.current = posts.length;
    }
  }, [posts]);

  // View: Support Groups Feed
  const renderGroups = () => (
    <div className="flex flex-col md:flex-row h-[750px] bg-white dark:bg-darkcard rounded-3xl border border-gray-100 dark:border-darkborder shadow-sm overflow-hidden text-left">
      {/* Sidebar: Group List */}
      <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-darkborder bg-gray-50 dark:bg-darkbg flex flex-col">
        <div className="p-6 pb-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">My Forums</h2>
          <p className="text-gray-900 dark:text-white font-bold text-lg">Support Groups</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {groups.map(group => (
            <button
              key={group._id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full text-left p-4 rounded-2xl transition-all ${
                selectedGroup?._id === group._id 
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                : 'bg-white dark:bg-darkcard text-gray-900 dark:text-gray-100 hover:border-primary-200 border border-gray-100 dark:border-darkborder hover:shadow-sm'
              }`}
            >
              <h3 className="font-bold mb-1 line-clamp-1">{group.name}</h3>
              <p className={`text-xs ${selectedGroup?._id === group._id ? 'text-primary-100' : 'text-gray-400'} flex items-center gap-1`}>
                <Hash size={12} /> {group.topic}
              </p>
            </button>
          ))}
          {groups.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No groups found.</p>
          )}
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 flex flex-col bg-white dark:bg-darkcard">
        {selectedGroup ? (
          <>
            {/* Header info about the group & admin */}
            <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-darkborder flex items-center justify-between bg-white dark:bg-darkcard z-10 sticky top-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={20} className="text-primary-500" />
                  {selectedGroup.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Shared safe space for individuals facing similar challenges.</p>
              </div>
              {selectedGroup.adminId && (
                <div className="hidden sm:flex items-center gap-3 bg-gray-50 dark:bg-darkbg p-2 rounded-xl border border-gray-100 dark:border-darkborder">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                    {selectedGroup.adminId.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      {selectedGroup.adminId.name} <ShieldCheck size={14} className="text-blue-500" />
                    </p>
                    <p className="text-xs text-gray-500 font-medium capitalize flex items-center gap-1">
                       Group Admin
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Posts Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 dark:bg-transparent relative scroll-smooth">
              {posts.length === 0 && (
                 <div className="flex flex-col items-center justify-center text-center h-full opacity-50">
                    <MessageSquare size={48} className="text-gray-400 mb-4" />
                    <p className="text-gray-500 text-sm">No one has shared yet. Break the ice and share how you feel safely.</p>
                 </div>
              )}
              {posts.map(post => {
                const isMine = post.authorId?._id === currentUser?.id;
                const isTherapist = post.authorId?.role === 'therapist' || post.authorId?.role === 'mentor';
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={post._id} 
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className={`text-[11px] font-bold ${isTherapist ? 'text-blue-600 dark:text-blue-400 flex items-center gap-1' : 'text-gray-500 dark:text-gray-400'}`}>
                        {isTherapist && <ShieldCheck size={10} />}
                        {isTherapist ? post.authorId.name : (isMine ? "You" : "Youth Member")}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl ${
                      isTherapist 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-blue-800 rounded-tl-sm' 
                        : isMine 
                          ? 'bg-primary-600 text-white rounded-tr-sm shadow-md shadow-primary-500/10' 
                          : 'bg-white dark:bg-darkcard text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-darkborder rounded-tl-sm shadow-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Compose Area */}
            <div className="p-4 bg-white dark:bg-darkcard border-t border-gray-100 dark:border-darkborder">
              <form onSubmit={handlePost} className="flex items-end gap-2 bg-gray-50 dark:bg-darkbg p-2 rounded-2xl border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder="Share a problem, thought, or feeling anonymously..."
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm p-3 resize-none max-h-32 text-gray-900 dark:text-white"
                  rows="2"
                  onKeyDown={(e) => { 
                    if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePost(e); }
                  }}
                />
                <button 
                  type="submit" 
                  disabled={!newPost.trim() || posting}
                  className="w-10 h-10 shrink-0 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors mb-0.5 mr-0.5"
                >
                  <Send size={16} className={newPost.trim() && !posting ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                </button>
              </form>
              <p className="text-[10px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck size={10} /> This space is moderated by verified professionals. Be kind.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <Users size={64} className="opacity-20 mb-4 text-primary-500" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Select a Group</h3>
            <p className="text-sm max-w-sm mx-auto">Join a discussion anonymously with others who understand what you're going through.</p>
          </div>
        )}
      </div>
    </div>
  );

  // View: Verified Therapist Directory
  const renderTherapists = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {therapists.map(t => (
        <motion.div 
          key={t._id} 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-darkcard rounded-3xl border border-gray-100 dark:border-darkborder shadow-sm hover:shadow-xl hover:border-primary-200 transition-all p-6 text-left flex flex-col"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/40 dark:to-indigo-900/30 text-primary-600 dark:text-primary-300 rounded-2xl flex items-center justify-center text-2xl font-black border border-white/50 dark:border-gray-800 shadow-inner">
              {t.name.charAt(0)}
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 px-2 py-1 rounded-lg text-xs font-bold border border-yellow-100 dark:border-yellow-900/30">
              <Star size={12} fill="currentColor" /> {t.rating || 4.8}
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-1">
            {t.name} <ShieldCheck size={16} className="text-blue-500" />
          </h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-4">{t.clinicalSpecialization || t.specialization || 'Clinical Psychologist'}</p>
          
          <div className="space-y-2 mb-6 flex-1">
            {t.yearsExperience && (
              <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock size={12} className="text-gray-400" /> {t.yearsExperience} Experience
              </p>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Award size={12} className="text-gray-400" /> License: {t.licenseNumber}
            </p>
            {t.sessionLanguages?.length > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Users size={12} className="text-gray-400" /> {t.sessionLanguages.join(', ')}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
             {t.badges?.map((b, i) => (
                <span key={i} className="text-[10px] font-bold bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-md border border-primary-100 dark:border-primary-900/30">
                  {b}
                </span>
             ))}
             {t.crisisCertified && (
                <span className="text-[10px] font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-md border border-red-100 dark:border-red-900/30 flex items-center gap-1">
                  <Heart size={10} fill="currentColor" /> Crisis Certified
                </span>
             )}
          </div>

          <button 
             onClick={() => { window.location.href = `/therapists/${t._id}` }} 
             className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-sm py-3 rounded-xl transition-colors shadow-md"
          >
             Request Session
          </button>
        </motion.div>
      ))}
      {therapists.length === 0 && (
        <div className="col-span-full py-20 text-center text-gray-500">
           <UserCheck size={48} className="mx-auto mb-4 opacity-20" />
           <p>Updating therapist directory. Please check back later.</p>
        </div>
      )}
    </div>
  );

  const Hash = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkbg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
           <div>
             <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-3">
               <Users className="text-primary-500" /> Svasthya Community
             </h1>
             <p className="text-gray-500 mt-2 max-w-2xl text-sm sm:text-base">
               You are not alone. Connect with peers facing similar challenges or reach out directly to verified, professional therapists ready to support your journey.
             </p>
           </div>
           
           <div className="bg-gray-100 dark:bg-darkborder p-1.5 rounded-2xl flex mx-auto sm:mx-0 shrink-0">
             <button
               onClick={() => setActiveTab('groups')}
               className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                 activeTab === 'groups' ? 'bg-white dark:bg-darkcard text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
               }`}
             >
               Support Groups
             </button>
             <button
               onClick={() => setActiveTab('therapists')}
               className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                 activeTab === 'therapists' ? 'bg-white dark:bg-darkcard text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
               }`}
             >
               Therapist Directory
             </button>
           </div>
        </div>

        <AnimatePresence mode="wait">
           <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
           >
              {activeTab === 'groups' ? renderGroups() : renderTherapists()}
           </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
