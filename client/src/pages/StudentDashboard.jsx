import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  PlayCircle,
  Plus,
  X,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { cn } from '../utils';

const StudentDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: 10, unit: 'Tasks', deadline: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [analyticsRes, goalsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/analytics', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/api/goals', { headers: { 'x-auth-token': token } })
      ]);
      setAnalyticsData(analyticsRes.data);
      setGoals(goalsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/goals', newGoal, {
        headers: { 'x-auth-token': token }
      });
      setShowGoalModal(false);
      setNewGoal({ title: '', target: 10, unit: 'Tasks', deadline: '' });
      fetchData();
    } catch (err) {
      console.error('Error creating goal', err);
    }
  };

  const incrementGoal = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/goals/${id}/increment`, {}, {
        headers: { 'x-auth-token': token }
      });
      fetchData();
    } catch (err) {
      console.error('Error incrementing goal', err);
    }
  };

  const statLinks = ['/student/tasks', '/student/analytics', '/student/mentorship', '/student/mental-health'];

  const stats = analyticsData ? [
    { name: 'Active Tasks', value: analyticsData.stats.totalTasks.toString(), icon: <CheckCircle2 size={24} />, color: 'from-pink-500 to-rose-500', trend: `${analyticsData.stats.completedTasks} completed` },
    { name: 'Tasks Done', value: analyticsData.stats.completedTasks.toString(), icon: <Clock size={24} />, color: 'from-purple-500 to-indigo-500', trend: `${analyticsData.stats.pendingTasks} pending` },
    { name: 'Mentor Sessions', value: analyticsData.stats.mentorshipRequests.toString(), icon: <BookOpen size={24} />, color: 'from-blue-500 to-cyan-500', trend: `${analyticsData.stats.acceptedMentorships} accepted` },
    { name: 'Wellness Checks', value: analyticsData.stats.assessmentsTaken.toString(), icon: <Target size={24} />, color: 'from-emerald-500 to-teal-500', trend: 'assessments taken' },
  ] : [];

  // Mock agenda for now (usually filtered from tasks where deadline is today)
  const todaySchedule = [
    { title: 'Mathematics Study Session', time: '09:00', duration: '2h', type: 'study', color: 'bg-purple-500' },
    { title: 'Career Assessment Quiz', time: '11:30', duration: '30m', type: 'assessment', color: 'bg-indigo-500' },
    { title: 'Physics Lecture - Wave Mechanics', time: '14:00', duration: '1h', type: 'lecture', color: 'bg-emerald-500' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group overflow-hidden rounded-[2.5rem]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-90 group-hover:opacity-95 transition-opacity" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-white max-w-xl">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Sparkles size={14} /> Peak Performance
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
              Welcome back, <span className="text-blue-200">{user?.name || 'Student'}</span>!
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium opacity-90 leading-relaxed mb-8">
              "Persistence overcomes resistance. You've completed {analyticsData?.stats.completedTasks || 0} tasks so far. Keep moving forward!"
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/student/resources')} className="px-8 py-3.5 bg-white text-purple-700 font-bold rounded-2xl shadow-xl shadow-black/10 hover:shadow-white/20 hover:-translate-y-1 transition-all flex items-center gap-2">
                Resume Learning <PlayCircle size={20} />
              </button>
              <button onClick={() => navigate('/student/analytics')} className="px-8 py-3.5 bg-purple-500/30 backdrop-blur-md text-white font-bold border border-white/30 rounded-2xl hover:bg-white/10 transition-all">
                View Reports
              </button>
            </div>
          </div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:block w-72 h-72 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 rotate-12 flex items-center justify-center p-6 shadow-2xl"
          >
            <div className="w-full h-full bg-white rounded-2xl p-6 flex flex-col justify-between -rotate-12">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Trophy size={28} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Weekly Rank</p>
                  <p className="text-2xl font-black text-slate-900">Top 5%</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-emerald-500 rounded-full" />
                </div>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-1">You're more consistent than 95% of users this week. Stay disciplined!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={itemAnim}
            whileHover={{ y: -5 }}
            onClick={() => navigate(statLinks[idx])}
            className="glass-card rounded-[2.5rem] p-7 group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-5">
              <div className={cn(
                "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-300",
                stat.color
              )}>
                {stat.icon}
              </div>
              <span className="p-2 transition-colors">
                <ArrowRight size={18} className="text-slate-300 group-hover:text-purple-500" />
              </span>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.name}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-none">{stat.value}</h3>
                <TrendingUp size={16} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2 capitalize">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Agenda */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card rounded-[2.5rem] p-8 md:p-10"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Today's Agenda</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Mapped from your task deadlines</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/student/tasks')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                <CalendarIcon size={20} />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {todaySchedule.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="group flex items-center gap-6 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-purple-200 dark:hover:border-purple-900/30 transition-all font-['Outfit']"
              >
                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{item.time}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.duration}</p>
                </div>
                <div className={cn("w-1.5 h-12 rounded-full", item.color)} />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{item.title}</h4>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.type}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 text-purple-600 transition-all">
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            ))}
          </div>

          <button onClick={() => navigate('/student/tasks')} className="w-full mt-8 py-5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 font-bold hover:border-purple-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center justify-center gap-2">
            Schedule a New Task <Plus size={18} />
          </button>
        </motion.div>

        {/* Active Goals */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="glass-card rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="text-purple-500" size={24} /> Active Goals
              </h3>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center hover:bg-purple-100 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="space-y-8 min-h-[100px]">
              {goals.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-4">No active goals</p>
                  <button onClick={() => setShowGoalModal(true)} className="text-sm font-black text-purple-600 hover:underline transition-all">Set your first goal →</button>
                </div>
              ) : (
                goals.map((goal) => {
                  const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                  return (
                    <div key={goal._id} className="space-y-3 group">
                      <div className="flex justify-between items-end">
                        <div className="max-w-[140px]">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{goal.title}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase">{goal.current}/{goal.target} {goal.unit}</p>
                        </div>
                        <button 
                          onClick={() => incrementGoal(goal._id)}
                          className="text-sm font-black text-purple-600 group-hover:scale-110 transition-transform px-2 py-0.5 bg-purple-50 dark:bg-purple-900/10 rounded-md"
                        >
                          +{goal.unit === 'Tasks' ? '1' : 'Hr'}
                        </button>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                          className={cn(
                            "h-full rounded-full shadow-sm",
                            progress === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-purple-500 to-blue-500"
                          )}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">CogniSphere AI</p>
              <h4 className="text-lg font-extrabold mb-4">Motivation Spike! 🚀</h4>
              <p className="text-sm font-medium text-indigo-100 leading-relaxed mb-6 opacity-90">
                You've completed {analyticsData?.stats.completedTasks || 0} tasks this week. Your focus peaks at 10:00 AM. 
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-lg">
                  <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=fff&color=6366f1&bold=true`} alt="avatar" />
                </div>
                <div>
                  <p className="text-xs font-black leading-none">{user?.name || 'Learner'}</p>
                  <p className="text-[10px] text-indigo-200 font-bold mt-1">Consistency Streak: 5 Days</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goal Creation Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <Target size={24} className="text-purple-600" /> New Weekly Goal
                </h2>
                <button onClick={() => setShowGoalModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">What do you want to achieve?</label>
                  <input 
                    type="text" required
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="e.g. Finish Data Structures"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">Target Number</label>
                    <input 
                      type="number" required min="1"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">Unit</label>
                    <select 
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Tasks">Tasks</option>
                      <option value="Hours">Hours</option>
                      <option value="Sessions">Sessions</option>
                      <option value="Practice">Practice</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1">Target Date</label>
                  <input 
                    type="date" required
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black rounded-2xl shadow-lg mt-2">
                  Launch Goal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;
