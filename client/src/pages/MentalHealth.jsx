import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Wind, 
  Users, 
  PhoneCall, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  Brain,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Sun
} from 'lucide-react';
import { cn } from '../utils';

// PHQ-9 inspired questions for students
const QUESTIONS = [
  { id: 0, text: "Little interest or pleasure in doing things (studies, hobbies, socializing)?", category: "Interest" },
  { id: 1, text: "Feeling down, depressed, or hopeless about your academic future?", category: "Mood" },
  { id: 2, text: "Trouble falling or staying asleep, or sleeping too much?", category: "Sleep" },
  { id: 3, text: "Feeling tired or having little energy to attend classes or study?", category: "Energy" },
  { id: 4, text: "Poor appetite or overeating due to stress?", category: "Appetite" },
  { id: 5, text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?", category: "Self-esteem" },
  { id: 6, text: "Trouble concentrating on things, such as reading textbooks or listening in lectures?", category: "Focus" },
  { id: 7, text: "Moving or speaking so slowly that others could notice? Or being fidgety or restless?", category: "Activity" },
  { id: 8, text: "Feeling overwhelmed by assignments, exams, or responsibilities?", category: "Stress" },
];

const OPTIONS = [
  { label: "Not at all", value: 0, emoji: "😊" },
  { label: "Several days", value: 1, emoji: "🙂" },
  { label: "More than half the days", value: 2, emoji: "😐" },
  { label: "Nearly every day", value: 3, emoji: "😟" },
];

const RESULTS = {
  minimal: {
    title: "You're Doing Great! 🌟",
    color: "emerald",
    icon: <Smile size={48} />,
    message: "Your mental wellbeing looks strong! You're managing stress well and maintaining a healthy balance.",
    tips: [
      "Keep up your healthy routines — they're working!",
      "Continue connecting with friends and support networks",
      "Practice gratitude journaling to maintain positivity",
      "Set small daily goals to keep momentum going"
    ]
  },
  mild: {
    title: "You're Doing Okay! 💪",
    color: "blue",
    icon: <Meh size={48} />,
    message: "You're coping well overall, but some areas could use attention. Small changes can make a big difference.",
    tips: [
      "Try a 10-minute daily walk or exercise routine",
      "Break large tasks into smaller, manageable chunks",
      "Talk to a friend or family member about how you feel",
      "Practice the 4-7-8 breathing technique before bed",
      "Set boundaries with social media use"
    ]
  },
  moderate: {
    title: "Let's Work on This Together 🤝",
    color: "amber",
    icon: <Meh size={48} />,
    message: "You might be going through a tough time. Remember, asking for help is a sign of strength, not weakness.",
    tips: [
      "Consider talking to a campus counselor — they're here for you",
      "Create a daily structure with fixed study and rest times",
      "Try the Pomodoro Technique (25min work, 5min break)",
      "Reach out to your mentors on CogniSphere for guidance",
      "Practice mindfulness meditation for 5 minutes daily",
      "Limit caffeine and ensure 7-8 hours of sleep"
    ]
  },
  moderately_severe: {
    title: "We Care About You ❤️",
    color: "orange",
    icon: <Frown size={48} />,
    message: "It seems like things have been really tough. You don't have to face this alone. Professional support can make a world of difference.",
    tips: [
      "Please reach out to a counselor or mental health professional",
      "Talk to someone you trust — a teacher, parent, or friend",
      "Call a student helpline (listed below)",
      "Take one day at a time — focus only on today",
      "Gentle exercise like yoga can help significantly",
      "Avoid isolation — stay connected even briefly"
    ]
  },
  severe: {
    title: "You Matter. Help is Available. 💙",
    color: "red",
    icon: <AlertTriangle size={48} />,
    message: "We strongly encourage you to seek professional support. You are not alone, and things can get better with the right help.",
    tips: [
      "🚨 Please contact a mental health professional today",
      "Call Vandrevala Foundation Helpline: 1860-2662-345",
      "Call iCall: 9152987821 (Mon-Sat, 8am-10pm)",
      "Talk to a trusted adult immediately",
      "Remember: seeking help is brave and important",
      "Your life has value and things CAN improve"
    ]
  }
};

const MentalHealth = () => {
  const { token } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'); // 'home' | 'quiz' | 'result' | 'history'
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hi there! 👋 I'm your wellness companion. I'm here to listen and help. How are you feeling today?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/mentalhealth', {
          headers: { 'x-auth-token': token }
        });
        setResources(res.data);
      } catch (err) {
        console.error('Error fetching resources', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchResources();
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/mentalhealth/assessments', {
        headers: { 'x-auth-token': token }
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching history', err);
    }
  };

  const startQuiz = () => {
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
    setView('quiz');
  };

  const selectAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [currentQ]: value }));
  };

  const nextQuestion = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  const submitQuiz = async () => {
    const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
    const answerArray = Object.entries(answers).map(([idx, score]) => ({
      questionIndex: parseInt(idx),
      score
    }));

    setSaving(true);
    try {
      const res = await axios.post('http://localhost:5000/api/mentalhealth/assessment', {
        answers: answerArray,
        totalScore
      }, {
        headers: { 'x-auth-token': token }
      });
      setResult(res.data);
      setView('result');
    } catch (err) {
      console.error('Assessment save error', err);
      // Still show result locally
      let level;
      if (totalScore <= 4) level = 'minimal';
      else if (totalScore <= 9) level = 'mild';
      else if (totalScore <= 14) level = 'moderate';
      else if (totalScore <= 19) level = 'moderately_severe';
      else level = 'severe';
      setResult({ totalScore, level });
      setView('result');
    } finally {
      setSaving(false);
    }
  };

  const viewHistory = async () => {
    await fetchHistory();
    setView('history');
  };

  // Simple wellness chatbot
  const handleChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    // Smart responses based on keywords
    const lower = userMsg.toLowerCase();
    let response = '';

    if (lower.includes('stress') || lower.includes('stressed') || lower.includes('pressure')) {
      response = "I hear you. Academic stress is very real. 💆 Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. Also, breaking your tasks into smaller pieces can make them feel more manageable. Would you like to take a quick wellness check?";
    } else if (lower.includes('sad') || lower.includes('depressed') || lower.includes('unhappy') || lower.includes('hopeless')) {
      response = "I'm sorry you're feeling this way. 💙 Your feelings are valid. Remember that tough times don't last forever. Consider talking to someone you trust — a friend, family member, or campus counselor. You can also take our Mental Health Assessment to better understand how you're feeling.";
    } else if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired') || lower.includes('exhausted')) {
      response = "Sleep is so important for your wellbeing! 🌙 Try these tips: 1) No screens 30 min before bed, 2) Keep a consistent sleep schedule, 3) Avoid caffeine after 2pm, 4) Try a relaxing wind-down routine. If sleep issues persist, please talk to a healthcare provider.";
    } else if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worry') || lower.includes('nervous') || lower.includes('panic')) {
      response = "Anxiety can feel overwhelming, but you're not alone. 🫂 Try grounding yourself: name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste. This 5-4-3-2-1 technique can help bring you back to the present moment. Deep breaths always help too.";
    } else if (lower.includes('lonely') || lower.includes('alone') || lower.includes('nobody') || lower.includes('friends')) {
      response = "Loneliness can be really tough, especially in college. 🤗 Consider joining a study group, club, or our Community Forums. Even small interactions can help — try saying hi to a classmate or joining the Mentorship program here on CogniSphere.";
    } else if (lower.includes('exam') || lower.includes('test') || lower.includes('fail') || lower.includes('grades')) {
      response = "Exam stress is something most students deal with. 📚 Remember: your grades don't define your worth. Try the Pomodoro Technique (25 min study, 5 min break), teach concepts to an imaginary friend, and make sure to take care of your body too. You've got this! 💪";
    } else if (lower.includes('motivation') || lower.includes('lazy') || lower.includes('can\'t focus') || lower.includes('procrastinating')) {
      response = "Loss of motivation happens to everyone! 🌱 Start with the smallest possible step — even just opening your textbook counts. Set a timer for just 5 minutes. Often, starting is the hardest part. Also, check if you're getting enough sleep and exercise — they fuel motivation.";
    } else if (lower.includes('help') || lower.includes('crisis') || lower.includes('emergency') || lower.includes('hurt')) {
      response = "If you're in immediate danger, please call emergency services (112) right away. 🚨\n\nHelplines:\n• Vandrevala Foundation: 1860-2662-345 (24/7)\n• iCall: 9152987821\n• NIMHANS: 080-46110007\n\nYou matter, and help is available. 💙";
    } else if (lower.includes('good') || lower.includes('great') || lower.includes('fine') || lower.includes('happy') || lower.includes('okay')) {
      response = "That's wonderful to hear! 😊 Keep nurturing those positive feelings. Regular exercise, good sleep, and connecting with people you care about are great ways to maintain your wellbeing. Is there anything specific you'd like to talk about or explore?";
    } else if (lower.includes('thank') || lower.includes('thanks')) {
      response = "You're welcome! 😊 Remember, I'm always here whenever you need to talk. Taking care of your mental health is one of the most important things you can do. You're doing great by checking in! 🌟";
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
      response = "Hello! 👋 Glad you're here. How are you feeling today? I'm here to chat about anything on your mind — stress, sleep, motivation, or just to have a friendly conversation. 😊";
    } else {
      response = "Thank you for sharing that with me. 💛 Remember, it's okay to feel whatever you're feeling. If you'd like personalized support, try taking our Mental Health Assessment, or explore the wellness resources below. Is there something specific you'd like to talk about — like stress, sleep, motivation, or anxiety?";
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'assistant', text: response }]);
    }, 800);
  };

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;
  const resultData = result ? RESULTS[result.level] : null;

  const colorMap = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500', light: 'bg-emerald-100' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', gradient: 'from-blue-500 to-cyan-500', light: 'bg-blue-100' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', gradient: 'from-amber-500 to-orange-500', light: 'bg-amber-100' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', gradient: 'from-orange-500 to-red-400', light: 'bg-orange-100' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', gradient: 'from-red-500 to-rose-500', light: 'bg-red-100' },
  };

  // ============ QUIZ VIEW ============
  if (view === 'quiz') {
    const q = QUESTIONS[currentQ];
    return (
      <div className="max-w-2xl mx-auto pb-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
            <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card rounded-[2.5rem] p-8 md:p-10"
          >
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest rounded-full">
                {q.category}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
              Over the last 2 weeks, how often have you been bothered by:
            </h2>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
              "{q.text}"
            </p>

            <div className="space-y-3">
              {OPTIONS.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectAnswer(opt.value)}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all font-medium text-left",
                    answers[currentQ] === opt.value
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 shadow-lg shadow-emerald-500/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-bold">{opt.label}</span>
                  {answers[currentQ] === opt.value && (
                    <CheckCircle2 className="ml-auto text-emerald-500" size={24} />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 gap-4">
          <button
            onClick={currentQ === 0 ? () => setView('home') : prevQuestion}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            <ChevronLeft size={20} /> {currentQ === 0 ? 'Back' : 'Previous'}
          </button>
          
          {currentQ === QUESTIONS.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < QUESTIONS.length || saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {saving ? 'Saving...' : 'See Results'} <Sparkles size={20} />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={answers[currentQ] === undefined}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              Next <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ============ RESULT VIEW ============
  if (view === 'result' && result && resultData) {
    const colors = colorMap[resultData.color] || colorMap.blue;
    return (
      <div className="max-w-2xl mx-auto pb-10 space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("rounded-[2.5rem] p-10 text-center relative overflow-hidden", colors.bg, `border-2 ${colors.border}`)}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 blur-[100px] animate-pulse" />
          <div className="relative z-10">
            <div className={cn("w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6", colors.light, colors.text)}>
              {resultData.icon}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{resultData.title}</h1>
            
            {/* Score Display */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className={cn("px-6 py-3 rounded-2xl", colors.light)}>
                <p className="text-xs font-bold uppercase text-slate-500">Your Score</p>
                <p className={cn("text-3xl font-black", colors.text)}>{result.totalScore} / 27</p>
              </div>
              <div className={cn("px-6 py-3 rounded-2xl", colors.light)}>
                <p className="text-xs font-bold uppercase text-slate-500">Level</p>
                <p className={cn("text-lg font-black capitalize", colors.text)}>{result.level.replace('_', ' ')}</p>
              </div>
            </div>

            <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8 max-w-lg mx-auto">
              {resultData.message}
            </p>
          </div>
        </motion.div>

        {/* Motivational Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[2.5rem] p-8"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Sun className="text-amber-500" size={24} /> Personalized Recommendations
          </h3>
          <div className="space-y-3">
            {resultData.tips.map((tip, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40"
              >
                <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="font-medium text-slate-700 dark:text-slate-300">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={startQuiz} className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all">
            <RotateCcw size={18} /> Take Again
          </button>
          <button onClick={() => { setChatOpen(true); setView('home'); }} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:-translate-y-1 transition-all">
            <MessageCircle size={18} /> Chat with Assistant
          </button>
          <button onClick={() => setView('home')} className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:-translate-y-1 transition-all">
            Back to Wellness Hub
          </button>
        </div>
      </div>
    );
  }

  // ============ HISTORY VIEW ============
  if (view === 'history') {
    return (
      <div className="max-w-2xl mx-auto pb-10 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Assessment History</h2>
          <button onClick={() => setView('home')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-200 transition-all">
            ← Back
          </button>
        </div>
        {history.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] p-12 text-center">
            <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">No assessments yet</h3>
            <p className="text-slate-500 mb-6">Take your first wellness check to start tracking your mental health journey.</p>
            <button onClick={startQuiz} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold">
              Take Assessment
            </button>
          </div>
        ) : (
          history.map((a, i) => {
            const data = RESULTS[a.level];
            const colors = colorMap[data?.color] || colorMap.blue;
            return (
              <motion.div 
                key={a._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn("glass-card rounded-[2rem] p-6 border-l-4", colors.border)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{data?.title || a.level}</h4>
                    <p className="text-sm text-slate-500 mt-1">{new Date(a.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className={cn("px-4 py-2 rounded-xl font-black text-lg", colors.light, colors.text)}>
                    {a.totalScore}/27
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    );
  }

  // ============ HOME VIEW ============
  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/20 dark:to-teal-900/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden text-emerald-900 dark:text-emerald-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[100px] animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldCheck size={14} /> Private & Secure
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">Your Wellbeing Matters</h1>
            <p className="text-lg font-medium opacity-80 leading-relaxed mb-8">
              Take a quick, confidential mental health check, chat with our wellness assistant, or explore support resources.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button onClick={startQuiz} className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center gap-2">
                Take Wellness Check <Brain size={20} />
              </button>
              <button onClick={() => setChatOpen(!chatOpen)} className="px-8 py-4 bg-white/50 backdrop-blur-md border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold rounded-2xl hover:bg-white/80 transition-all flex items-center gap-2">
                Chat with Assistant <MessageCircle size={20} />
              </button>
            </div>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="hidden md:flex w-48 h-48 md:w-64 md:h-64 bg-emerald-200/50 dark:bg-emerald-800/20 backdrop-blur-3xl rounded-full items-center justify-center p-8 border border-white/50"
          >
            <Heart className="w-full h-full text-emerald-500 opacity-60" />
          </motion.div>
        </div>
      </div>

      {/* Chatbot */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-[2.5rem] overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="text-emerald-500" size={24} /> Wellness Assistant
              </h3>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Close ✕</button>
            </div>
            <div className="p-6 h-80 overflow-y-auto space-y-4" id="chat-container">
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-line",
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-sm' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-sm'
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Type how you're feeling..."
                className="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button onClick={handleChat} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Support Modules */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Explore Support Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Wellness Check', desc: 'Take a confidential self-assessment to understand your mental health.', icon: <Brain size={24} />, color: 'emerald', action: startQuiz },
                { title: 'Assessment History', desc: 'Track your mental health journey over time.', icon: <TrendingUp size={24} />, color: 'purple', action: viewHistory },
                { title: 'Peer Support', desc: 'Connect with students facing similar challenges.', icon: <Users size={24} />, color: 'blue', action: () => {} },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  onClick={item.action}
                  className="glass-card rounded-[2rem] p-6 text-center group cursor-pointer"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 transition-transform group-hover:scale-110",
                    item.color === 'emerald' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    item.color === 'purple' ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" :
                    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  )}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{item.desc}</p>
                  <span className="text-xs font-black uppercase text-slate-400 group-hover:text-emerald-500 transition-colors flex items-center justify-center gap-1">
                    Start <ArrowRight size={14} />
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Wellness Library */}
          <section className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Wellness Library</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading && <div className="col-span-full py-4 text-slate-500 font-bold animate-pulse">Loading library...</div>}
              {!loading && resources.length === 0 && (
                <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <h3 className="text-xl font-bold text-slate-400 mb-2">Library is empty</h3>
                  <p className="text-slate-500 text-sm">Admins haven't added any mental health resources yet.</p>
                </div>
              )}
              {resources.map((item, i) => (
                <div key={item._id || i} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">{item.type || 'Resource'}</span>
                      <span className="text-[10px] font-black uppercase text-slate-500">·</span>
                      <span className="text-[10px] font-black uppercase text-slate-400">{item.category ? item.category.replace('_', ' ') : 'Wellness'}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="glass-card rounded-[2.5rem] p-8 border-emerald-100 dark:border-emerald-900/30">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <PhoneCall className="text-emerald-500" size={24} /> Emergency Helplines
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Vandrevala Foundation', number: '1860-2662-345', hours: '24/7' },
                { name: 'iCall', number: '9152987821', hours: 'Mon-Sat 8am-10pm' },
                { name: 'NIMHANS', number: '080-46110007', hours: '24/7' },
              ].map((h, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{h.name}</h4>
                  <p className="text-emerald-600 dark:text-emerald-400 font-black text-lg">{h.number}</p>
                  <p className="text-xs text-slate-500">{h.hours}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-[2.5rem] p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
              <Calendar className="text-purple-500/20" size={64} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Quick Actions</h3>
            <div className="space-y-3 mt-4">
              <button onClick={startQuiz} className="w-full py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2">
                <Brain size={18} /> Take Wellness Check
              </button>
              <button onClick={() => setChatOpen(true)} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <MessageCircle size={18} /> Chat Now
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentalHealth;
