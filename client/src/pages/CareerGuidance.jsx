import React from 'react';
import { Sparkles, Brain, Target, BookOpen, ChevronRight } from 'lucide-react';

const CareerGuidance = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in-up">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Career Guidance & Assessment</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Discover your true potential through AI-driven assessments and tailored career pathways designed just for you.</p>
      </div>

      {/* Main hero card for assessment */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-10 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold w-max mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI Powered</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Take the Career Compass Assessment</h2>
            <p className="text-slate-600 mb-8 text-lg font-medium leading-relaxed">
              Answer 20 targeted questions about your interests, skills, and working style. Our AI will analyze your profile and recommend the most suitable tech careers.
            </p>
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 flex items-center w-max">
              Start Assessment <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-10 relative overflow-hidden flex items-center justify-center min-h-[300px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur p-4 rounded-2xl shadow-sm rotate-[-6deg] hover:rotate-0 transition-transform">
                <Brain className="w-8 h-8 text-purple-600 mb-2" />
                <p className="font-bold text-slate-800">Problem Solving</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2"><div className="w-[85%] bg-purple-600 h-1.5 rounded-full"></div></div>
              </div>
              <div className="bg-white/80 backdrop-blur p-4 rounded-2xl shadow-sm rotate-[6deg] hover:rotate-0 transition-transform mt-8">
                <Target className="w-8 h-8 text-blue-600 mb-2" />
                <p className="font-bold text-slate-800">Logic & Math</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2"><div className="w-[92%] bg-blue-600 h-1.5 rounded-full"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-6">Recommended Career Paths</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Software Engineering',
            match: '96%',
            desc: 'Build robust applications and systems using modern frameworks and languages.',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            borderColor: 'border-blue-100'
          },
          {
            title: 'Data Science',
            match: '88%',
            desc: 'Extract insights from complex data using statistics, machine learning, and visualization.',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            borderColor: 'border-purple-100'
          },
          {
            title: 'Product Management',
            match: '75%',
            desc: 'Guide the success of a product and lead the cross-functional team that is responsible for improving it.',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100'
          }
        ].map((path, idx) => (
          <div key={idx} className={`bg-white rounded-3xl p-6 border ${path.borderColor} shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group`}>
            {idx === 0 && <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">Top Match</div>}
            <div className={`w-14 h-14 ${path.bg} ${path.color} rounded-2xl flex items-center justify-center mb-6`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">{path.title}</h4>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`${path.bg.replace('50', '500')} h-2 rounded-full transition-all`} style={{ width: path.match }}></div>
              </div>
              <span className={`font-bold ${path.color} text-sm`}>{path.match}</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 h-16">{path.desc}</p>
            <button className={`w-full py-2.5 rounded-xl font-bold ${path.color} ${path.bg} hover:brightness-95 transition-all`}>
              View Roadmaps
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerGuidance;
