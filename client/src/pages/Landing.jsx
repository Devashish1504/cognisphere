import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Compass, Heart, Users, CheckCircle, ArrowRight, Play } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 tracking-tighter">
                CogniSphere
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-purple-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-purple-600 font-medium transition-colors">How it works</a>
              <a href="#testimonials" className="text-slate-600 hover:text-purple-600 font-medium transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 hover:text-purple-600 font-medium transition-colors px-3 py-2">Log in</Link>
              <Link to="/register" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:scale-105 active:scale-95">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-200/50 blur-3xl opacity-60"></div>
        <div className="absolute top-40 left-0 -ml-20 w-72 h-72 rounded-full bg-blue-200/50 blur-3xl opacity-60"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-50 rounded-full px-4 py-1.5 mb-8 border border-purple-100 shadow-sm animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
            <span className="text-sm font-medium text-purple-700">The Ultimate Student Ecosystem</span>
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-black tracking-tight text-slate-900 sm:text-7xl mb-8">
            Smart Learning Ecosystem <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 relative">
              Empowering Students
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-purple-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,5 Q50,0 100,5" stroke="currentColor" strokeWidth="3" fill="none"/></svg>
            </span>
            {' '}with Technology
          </h1>
          <p className="mx-auto max-w-2xl text-lg tracking-tight text-slate-600 sm:text-xl mb-10 leading-relaxed">
            Integrate your tasks, academic resources, career guidance, mentorship, and mental well-being into one unified, intelligent platform designed for your success.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:-translate-y-1 flex items-center">
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="#demo" className="bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-8 py-4 rounded-full font-bold shadow-sm transition-all hover:-translate-y-1 flex items-center">
              <Play className="mr-2 w-5 h-5 text-purple-600" /> Watch Demo
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to excel
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
              CogniSphere brings together the most critical aspects of student life into a beautifully designed, seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Time & Task Management',
                description: 'Organize your schedule, set deadlines, and track your active tasks with visualizing progress.',
                icon: <CheckCircle className="w-6 h-6 text-white" />,
                color: 'from-pink-500 to-rose-500',
              },
              {
                title: 'Career Guidance',
                description: 'Take intelligent assessments to find the best career paths and discover your true potential.',
                icon: <Compass className="w-6 h-6 text-white" />,
                color: 'from-purple-500 to-indigo-500',
              },
              {
                title: 'Educational Resources',
                description: 'Access premium content, notes, PDFs, and video lectures structured by category and subject.',
                icon: <BookOpen className="w-6 h-6 text-white" />,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Mental Health Support',
                description: 'Meditation guides, stress management resources, and AI chatbots to help you cope with academic stress.',
                icon: <Heart className="w-6 h-6 text-white" />,
                color: 'from-emerald-500 to-teal-500',
              },
              {
                title: 'Mentorship Access',
                description: 'Connect with expert mentors across various fields to receive personal guidance and advice.',
                icon: <Users className="w-6 h-6 text-white" />,
                color: 'from-orange-500 to-amber-500',
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 block">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl mb-6 tracking-tight">
            Ready to transform your academic journey?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Join thousands of students and educators already using CogniSphere.
          </p>
          <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-slate-900 bg-white hover:bg-slate-50 shadow-xl shadow-white/10 transition-all hover:scale-105">
            Get Started For Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
