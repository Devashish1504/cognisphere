import React from 'react';
import { Mail, Calendar, Video, Star, Users, MapPin, Award } from 'lucide-react';

const Mentorship = () => {
  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Jenkins",
      title: "Senior AI Researcher at TechCorp",
      expertise: ["Machine Learning", "Python", "Career Advice"],
      rating: 4.9,
      sessions: 124,
      image: "SJ",
      available: "Next available: Tomorrow",
      color: "bg-blue-600"
    },
    {
      id: 2,
      name: "Michael Chang",
      title: "Lead Frontend Developer",
      expertise: ["React", "UI/UX", "System Design"],
      rating: 4.8,
      sessions: 89,
      image: "MC",
      available: "Next available: Today",
      color: "bg-purple-600"
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      title: "Product Manager at InnovateInc",
      expertise: ["Agile", "Product Strategy", "Leadership"],
      rating: 5.0,
      sessions: 210,
      image: "ER",
      available: "Next available: Friday",
      color: "bg-emerald-600"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 text-white mb-12 relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl -mr-40 -mt-40 mix-blend-screen pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black mb-4">Connect with Industry Experts</h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Get personalized guidance, resume reviews, mock interviews, and career advice from professionals who have been where you are.
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
              Browse Mentors
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-colors">
              How it Works
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Recommended For You</h2>
        <a href="#" className="text-purple-600 font-bold text-sm hover:underline">View All Mentors →</a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {mentors.map(mentor => (
          <div key={mentor.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="p-6 relative">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${mentor.color}`}></div>
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white ${mentor.color} shadow-lg shadow-black/10`}>
                  {mentor.image}
                </div>
                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" /> {mentor.rating}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900">{mentor.name}</h3>
              <p className="text-slate-500 text-sm font-medium mb-4 flex items-center">
                <MapPin className="w-3 h-3 mr-1" /> {mentor.title}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {mentor.expertise.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded-lg text-xs font-bold">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-xs font-bold text-slate-400 mb-6 space-x-4">
                <span className="flex items-center"><Users className="w-4 h-4 mr-1 text-slate-300" /> {mentor.sessions} Sessions</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-300" /> {mentor.available}</span>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold transition-colors">
                Request Session
              </button>
              <button className="w-12 h-12 bg-white border border-slate-200 text-slate-600 flex justify-center items-center rounded-xl hover:bg-slate-50 hover:text-purple-600 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mentorship;
