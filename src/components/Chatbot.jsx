import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, BrainCircuit } from 'lucide-react';

const BotMessage = ({ text }) => (
  <div className="flex gap-2 w-full">
    <div className="bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center">
      <BrainCircuit size={16} />
    </div>
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm max-w-[85%] leading-relaxed">
      {text}
    </div>
  </div>
);

const UserMessage = ({ text }) => (
  <div className="flex justify-end w-full">
    <div className="bg-primary-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[85%] leading-relaxed">
      {text}
    </div>
  </div>
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi there! I am your Svasthya Companion. I can provide grounding exercises, stress-relief tips, or just be here to chat. How are you feeling right now?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('svasthya-open-chat', handleOpenChat);
    return () => window.removeEventListener('svasthya-open-chat', handleOpenChat);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { type: 'user', text: userText }]);
    setInput('');

    // Simulate AI response logic based on keywords
    setTimeout(() => {
      let botResponse = 'I am here to listen. Can you tell me a bit more?';
      
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('anxi') || lowerText.includes('panic') || lowerText.includes('nervous')) {
        botResponse = 'It sounds like you might be feeling anxious. Try the 4-7-8 method with me: Breathe in for 4 seconds, hold for 7, and exhale slowly for 8. You are safe here.';
      } else if (lowerText.includes('sad') || lowerText.includes('depress') || lowerText.includes('down')) {
        botResponse = 'I am so sorry you are feeling down. Remember that these feelings are valid, but they don\'t define you. Have you had drinking water or taken a short walk today? Small steps can help.';
      } else if (lowerText.includes('stress') || lowerText.includes('overwhelm') || lowerText.includes('exam')) {
        botResponse = 'Stress can feel very heavy. A quick tip: Write down the top 3 things causing you stress, and just tackle the easiest one first. Sometimes breaking it down is the best remedy.';
      } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
        botResponse = 'Hello! How is your day going?';
      }

      setMessages((prev) => [...prev, { type: 'bot', text: botResponse }]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-primary-600 hover:bg-primary-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-colors"
      >
        <MessageCircle size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-[350px] max-w-[calc(100vw-32px)] h-[500px] max-h-[calc(100vh-100px)] bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary-600 p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2">
                <BrainCircuit size={20} />
                <div>
                  <h3 className="font-bold text-sm">Svasthya Companion</h3>
                  <p className="text-[10px] text-primary-100">Free 24/7 AI Tips & Support</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-darkbg">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i}
                >
                  {msg.type === 'bot' ? <BotMessage text={msg.text} /> : <UserMessage text={msg.text} />}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-darkcard shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type how you feel..."
                  className="w-full bg-white dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary-500 dark:text-white transition-colors shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:hover:bg-primary-600"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
