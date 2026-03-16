import React from 'react';
import { Users, Calendar, Video, FileText, CheckCircle, Clock } from 'lucide-react';

const MentorDashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Mentor Dashboard</h1>
          <p className="text-slate-500 text-lg">Manage your sessions, unread requests, and uploaded resources.</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:-translate-y-1 mt-4 md:mt-0">
          Upload Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Pending Requests', value: '5', icon: <Clock className="w-6 h-6" />, color: 'bg-amber-500' },
          { title: 'Upcoming Sessions', value: '3', icon: <Calendar className="w-6 h-6" />, color: 'bg-blue-500' },
          { title: 'Total Students', value: '42', icon: <Users className="w-6 h-6" />, color: 'bg-emerald-500' },
          { title: 'Resources Uploaded', value: '18', icon: <FileText className="w-6 h-6" />, color: 'bg-purple-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} rounded-full mix-blend-multiply opacity-5 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center mb-4 shadow-lg shadow-${stat.color}/30 group-hover:rotate-12 transition-transform`}>
              {stat.icon}
            </div>
            <h3 className="text-slate-500 font-medium text-sm mb-1">{stat.title}</h3>
            <span className="text-3xl font-black text-slate-900">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Mentorship Requests</h2>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Sarah Jenkins', topic: 'React Best Practices', date: 'Today, 2:00 PM', status: 'pending' },
                { name: 'Michael Chen', topic: 'Career in Data Science', date: 'Tomorrow, 10:00 AM', status: 'pending' },
              ].map((req, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 text-white flex items-center justify-center font-bold font-lg">
                      {req.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{req.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">{req.topic}</p>
                      <p className="text-xs text-slate-400 flex items-center mt-1"><Clock className="w-3 h-3 mr-1" /> {req.date}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 p-2 rounded-xl transition-colors font-bold text-sm">Accept</button>
                    <button className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-xl transition-colors font-bold text-sm">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 className="text-xl font-bold mb-4 flex items-center"><Video className="w-6 h-6 mr-2 text-purple-400" /> Host a Webinar</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Schedule a group session to cover broad topics or host Q&A with multiple students at once.
            </p>
            <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
              Schedule Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
