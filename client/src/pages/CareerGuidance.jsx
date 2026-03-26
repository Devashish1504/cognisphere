import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Target, Briefcase, Map, Sparkles, ArrowRight, ChevronRight, 
  CheckCircle2, BrainCircuit, Rocket, Activity, Star, ChevronLeft, 
  RotateCcw, Info, Lightbulb
} from 'lucide-react';
import { cn } from '../utils';

// Skills-based career assessment questions
const CAREER_QUESTIONS = [
  { id: 1, text: "I enjoy solving logical puzzles and mathematical problems.", category: "analytical" },
  { id: 2, text: "I like building or coding things from scratch.", category: "technical" },
  { id: 3, text: "I enjoy designing visual layouts or graphics.", category: "creative" },
  { id: 4, text: "I feel comfortable leading a group of people to reach a goal.", category: "leadership" },
  { id: 5, text: "I am good at mediating conflicts and understanding emotions.", category: "interpersonal" },
  { id: 6, text: "I prefer working with large datasets to find hidden patterns.", category: "analytical" },
  { id: 7, text: "I enjoy learning new programming languages or frameworks.", category: "technical" },
  { id: 8, text: "I like writing stories or coming up with creative concepts.", category: "creative" },
  { id: 9, text: "I enjoy planning projects and managing deadlines.", category: "leadership" },
  { id: 10, text: "I enjoy talking to people to understand their needs.", category: "interpersonal" },
];

const CareerGuidance = () => {
  const { token } = useContext(AuthContext);
  const [assessments, setAssessments] = useState([]);
  const [view, setView] = useState('home'); // 'home' | 'quiz' | 'result'
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [latestResult, setLatestResult] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/career', {
          headers: { 'x-auth-token': token }
        });
        setAssessments(res.data);
        if (res.data.length > 0) setLatestResult(res.data[0]);
      } catch (err) {
        console.error('Error fetching assessments', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAssessments();
  }, [token]);

  const startQuiz = () => {
    setAnswers({});
    setCurrentQ(0);
    setView('quiz');
  };

  const handleAnswer = (score) => {
    setAnswers({ ...answers, [currentQ]: score });
    if (currentQ < CAREER_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const calculateResults = async () => {
    // Group scores by category
    const finalScores = {
      analytical: 0, technical: 0, creative: 0, leadership: 0, interpersonal: 0
    };

    Object.entries(answers).forEach(([idx, score]) => {
      const q = CAREER_QUESTIONS[idx];
      finalScores[q.category] += score * 2; // Normalize to 1-10 per question
    });

    try {
      const res = await axios.post('http://localhost:5000/api/career/submit', {
        scores: finalScores
      }, {
        headers: { 'x-auth-token': token }
      });
      setAssessments([res.data, ...assessments]);
      setLatestResult(res.data);
      setView('result');
    } catch (err) {
      console.error('Error submitting assessment', err);
    }
  };

  const currentPathways = latestResult?.recommendedPathways || [];

  if (view === 'quiz') {
    const q = CAREER_QUESTIONS[currentQ];
    return (
      <div className="max-w-2xl mx-auto py-10 font-['Outfit']">
        <div className="mb-10 flex justify-between items-center px-2">
            <div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Career Insight Quiz</h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{currentQ + 1}</span>
                <span className="text-slate-300 font-bold">/</span>
                <span className="text-lg font-bold text-slate-400">{CAREER_QUESTIONS.length}</span>
              </div>
            </div>
            <button onClick={() => setView('home')} className="p-3 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
              <RotateCcw size={20} />
            </button>
        </div>

        <motion.div 
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-10 border-2 border-slate-100 dark:border-slate-800"
        >
          <div className="mb-6">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                Category: {q.category}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight mb-12">
            {q.text}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((score) => (
              <motion.button
                key={score}
                whileHover={{ y: -5 }}
                onClick={() => handleAnswer(score)}
                className={cn(
                  "py-6 rounded-2xl font-black text-lg transition-all border-2",
                  answers[currentQ] === score 
                    ? "bg-purple-600 text-white border-purple-600 shadow-xl shadow-purple-200 dark:shadow-purple-950/20"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-purple-200"
                )}
              >
                {score}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Strongly Disagree</span>
            <span>Neutral</span>
            <span>Strongly Agree</span>
          </div>
        </motion.div>

        <div className="flex justify-between">
          <button 
            disabled={currentQ === 0}
            onClick={() => setCurrentQ(currentQ - 1)}
            className="px-6 py-4 bg-white dark:bg-slate-800 rounded-2xl font-black text-slate-500 hover:text-purple-600 disabled:opacity-30 flex items-center gap-2 border border-slate-100"
          >
           <ChevronLeft size={20} /> Previous
          </button>
          {currentQ === CAREER_QUESTIONS.length - 1 ? (
            <button 
              onClick={calculateResults}
              disabled={!answers[currentQ]}
              className="px-10 py-4 bg-slate-900 border-2 border-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black shadow-2xl hover:opacity-90 transition-all flex items-center gap-2"
            >
              Finish Assessment <Sparkles size={20} />
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 font-['Outfit']">
      {/* Hero Section */}
      <div className="relative rounded-[3rem] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 opacity-90 group-hover:opacity-95 transition-opacity" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl text-center md:text-left text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
              <Compass size={14} className="text-blue-200" /> Career Mapping Engine
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter leading-[1.1]">
              Architect Your <span className="text-blue-300">Future.</span>
            </h1>
            <p className="text-lg font-medium text-blue-100 opacity-80 leading-relaxed mb-10 max-w-md mx-auto md:mx-0">
              Discover industry roles that match your DNA. Our engine maps your personality to high-impact careers.
            </p>
            <button onClick={startQuiz} className="px-10 py-5 bg-white text-indigo-900 font-black rounded-[2rem] shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto md:mx-0 group">
              Start Vocational Profiling <Rocket size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-64 h-80 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 p-6 flex flex-col justify-between shadow-2xl"
          >
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl">
               <BrainCircuit size={28} />
             </div>
             <div className="space-y-4">
               <div className="h-2 w-full bg-white/10 rounded-full"><div className="w-3/4 h-full bg-blue-400 rounded-full" /></div>
               <div className="h-2 w-full bg-white/10 rounded-full"><div className="w-1/2 h-full bg-emerald-400 rounded-full" /></div>
               <div className="h-2 w-full bg-white/10 rounded-full"><div className="w-4/5 h-full bg-purple-400 rounded-full" /></div>
             </div>
             <div className="text-white">
               <p className="text-[10px] font-black uppercase mb-1 opacity-60">Latest Match</p>
               <p className="text-xl font-bold">Cloud Architect</p>
             </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recommended Pathways */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex justify-between items-center mb-8 px-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Map className="text-blue-600" size={24} /> Verified Pathways
              </h2>
              {latestResult && (
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                   Based on result from {new Date(latestResult.createdAt).toLocaleDateString()}
                 </span>
              )}
            </div>

            {currentPathways.length === 0 ? (
               <div className="text-center py-20 glass-card rounded-[3rem] border-2 border-dashed border-slate-100">
                  <Lightbulb size={48} className="text-slate-300 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-slate-400 mb-2">No Pathways Discovered</h3>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">Complete your first profiling assessment to unlock industry recommendations.</p>
                  <button onClick={startQuiz} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black">Get Profiled Now</button>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentPathways.map((path, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="glass-card rounded-[2.5rem] p-8 group relative overflow-hidden border border-slate-100 dark:border-slate-800"
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500", path.color)} />
                    <div className="flex justify-between items-start mb-8">
                      <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform", path.color)}>
                        <Star size={24} />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Compatibility</p>
                        <p className={cn("text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r", path.color)}>{path.match}%</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors">{path.title}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-8">{path.description}</p>
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                       <div className="flex -space-x-3">
                         {[1,2,3].map(m => <div key={m} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=Mentor+${m}&background=random`} alt="mentor" /></div>)}
                       </div>
                       <button className="text-xs font-black text-slate-400 uppercase hover:text-indigo-600 transition-all">Talk to Mentor →</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Special Programs */}
          <section className="bg-slate-900 rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
             <div className="absolute top-0 right-0 p-10 rotate-12 opacity-10">
               <Rocket size={120} />
             </div>
             <div className="max-w-md relative z-10">
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Accelerators</span>
                <h3 className="text-3xl font-black mb-6 leading-tight">Fast-track your job search with CogniX.</h3>
                <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                   Join 5,000+ students already placed in top Fortune 500 companies. Get access to internal referral systems and interview mocks.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:scale-105 transition-all">Register Now</button>
                  <button className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all border border-white/10">Read Success Stories</button>
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <section className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
             <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
               <Activity className="text-indigo-600" size={24} /> Skill DNA
             </h3>
             {latestResult ? (
               <div className="space-y-8">
                  {Object.entries(latestResult.scores || {}).map(([key, score], i) => (
                    <div key={key} className="space-y-3">
                       <div className="flex justify-between items-end">
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{key}</h4>
                         <span className="text-sm font-black text-slate-800 dark:text-white uppercase">{score * 5}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${score * 5}%` }}
                            transition={{ duration: 1.5, delay: i * 0.1 }}
                            className="h-full bg-indigo-600 rounded-full"
                          />
                       </div>
                    </div>
                  ))}
               </div>
             ) : (
                <div className="text-center py-6 opacity-30 italic font-medium text-slate-400">Complete assessment <br/> to view DNA profile.</div>
             )}
          </section>

          <section className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
             <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8">Career Milestones</h2>
             <div className="space-y-6">
                {[
                  { title: "Profilings Taken", value: assessments.length, icon: <Info size={16}/> },
                  { title: "Open Positions", value: 124, icon: <Briefcase size={16}/> },
                  { title: "Matched Mentors", value: 12, icon: <Star size={16}/> },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center px-5 py-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-indigo-600 shadow-sm">{stat.icon}</div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.title}</span>
                     </div>
                     <span className="text-lg font-black text-slate-800 dark:text-white">{stat.value}</span>
                  </div>
                ))}
             </div>
          </section>

          <section className="p-8 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-900/30">
             <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest mb-4">Coach Insight</h4>
             <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 leading-relaxed italic">
               "Your high analytical score combined with strong creative spikes suggests a perfect fit for **Creative Technologist** or **Technical Product Manager** roles."
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;
