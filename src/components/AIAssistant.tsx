import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SkillCategory } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIAssistantProps {
  userStats: any;
  onNavigate: (view: 'dashboard' | 'game' | 'resources') => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function AIAssistant({ userStats, onNavigate }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatSession = useRef<any>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = `Hi! I'm your CodeQuest Mentor. I can help you navigate the app, explain coding concepts, or suggest what to learn next. 

Which skill are you most interested in improving today: Logic, Syntax, Algorithms, or Debugging?`;
      setMessages([{ role: 'model', text: welcomeText }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatSession.current) {
        chatSession.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: `You are a helpful and encouraging coding mentor for the "CodeQuest" app. 
            The app helps students learn: Logic, Syntax, Algorithms, and Debugging.
            User's current level: ${userStats.level}.
            User's completed tasks: ${userStats.completedTasks.length}.
            
            Your goals:
            1. Help users understand how to use the app.
            2. Ask users what skills they want to learn.
            3. Provide brief, clear explanations of coding concepts.
            4. Encourage them to try tasks in the dashboard.
            5. If they ask about a specific skill, explain why it's important and suggest they check the dashboard.
            
            Keep responses concise and friendly. Use a technical but approachable tone.`,
          },
        });
      }

      const result = await chatSession.current.sendMessage({ message: userMessage });
      const responseText = result.text;
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having a bit of trouble connecting right now. Try again in a moment!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
            <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&eyebrows=default&eyes=default&mouth=smile&top=longHair&hairColor=2c1b18&clothing=blazerAndShirt" 
                    alt="AI Mentor"
                    className="w-full h-full object-cover bg-indigo-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="font-display font-bold text-sm block">AI Mentor</span>
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Always Online</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-70 relative z-10">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-200' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 size={16} className="animate-spin text-indigo-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your mentor..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900 text-white rounded-xl disabled:opacity-30 transition-all active:scale-90"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group p-0 rounded-2xl shadow-xl transition-all border-2 overflow-hidden ${
          isOpen ? 'bg-slate-900 border-slate-900 w-16 h-16 flex items-center justify-center' : 'bg-white border-white w-16 h-16'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&eyebrows=default&eyes=default&mouth=smile&top=longHair&hairColor=2c1b18&clothing=blazerAndShirt" 
                alt="AI Mentor"
                className="w-full h-full object-cover bg-indigo-50"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 text-[10px] font-bold text-indigo-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Need help?
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-slate-100 rotate-45" />
            </div>
          </>
        )}
      </motion.button>
    </div>
  );
}
