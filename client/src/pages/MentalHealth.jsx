import React from 'react';
import { Heart, Wind, MessageCircle, Music, Shield, ArrowRight } from 'lucide-react';

const MentalHealth = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Mental Well-being</h1>
          <p className="text-slate-500 text-lg">Your academic success starts with a healthy mind. Take a moment for yourself.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        {/* Main AI Chatbot Card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-teal-500/20 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="mb-12">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/10">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Talk to Serenity</h2>
              <p className="text-teal-50 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                Our empathetic AI companion is here 24/7. Whether you're feeling overwhelmed by exams or just need a safe space to vent.
              </p>
            </div>
            <button className="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold shadow-lg w-max hover:scale-105 transition-transform flex items-center">
              Start Conversation <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Crisis Support Card */}
        <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-xl shadow-slate-900/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-2xl"></div>
          <div>
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6 border border-red-500/30">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 mt-10">Crisis Support</h3>
            <p className="text-slate-400 font-medium mb-6">Immediate help is available. You don't have to face it alone.</p>
          </div>
          <div className="space-y-3">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors">
              Call Hotline
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors">
              Campus Resources
            </button>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-6">Self-Care Toolkit</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Guided Meditation",
            desc: "5-15 minute sessions to ground yourself and find focus.",
            icon: <Heart className="w-6 h-6 text-rose-500" />,
            bg: "bg-rose-50",
            border: "border-rose-100",
            hover: "hover:shadow-rose-100"
          },
          {
            title: "Breathing Exercises",
            desc: "Scientifically proven techniques to lower anxiety instantly.",
            icon: <Wind className="w-6 h-6 text-sky-500" />,
            bg: "bg-sky-50",
            border: "border-sky-100",
            hover: "hover:shadow-sky-100"
          },
          {
            title: "Focus Sounds",
            desc: "Binaural beats, lo-fi, and nature sounds for deep study.",
            icon: <Music className="w-6 h-6 text-amber-500" />,
            bg: "bg-amber-50",
            border: "border-amber-100",
            hover: "hover:shadow-amber-100"
          }
        ].map((item, idx) => (
          <div key={idx} className={`bg-white rounded-3xl p-6 border ${item.border} shadow-sm ${item.hover} hover:shadow-xl transition-all duration-300 cursor-pointer group`}>
            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
            <p className="text-slate-500 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentalHealth;
