import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Trophy, 
  Brain, 
  Terminal, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  BarChart3,
  Zap,
  Layout,
  ArrowRight,
  Bell,
  Briefcase,
  Calendar,
  User,
  Share2,
  Linkedin,
  Link as LinkIcon,
  ExternalLink,
  Github,
  Globe,
  MapPin,
  GraduationCap,
  ArrowLeft,
  RotateCcw,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lock,
  Search
} from 'lucide-react';
import { Task, UserStats, SkillCategory, JobOpening } from './types';
import { TASKS, RESOURCES, JOB_OPENINGS } from './constants';
import AIAssistant from './components/AIAssistant';

const XP_PER_LEVEL = 200;

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    const defaultStats: UserStats = {
      name: 'Future Engineer',
      bio: 'Aspiring developer mastering logic and algorithms at CodeQuest.',
      education: 'Computer Science Student',
      github: '',
      portfolio: '',
      location: 'Global',
      level: 1,
      xp: 0,
      skills: {
        Logic: 0,
        Syntax: 0,
        Algorithms: 0,
        Debugging: 0
      },
      completedTasks: []
    };
    const saved = localStorage.getItem('codequest_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultStats, ...parsed };
      } catch (e) {
        console.error("Failed to parse saved stats", e);
        return defaultStats;
      }
    }
    return defaultStats;
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'game' | 'resources' | 'notifications' | 'profile'>('dashboard');
  const [viewHistory, setViewHistory] = useState<string[]>(['dashboard']);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const navigateTo = (view: any) => {
    setViewHistory(prev => [...prev, view]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current
      const prevView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(prevView as any);
    }
  };

  const undoLastTask = () => {
    if (stats.completedTasks.length === 0) return;
    
    setStats(prev => {
      const newCompleted = [...prev.completedTasks];
      const lastTaskId = newCompleted.pop();
      const lastTask = TASKS.find(t => t.id === lastTaskId);
      
      if (!lastTask) return prev;

      const newSkills = { ...prev.skills };
      newSkills[lastTask.category] = Math.max(0, newSkills[lastTask.category] - 10);
      
      return {
        ...prev,
        xp: Math.max(0, prev.xp - lastTask.xpReward),
        completedTasks: newCompleted,
        skills: newSkills
      };
    });
  };
  const [activeJob, setActiveJob] = useState<JobOpening | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [resourceSearchQuery, setResourceSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('codequest_stats', JSON.stringify(stats));
  }, [stats]);

  const isHardUnlocked = useMemo(() => {
    const mediumTasks = TASKS.filter(t => t.difficulty === 'Medium');
    return mediumTasks.length > 0 && mediumTasks.every(t => stats.completedTasks.includes(t.id));
  }, [stats.completedTasks]);

  const handleCompleteTask = (task: Task, isCorrect: boolean) => {
    if (isCorrect) {
      setFeedback({ correct: true, message: task.explanation });
      
      if (!stats.completedTasks.includes(task.id)) {
        setStats(prev => {
          const newXp = prev.xp + task.xpReward;
          const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
          const newSkills = { ...prev.skills };
          newSkills[task.category] += 10;
          
          return {
            ...prev,
            xp: newXp,
            level: newLevel,
            skills: newSkills,
            completedTasks: [...prev.completedTasks, task.id]
          };
        });
      }
    } else {
      setFeedback({ correct: false, message: "Not quite! Try thinking about the logic again." });
    }
  };

  const nextTask = () => {
    setFeedback(null);
    const availableTasks = TASKS.filter(t => !stats.completedTasks.includes(t.id));
    if (availableTasks.length > 0) {
      setActiveTask(availableTasks[0]);
    } else {
      setActiveTask(null);
      navigateTo('dashboard');
    }
  };

  const upskillingPath = useMemo(() => {
    const skillEntries = Object.entries(stats.skills) as [SkillCategory, number][];
    const lowestSkill = skillEntries.sort((a, b) => a[1] - b[1])[0];
    return {
      category: lowestSkill[0],
      suggestion: `Focus on ${lowestSkill[0]} to balance your profile.`,
      nextTask: TASKS.find(t => t.category === lowestSkill[0] && !stats.completedTasks.includes(t.id))
    };
  }, [stats]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 p-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-slate-900">CodeQuest</h1>
            <p className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest">Logic & Learning Terminal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {viewHistory.length > 1 && (
            <button 
              onClick={goBack}
              className="flex items-center gap-2 p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest"
              title="Go Back"
            >
              <ArrowLeft size={18} />
              <span className="hidden md:inline">Back</span>
            </button>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
            title="Refresh Application"
          >
            <RefreshCw size={20} />
          </button>
          <nav className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Layout },
            { id: 'notifications', label: 'Jobs', icon: Bell },
            { id: 'resources', label: 'Resources', icon: BookOpen },
            { id: 'profile', label: 'Profile', icon: User },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                currentView === item.id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <item.icon size={14} />
              <span className="hidden sm:inline">{item.label}</span>
              {item.id === 'notifications' && (
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block relative group">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Level</div>
            <div className="font-display font-bold text-xl leading-none text-slate-900">{stats.level}</div>
            
            {stats.level === 1 && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-1">
                  Next: Level 2 <ArrowRight size={10} />
                </div>
                <p className="text-[9px] text-slate-500 leading-tight">Unlock Hard challenges & Junior Developer job matches!</p>
              </div>
            )}
          </div>
          <div className="w-24 sm:w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out" 
              style={{ width: `${(stats.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Stats Column */}
              <div className="space-y-8">
                <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 blur-2xl opacity-50" />
                  <h2 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2 relative z-10">
                    <BarChart3 size={14} className="text-indigo-500" /> Skill Matrix
                  </h2>
                  <div className="space-y-6 relative z-10">
                    {Object.entries(stats.skills).map(([skill, value], idx) => {
                      const variants = [
                        { bg: 'bg-indigo-50', bar: 'bg-indigo-500', text: 'text-indigo-600', icon: 'text-indigo-400' },
                        { bg: 'bg-emerald-50', bar: 'bg-emerald-500', text: 'text-emerald-600', icon: 'text-emerald-400' },
                        { bg: 'bg-amber-50', bar: 'bg-amber-500', text: 'text-amber-600', icon: 'text-amber-400' },
                        { bg: 'bg-rose-50', bar: 'bg-rose-500', text: 'text-rose-600', icon: 'text-rose-400' }
                      ];
                      const v = variants[idx % variants.length];
                      const isExpanded = expandedSkill === skill;
                      const skillTasks = TASKS.filter(t => t.category === skill);

                      return (
                        <div key={skill} className="space-y-2">
                          <button 
                            onClick={() => setExpandedSkill(isExpanded ? null : skill)}
                            className={`w-full p-4 rounded-2xl border border-transparent transition-all hover:border-slate-100 hover:bg-slate-50/50 group text-left`}
                          >
                            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-3 items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 group-hover:text-slate-900 transition-colors">{skill}</span>
                                {isExpanded ? <ChevronUp size={12} className="text-slate-400" /> : <ChevronDown size={12} className="text-slate-400" />}
                              </div>
                              <span className={v.text}>{value}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full ${v.bar} shadow-lg shadow-current/20`}
                              />
                            </div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden px-2"
                              >
                                <div className="space-y-2 pb-2">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-2 mb-1">Related Activities</p>
                                  {skillTasks.map(task => {
                                    const isCompleted = stats.completedTasks.includes(task.id);
                                    return (
                                      <button
                                        key={task.id}
                                        onClick={() => {
                                          setActiveTask(task);
                                          navigateTo('game');
                                        }}
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group/task"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-slate-300 group-hover/task:bg-indigo-400'}`} />
                                          <span className={`text-[11px] font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-600 group-hover/task:text-slate-900'}`}>
                                            {task.title}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] font-mono font-bold text-slate-400">{task.difficulty}</span>
                                          <ArrowRight size={10} className="text-slate-300 group-hover/task:text-indigo-500 transition-transform group-hover/task:translate-x-0.5" />
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/20 opacity-50" />
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700" />
                  <div className="relative z-10">
                    <h2 className="font-display font-bold text-xs text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Zap size={14} className="animate-pulse" /> Upskilling Path
                    </h2>
                    <p className="text-2xl font-display font-bold mb-8 leading-tight tracking-tight">
                      {upskillingPath.suggestion}
                    </p>
                    {upskillingPath.nextTask ? (
                      <button
                        onClick={() => {
                          setActiveTask(upskillingPath.nextTask!);
                          navigateTo('game');
                        }}
                        className="w-full bg-white text-slate-900 py-4.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-black/20"
                      >
                        Start Recommended Task <ArrowRight size={16} className="text-indigo-600" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <CheckCircle2 size={18} className="text-emerald-400" />
                        <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">All current path tasks completed!</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Main Content Column */}
              <div className="md:col-span-2 space-y-8">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    placeholder="Search challenges by title or category..."
                    value={taskSearchQuery}
                    onChange={(e) => setTaskSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-xl shadow-slate-200/40"
                  />
                </div>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {TASKS.filter(t => 
                    t.difficulty !== 'Hard' && 
                    (t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) || 
                     t.category.toLowerCase().includes(taskSearchQuery.toLowerCase()))
                  ).map((task) => {
                    const isCompleted = stats.completedTasks.includes(task.id);
                    const categoryStyles: Record<string, { card: string; icon: string; border: string; accent: string }> = {
                      Logic: { 
                        card: 'bg-indigo-50/40 hover:bg-indigo-50/60', 
                        icon: 'bg-indigo-100 text-indigo-600',
                        border: 'border-indigo-100 hover:border-indigo-400',
                        accent: 'bg-indigo-500'
                      },
                      Syntax: { 
                        card: 'bg-emerald-50/40 hover:bg-emerald-50/60', 
                        icon: 'bg-emerald-100 text-emerald-600',
                        border: 'border-emerald-100 hover:border-emerald-400',
                        accent: 'bg-emerald-500'
                      },
                      Algorithms: { 
                        card: 'bg-amber-50/40 hover:bg-amber-50/60', 
                        icon: 'bg-amber-100 text-amber-600',
                        border: 'border-amber-100 hover:border-amber-400',
                        accent: 'bg-amber-500'
                      },
                      Debugging: { 
                        card: 'bg-rose-50/40 hover:bg-rose-50/60', 
                        icon: 'bg-rose-100 text-rose-600',
                        border: 'border-rose-100 hover:border-rose-400',
                        accent: 'bg-rose-500'
                      }
                    };
                    const style = categoryStyles[task.category] || categoryStyles.Logic;

                    return (
                      <button
                        key={task.id}
                        onClick={() => {
                          setActiveTask(task);
                          navigateTo('game');
                          setFeedback(null);
                        }}
                        className={`group relative p-8 border-2 rounded-[2.5rem] text-left transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden ${
                          isCompleted 
                            ? 'bg-white border-slate-100 opacity-60' 
                            : `bg-white ${style.border} ${style.card}`
                        }`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${isCompleted ? 'bg-slate-200' : style.accent} opacity-50`} />
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-3.5 rounded-2xl transition-all group-hover:scale-110 ${isCompleted ? 'bg-slate-100 text-slate-400' : style.icon}`}>
                            {isCompleted ? <CheckCircle2 size={22} /> : <Code2 size={22} />}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-lg border border-slate-100">{task.difficulty}</span>
                        </div>
                        <h3 className="font-display font-bold text-xl mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-8 leading-relaxed">{task.description}</p>
                        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-200/50">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${style.accent}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{task.category}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Zap size={12} className="text-amber-500" />
                            <span className="text-[10px] font-mono font-bold text-slate-900">+{task.xpReward} XP</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </section>

                {/* Hard Level Block */}
                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Trophy size={14} className="text-amber-500" /> Advanced Challenges (Hard)
                    </h2>
                    {!isHardUnlocked && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                        <Lock size={10} className="text-amber-600" />
                        <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Complete all Medium tasks to unlock</span>
                      </div>
                    )}
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-500 ${!isHardUnlocked ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                    {TASKS.filter(t => 
                      t.difficulty === 'Hard' && 
                      (t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) || 
                       t.category.toLowerCase().includes(taskSearchQuery.toLowerCase()))
                    ).map((task) => {
                      const isCompleted = stats.completedTasks.includes(task.id);
                      const style = { 
                        card: 'bg-slate-900 hover:bg-slate-800', 
                        icon: 'bg-slate-800 text-indigo-400',
                        border: 'border-slate-800 hover:border-indigo-500',
                        accent: 'bg-indigo-500'
                      };

                      return (
                        <button
                          key={task.id}
                          disabled={!isHardUnlocked}
                          onClick={() => {
                            setActiveTask(task);
                            navigateTo('game');
                          }}
                          className={`group relative text-left p-6 rounded-[2rem] border-2 ${style.border} ${style.card} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-slate-200/50 flex flex-col h-full`}
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl ${style.icon} transition-transform group-hover:scale-110 duration-500`}>
                              <Brain size={20} />
                            </div>
                            {isCompleted && (
                              <div className="bg-emerald-500/20 p-1.5 rounded-full">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">{task.category}</span>
                              <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest">• {task.difficulty}</span>
                            </div>
                            <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors">{task.title}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{task.description}</p>
                          </div>

                          <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <Zap size={12} className="text-amber-400" />
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{task.xpReward} XP</span>
                            </div>
                            <div className="flex items-center gap-1 text-indigo-400 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                              Challenge <ArrowRight size={12} />
                            </div>
                          </div>

                          {!isHardUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] rounded-[2rem]">
                              <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 shadow-2xl">
                                <Lock size={24} className="text-white" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {currentView === 'game' && activeTask && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative z-10">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-1">{activeTask.category}</span>
                    <h2 className="text-2xl font-display font-bold">{activeTask.title}</h2>
                  </div>
                      <div className="flex items-center gap-2 relative z-10">
                        <button 
                          onClick={() => setFeedback(null)}
                          title="Undo Selection"
                          className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-white/70 hover:text-white"
                        >
                          <RotateCcw size={20} />
                        </button>
                        <button 
                          onClick={() => {
                            setFeedback(null);
                          }}
                          title="Refresh Task"
                          className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-white/70 hover:text-white"
                        >
                          <RefreshCw size={20} />
                        </button>
                        <button 
                          onClick={goBack}
                          title="Close"
                          className="p-3 hover:bg-white/10 rounded-2xl transition-colors"
                        >
                          <XCircle size={24} />
                        </button>
                      </div>
                </div>

                <div className="p-10 space-y-10">
                  <div className="space-y-8">
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                      <p className="text-2xl font-display font-bold leading-relaxed text-slate-800">{activeTask.question}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {activeTask.options?.map((option) => (
                        <button
                          key={option}
                          disabled={!!feedback?.correct}
                          onClick={() => handleCompleteTask(activeTask, option === activeTask.correctAnswer)}
                          className={`p-6 border-2 rounded-2xl text-left font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 group relative overflow-hidden ${
                            feedback?.correct && option === activeTask.correctAnswer 
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-xl shadow-emerald-200' 
                              : 'bg-white border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/30 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            <ArrowRight size={18} className={`transition-transform group-hover:translate-x-1 ${feedback?.correct && option === activeTask.correctAnswer ? 'text-white' : 'text-slate-300'}`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-8 rounded-[2rem] border-2 ${feedback.correct ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-rose-50 border-rose-100 text-rose-900'}`}
                    >
                      <div className="flex items-start gap-5">
                        <div className={`p-3 rounded-2xl ${feedback.correct ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {feedback.correct ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        </div>
                        <div>
                          <p className="font-display font-bold text-lg mb-1">{feedback.correct ? 'Excellent!' : 'Try Again'}</p>
                          <p className="text-sm opacity-80 leading-relaxed">{feedback.message}</p>
                        </div>
                      </div>
                      {feedback.correct && (
                        <button
                          onClick={nextTask}
                          className="mt-8 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                          Next Task
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-5xl font-display font-bold mb-4 tracking-tight">Job Opportunities</h2>
                <p className="text-slate-500 text-lg mb-8">Personalized job openings matching your current skill set and level.</p>
                
                <div className="relative group max-w-md mx-auto">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    placeholder="Search roles, companies or skills..."
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-lg shadow-slate-200/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-4">
                  {JOB_OPENINGS.filter(job => 
                    job.role.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
                    job.company.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
                    job.requiredSkills.some(s => s.toLowerCase().includes(jobSearchQuery.toLowerCase()))
                  ).map((job) => {
                    const isMatch = job.requiredSkills.every(skill => stats.skills[skill] >= 20);
                    return (
                      <button
                        key={job.id}
                        onClick={() => setActiveJob(job)}
                        className={`w-full p-8 rounded-[2rem] text-left transition-all border-2 ${
                          activeJob?.id === job.id 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/20' 
                            : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-display font-bold text-lg">{job.role}</h3>
                          {isMatch && (
                            <span className="bg-emerald-500 text-white text-[8px] px-2.5 py-1 rounded-full uppercase font-bold tracking-widest">Strong Match</span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-6">{job.company}</p>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.map(skill => (
                            <span key={skill} className="text-[9px] font-bold uppercase px-2.5 py-1.5 bg-slate-100 text-slate-500 rounded-lg">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-2">
                  {activeJob ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50"
                    >
                      <div className="flex justify-between items-start mb-10 pb-8 border-b border-slate-100">
                        <div>
                          <h2 className="text-4xl font-display font-bold mb-2 text-slate-900">{activeJob.role}</h2>
                          <p className="text-xl text-indigo-600 font-medium">{activeJob.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Match Score</div>
                          <div className="text-4xl font-display font-bold text-emerald-500">{activeJob.matchScore}%</div>
                        </div>
                      </div>

                      <div className="space-y-10">
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Location</div>
                            <div className="font-display font-bold text-slate-900 flex items-center gap-2">
                              <MapPin size={14} className="text-indigo-500" />
                              {activeJob.location}
                            </div>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Salary</div>
                            <div className="font-display font-bold text-slate-900 flex items-center gap-2">
                              <Zap size={14} className="text-emerald-500" />
                              {activeJob.salary}
                            </div>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Type</div>
                            <div className="font-display font-bold text-slate-900 flex items-center gap-2">
                              <Briefcase size={14} className="text-indigo-500" />
                              {activeJob.type}
                            </div>
                          </div>
                        </section>

                        <section>
                          <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest mb-4">About the Role</h4>
                          <p className="text-slate-600 leading-relaxed">{activeJob.description}</p>
                        </section>

                        <section>
                          <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Calendar size={14} className="text-indigo-500" /> 3-Day Preparation Schedule
                          </h4>
                          <div className="space-y-6">
                            {activeJob.preparationSchedule.map((step) => (
                              <div key={step.day} className="flex gap-6 items-start group">
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-lg shadow-slate-200">
                                  {step.day}
                                </div>
                                <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-indigo-200 transition-colors">
                                  <p className="text-slate-700 font-medium mb-3">{step.task}</p>
                                  {step.resourceLink && (
                                    <a 
                                      href={step.resourceLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[10px] font-bold uppercase text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
                                    >
                                      View Resource <ArrowRight size={12} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>

                        <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-3">
                          Apply Now <Briefcase size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                      <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200 mb-6">
                        <Briefcase size={48} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-medium max-w-xs">Select a job opening to view details and your preparation schedule.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-5xl mx-auto space-y-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-display font-bold tracking-tight">Professional Identity</h2>
                <p className="text-slate-500 text-lg max-w-lg mx-auto">This is how the world sees your technical growth. Share your achievements with your network.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Profile Editor */}
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-6">Edit Profile</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Display Name</label>
                        <input 
                          type="text" 
                          value={stats.name}
                          onChange={(e) => setStats(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Short Bio</label>
                        <textarea 
                          value={stats.bio}
                          onChange={(e) => setStats(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Education</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Stanford University"
                            value={stats.education || ''}
                            onChange={(e) => setStats(prev => ({ ...prev, education: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Location</label>
                          <input 
                            type="text" 
                            placeholder="e.g. San Francisco, CA"
                            value={stats.location || ''}
                            onChange={(e) => setStats(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">GitHub Username</label>
                          <input 
                            type="text" 
                            placeholder="username"
                            value={stats.github || ''}
                            onChange={(e) => setStats(prev => ({ ...prev, github: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Portfolio URL</label>
                          <input 
                            type="text" 
                            placeholder="https://..."
                            value={stats.portfolio || ''}
                            onChange={(e) => setStats(prev => ({ ...prev, portfolio: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={undoLastTask}
                      disabled={stats.completedTasks.length === 0}
                      className="w-full bg-rose-50 text-rose-600 py-4.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-100 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                      <RotateCcw size={16} /> Undo Last Completed Task
                    </button>
                    <button 
                      onClick={() => {
                        const text = `Check out my coding progress on CodeQuest! I'm Level ${stats.level} with ${stats.completedTasks.length} tasks completed.`;
                        const url = window.location.href;
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="flex items-center justify-center gap-3 bg-[#0077B5] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                    >
                      <Linkedin size={18} /> Share on LinkedIn
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                      }}
                      className="flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-slate-200 transition-all active:scale-95"
                    >
                      <LinkIcon size={18} /> Copy Profile Link
                    </button>
                  </div>
                </div>

                {/* Shareable Card */}
                <div className="lg:col-span-3">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                      {/* Card Header */}
                      <div className="bg-slate-900 p-10 text-white flex justify-between items-end relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="relative z-10 space-y-4">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-3xl flex items-center justify-center text-4xl font-display font-bold shadow-2xl shadow-indigo-500/30 border-2 border-white/20">
                              {stats.name?.charAt(0) || '?'}
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-4xl font-display font-bold tracking-tight">{stats.name}</h3>
                              <div className="flex flex-wrap gap-3">
                                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg border border-white/10">Verified Student</span>
                                {stats.location && (
                                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <MapPin size={10} /> {stats.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative z-10 text-right group">
                          <div className="text-5xl font-display font-bold leading-none text-white">{stats.level}</div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Current Level</div>
                          
                          {stats.level === 1 && (
                            <div className="mt-6 flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2 text-indigo-400 animate-bounce">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Level 2 Awaits</span>
                                <ArrowRight size={14} />
                              </div>
                              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left max-w-[200px]">
                                <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">Level 2 Benefits:</h4>
                                <ul className="space-y-1.5">
                                  <li className="flex items-start gap-2 text-[9px] text-slate-400">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />
                                    Unlock Hard Difficulty
                                  </li>
                                  <li className="flex items-start gap-2 text-[9px] text-slate-400">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />
                                    Junior Job Eligibility
                                  </li>
                                  <li className="flex items-start gap-2 text-[9px] text-slate-400">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />
                                    Advanced Resources
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-10 space-y-10">
                        <div className="space-y-6">
                          <p className="text-lg font-display font-medium text-slate-600 leading-relaxed italic">"{stats.bio}"</p>
                          
                          <div className="flex flex-wrap gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {stats.education && (
                              <div className="flex items-center gap-2">
                                <GraduationCap size={14} className="text-indigo-500" />
                                {stats.education}
                              </div>
                            )}
                            {stats.github && (
                              <div className="flex items-center gap-2">
                                <Github size={14} className="text-slate-900" />
                                github.com/{stats.github}
                              </div>
                            )}
                            {stats.portfolio && (
                              <div className="flex items-center gap-2">
                                <Globe size={14} className="text-emerald-500" />
                                Portfolio
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8">
                          {Object.entries(stats.skills).map(([skill, value], idx) => {
                            const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];
                            const textColors = ['text-indigo-600', 'text-emerald-600', 'text-rose-600', 'text-amber-600'];
                            return (
                              <div key={skill} className="space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                  <span className="text-slate-400">{skill}</span>
                                  <span className={textColors[idx]}>{value}%</span>
                                </div>
                                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                  <div 
                                    className={`h-full ${colors[idx]} transition-all duration-1000 ease-out`} 
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                          <div className="flex gap-8">
                            <div className="text-center">
                              <div className="text-2xl font-display font-bold text-slate-900">{stats.completedTasks.length}</div>
                              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Quests</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-display font-bold text-slate-900">{stats.xp}</div>
                              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">XP</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter text-slate-300">
                            <Terminal size={14} /> codequest.io
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-5xl font-display font-bold mb-4 tracking-tight">Knowledge Base</h2>
                <p className="text-slate-500 text-lg mb-8">Curated resources to master software engineering beyond the puzzles.</p>
                
                <div className="relative group max-w-md mx-auto">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    placeholder="Search resources by title or category..."
                    value={resourceSearchQuery}
                    onChange={(e) => setResourceSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-lg shadow-slate-200/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {RESOURCES.filter(res => 
                  res.title.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
                  res.category.toLowerCase().includes(resourceSearchQuery.toLowerCase())
                ).map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white border border-slate-100 p-10 rounded-[2.5rem] hover:border-indigo-500 transition-all flex flex-col shadow-xl shadow-slate-200/40 hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                        <BookOpen size={28} />
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        <ExternalLink size={18} className="text-indigo-600" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest mb-4 block">{resource.category}</span>
                      <h3 className="text-2xl font-display font-bold mb-4 text-slate-900 group-hover:text-indigo-600 transition-colors">{resource.title}</h3>
                      <p className="text-slate-500 leading-relaxed mb-10 text-sm">{resource.description}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600 group-hover:gap-4 transition-all">
                        Explore Resource <ArrowRight size={14} />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-center gap-3 font-display font-bold text-2xl tracking-tight text-slate-900">
                <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                  <Terminal size={24} className="text-white" />
                </div>
                CodeQuest
              </div>
              <p className="text-base text-slate-500 leading-relaxed max-w-sm">
                Empowering the next generation of engineers through gamified logic, algorithmic mastery, and professional growth.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'GitHub', 'Discord'].map(social => (
                  <button key={social} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                    {social}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 space-y-8">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Global Progress</h4>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-1">
                  <div className="text-4xl font-display font-bold text-slate-900">{stats.completedTasks.length}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quests Solved</div>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-display font-bold text-slate-900">{stats.xp}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">XP Earned</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-8">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">System Status</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-900 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200" />
                  Operational & Secure
                </div>
                <p className="text-[10px] text-slate-400 font-medium px-2">
                  Last sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">© 2026 CodeQuest Terminal. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Privacy</button>
              <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Terms</button>
            </div>
          </div>
        </div>
      </footer>

      <AIAssistant userStats={stats} onNavigate={navigateTo} />
    </div>
  );
}
