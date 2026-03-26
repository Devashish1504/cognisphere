import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Clock, BookOpen, Target, Award, CheckCircle2, 
  Users, Brain, BarChart2, Activity, Calendar, ShieldCheck 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, AreaChart, Area, Legend
} from 'recharts';
import { cn } from '../utils';

const Analytics = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics', {
          headers: { 'x-auth-token': token }
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching analytics', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">Assembling your performance data...</p>
        </div>
      </div>
    );
  }

  const stats = data ? [
    { title: 'Total Tasks', value: data.stats.totalTasks.toString(), trend: `${data.stats.completedTasks} done`, icon: <Target className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Goal Mastery', value: '85%', trend: `Top 5% student`, icon: <Award className="w-6 h-6" />, color: 'bg-indigo-600' },
    { title: 'Mentor Sessions', value: data.stats.mentorshipRequests.toString(), trend: `${data.stats.acceptedMentorships} accepted`, icon: <Users className="w-6 h-6" />, color: 'bg-purple-500' },
    { title: 'Wellness Checks', value: data.stats.assessmentsTaken.toString(), trend: 'assessments', icon: <Brain className="w-6 h-6" />, color: 'bg-emerald-500' }
  ] : [];

  // Transform assessments for Line Chart
  const wellnessTrendData = data?.assessments.map(a => ({
    date: new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: a.score
  })).reverse() || [];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 font-['Outfit']">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">My Growth Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Visualizing your progress across academic and wellness journeys.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl font-bold text-sm">
            <Calendar size={18} /> Last 30 Days
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card rounded-3xl p-6 border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</span>
              <span className="text-emerald-500 font-black text-[10px] items-center flex gap-1 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">
                <TrendingUp size={10} /> {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Wellness Trend Line Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="text-rose-500" size={24} /> Wellness Score Trend
            </h2>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">PHQ-9 History</div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wellnessTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  domain={[0, 27]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 800, color: '#f43f5e' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#f43f5e" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={20} />
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Scores above 10 suggest moderate symptoms. Consistency in these scores over 4 weeks may indicate positive coping progress.
            </p>
          </div>
        </motion.div>

        {/* Weekly Task Activity Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="text-indigo-500" size={24} /> Productivity Heat
            </h2>
            <div className="text-xs font-bold text-slate-400 uppercase">Tasks Completed</div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.weeklyActivity}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {data?.weeklyActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">Weekly Average</p>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                {(data?.weeklyActivity.reduce((acc, d) => acc + d.count, 0) / 7).toFixed(1)} Tasks/Day
              </h4>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase mb-1">Best Performance</p>
              <h4 className="text-xl font-black text-indigo-600">Friday</h4>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Distribution Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800"
        >
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8">Focus Areas</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="name"
                >
                  {data?.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {data?.categories.map((cat, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-bold text-slate-700 dark:text-white truncate max-w-[100px]">{cat.name}</span>
                </div>
                <span className="text-sm font-black text-slate-500">{cat.progress}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Efficiency Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 bg-slate-900 text-white"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black mb-1">Productivity Mastery</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Calculated Learning Index</p>
            </div>
            <div className="px-4 py-2 bg-purple-600 rounded-xl font-black text-sm shadow-lg shadow-purple-600/30">
              AI Scoring
            </div>
          </div>
          
          <div className="h-80 w-full opacity-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.weeklyActivity}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} />
                <Tooltip cursor={false} />
                <Area type="monotone" dataKey="count" stroke="#a78bfa" fillOpacity={1} fill="url(#colorCount)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 flex gap-6 overflow-x-auto pb-2 scrollbar-none">
            <div className="min-w-[150px] p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-purple-400 uppercase mb-2">Focus Time</p>
              <h4 className="text-2xl font-black">24.5h</h4>
            </div>
            <div className="min-w-[150px] p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-2">Consistency</p>
              <h4 className="text-2xl font-black">92%</h4>
            </div>
            <div className="min-w-[150px] p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Resources</p>
              <h4 className="text-2xl font-black">12 Consumed</h4>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
