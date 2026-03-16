import React from 'react';
import { TrendingUp, Clock, BookOpen, Target, Award, ChevronUp } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Performance Analytics</h1>
        <p className="text-slate-500 text-lg">Visualize your academic journey and track your productivity across all modules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Study Time', value: '42 hrs', increase: '+12%', icon: <Clock className="w-6 h-6" />, color: 'bg-blue-500' },
          { title: 'Tasks Completed', value: '18', increase: '+5%', icon: <Target className="w-6 h-6" />, color: 'bg-emerald-500' },
          { title: 'Resources Read', value: '24', increase: '+20%', icon: <BookOpen className="w-6 h-6" />, color: 'bg-purple-500' },
          { title: 'Skill Badges', value: '4', increase: '+1', icon: <Award className="w-6 h-6" />, color: 'bg-amber-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} rounded-full mix-blend-multiply opacity-5 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center mb-4 shadow-lg shadow-${stat.color}/30 group-hover:rotate-12 transition-transform`}>
              {stat.icon}
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">{stat.title}</h3>
            <div className="flex items-end space-x-3">
              <span className="text-3xl font-black text-slate-900">{stat.value}</span>
              <span className="flex items-center text-emerald-500 font-bold text-sm mb-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                <ChevronUp className="w-3 h-3 mr-0.5" /> {stat.increase}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">Weekly Activity Highlights</h2>
            <select className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer outline-none">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2 relative">
            <div className="absolute top-0 left-0 w-full border-t border-dashed border-slate-200 -z-10"></div>
            <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-slate-200 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-full border-t border-solid border-slate-200 -z-10"></div>
            
            {/* Simple mock bar chart */}
            {[
              { day: 'Mon', h: '40%' }, { day: 'Tue', h: '70%' }, { day: 'Wed', h: '45%' },
              { day: 'Thu', h: '90%' }, { day: 'Fri', h: '60%' }, { day: 'Sat', h: '30%' }, { day: 'Sun', h: '80%' }
            ].map(bar => (
              <div key={bar.day} className="flex flex-col items-center w-full group">
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-80" 
                  style={{ height: bar.h }}
                ></div>
                <span className="text-xs font-bold text-slate-500 mt-3">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-bold mb-6 text-white relative z-10 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" /> Skill Progress
          </h2>
          <div className="space-y-6 relative z-10">
            {[
              { label: 'Frontend Development', pct: '85%', color: 'bg-blue-500' },
              { label: 'Data Structures', pct: '60%', color: 'bg-purple-500' },
              { label: 'System Design', pct: '40%', color: 'bg-emerald-500' }
            ].map(skill => (
              <div key={skill.label}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-200">{skill.label}</span>
                  <span className="text-white">{skill.pct}</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2.5">
                  <div className={`${skill.color} h-2.5 rounded-full`} style={{ width: skill.pct }}></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/10 relative z-10">
            <p className="text-sm font-medium text-slate-200">
              💡 <strong className="text-white">Tip:</strong> You are 15% closer to achieving your "React Master" goal than last week. Keep it up!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
