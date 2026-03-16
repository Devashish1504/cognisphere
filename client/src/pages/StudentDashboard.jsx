import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Clock, BookOpen, Target, TrendingUp, Calendar as CalendarIcon, Beaker } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { name: 'Active Tasks', value: '12', icon: <CheckCircle2 size={24} className="text-white" />, color: 'from-pink-500 to-rose-500', trend: '+2 this week' },
    { name: 'Study Hours', value: '34h', icon: <Clock size={24} className="text-white" />, color: 'from-purple-500 to-indigo-500', trend: '↑ 15% vs last week' },
    { name: 'Resources Viewed', value: '28', icon: <BookOpen size={24} className="text-white" />, color: 'from-blue-500 to-cyan-500', trend: '5 completed' },
    { name: 'Goal Progress', value: '78%', icon: <Target size={24} className="text-white" />, color: 'from-emerald-500 to-teal-500', trend: 'On track' },
  ];

  const upcomingClasses = [
    { title: 'Advanced Mathematics', time: '10:00 AM - 11:30 AM', type: 'Lecture', color: 'bg-purple-100 text-purple-700' },
    { title: 'Data Structures Lab', time: '1:00 PM - 3:00 PM', type: 'Lab', color: 'bg-blue-100 text-blue-700' },
    { title: 'Physics Study Group', time: '4:30 PM - 5:30 PM', type: 'Peer Learning', color: 'bg-emerald-100 text-emerald-700' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Here's a summary of your academic journey today.</p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 flex gap-3">
          <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors shadow-sm">
            View Schedule
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-medium transition-all shadow-md shadow-purple-500/20 hover:shadow-purple-500/40">
            Resume Learning
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-black/5`}>
                {stat.icon}
              </div>
              <span className="inline-flex items-center px-2 py-1 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-lg">
                <TrendingUp size={12} className="mr-1" /> Today
              </span>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.name}</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <Beaker className="w-5 h-5 mr-2 text-purple-500" /> Learning Progress
            </h3>
            <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-700 dark:text-slate-300">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between px-4 pb-2 space-x-2">
            {/* Fake bar chart */}
            {[40, 70, 45, 90, 65, 30, 85].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg relative flex-1 transition-colors flex items-end justify-center rounded-b-sm">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-500 to-blue-400 group-hover:to-purple-400 rounded-t-md rounded-b-sm transition-all duration-500"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" /> Upcoming
            </h3>
            <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium">View all</button>
          </div>
          <div className="space-y-4">
            {upcomingClasses.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                <div className="w-2 h-full bg-gradient-to-b from-purple-500 to-blue-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.color}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center">
                    <Clock size={12} className="mr-1" /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:border-purple-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            + Add New Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
