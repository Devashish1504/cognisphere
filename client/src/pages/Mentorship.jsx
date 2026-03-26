import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Calendar, Video, Star, Users, MapPin, Award, X,
  Clock, CheckCircle, AlertCircle, ChevronRight, MessageSquare, Send
} from 'lucide-react';
import { cn } from '../utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Mentorship = () => {
  const { token, user } = useContext(AuthContext);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorAvailability, setMentorAvailability] = useState([]);
  const [requestForm, setRequestForm] = useState({ message: '', scheduledTime: '' });
  const [sending, setSending] = useState(false);
  const [activeView, setActiveView] = useState('browse'); // 'browse' | 'my-requests'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorsRes, requestsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/mentorship/mentors', { headers: { 'x-auth-token': token } }),
          axios.get('http://localhost:5000/api/mentorship/requests', { headers: { 'x-auth-token': token } })
        ]);
        setMentors(mentorsRes.data);
        setMyRequests(requestsRes.data);
      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const openMentorProfile = async (mentor) => {
    setSelectedMentor(mentor);
    setRequestForm({ message: '', scheduledTime: '' });
    try {
      const res = await axios.get(`http://localhost:5000/api/mentor/availability/${mentor._id}`, {
        headers: { 'x-auth-token': token }
      });
      setMentorAvailability(res.data);
    } catch (err) {
      console.error('Error fetching availability', err);
      setMentorAvailability([]);
    }
  };

  const sendRequest = async () => {
    if (!selectedMentor) return;
    setSending(true);
    try {
      await axios.post('http://localhost:5000/api/mentorship/request', {
        mentorId: selectedMentor._id,
        message: requestForm.message || 'Could we schedule an introductory session?',
        scheduledTime: requestForm.scheduledTime || null
      }, {
        headers: { 'x-auth-token': token }
      });
      // Refresh requests
      const res = await axios.get('http://localhost:5000/api/mentorship/requests', {
        headers: { 'x-auth-token': token }
      });
      setMyRequests(res.data);
      setSelectedMentor(null);
    } catch (err) {
      console.error('Error sending request', err);
    } finally {
      setSending(false);
    }
  };

  const colors = ["bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600", "bg-cyan-600"];
  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';

  const statusColors = {
    pending: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    accepted: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    rejected: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  };

  const statusIcons = {
    pending: <Clock size={14} />,
    accepted: <CheckCircle size={14} />,
    rejected: <AlertCircle size={14} />
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 text-white mb-12 relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl -mr-40 -mt-40 mix-blend-screen pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-black mb-4">Connect with Industry Experts</h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Get personalized guidance, resume reviews, mock interviews, and career advice from professionals who have been where you are.
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveView('browse')}
              className={cn("px-6 py-3 rounded-xl font-bold transition-all", activeView === 'browse' ? 'bg-white text-slate-900' : 'bg-slate-700 hover:bg-slate-600 text-white')}
            >
              Browse Mentors
            </button>
            <button 
              onClick={() => setActiveView('my-requests')}
              className={cn("px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2", activeView === 'my-requests' ? 'bg-white text-slate-900' : 'bg-slate-700 hover:bg-slate-600 text-white')}
            >
              My Requests
              {myRequests.length > 0 && (
                <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-black rounded-full">{myRequests.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== BROWSE MENTORS VIEW ===== */}
      {activeView === 'browse' && (
        <>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Available Mentors</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loading && <div className="col-span-full text-center py-10 text-slate-500 font-bold tracking-widest animate-pulse">Loading mentors...</div>}
            {!loading && mentors.length === 0 && (
              <div className="col-span-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 text-center">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">No mentors available yet</h3>
                <p className="text-slate-500 mt-2">Check back later when mentors join the platform.</p>
              </div>
            )}
            {mentors.map((mentor, index) => {
              const color = colors[index % colors.length];
              const existingReq = myRequests.find(r => r.mentorId?._id === mentor._id || r.mentorId === mentor._id);
              return (
                <div key={mentor._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                  <div className="p-6 relative">
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${color}`}></div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white ${color} shadow-lg shadow-black/10`}>
                        {getInitials(mentor.name)}
                      </div>
                      <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" /> 5.0
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{mentor.name}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-4 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" /> {mentor.department || mentor.institution || 'Industry Expert'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(mentor.skills && mentor.skills.length > 0 ? mentor.skills : ['Mentorship', 'Career Guidance', 'General']).slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-xs font-bold text-slate-400 mb-6 space-x-4">
                      <span className="flex items-center"><Users className="w-4 h-4 mr-1 text-slate-300" /> Professional</span>
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-300" /> Available</span>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex gap-3">
                    {existingReq ? (
                      <div className={cn("flex-1 py-2.5 rounded-xl font-bold text-center text-sm flex items-center justify-center gap-1", statusColors[existingReq.status])}>
                        {statusIcons[existingReq.status]}
                        {existingReq.status === 'pending' ? 'Request Pending' : existingReq.status === 'accepted' ? 'Request Accepted!' : 'Request Rejected'}
                      </div>
                    ) : (
                      <button
                        onClick={() => openMentorProfile(mentor)}
                        className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-800 text-sm"
                      >
                        Request Session
                      </button>
                    )}
                    <button className="w-12 h-12 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 flex justify-center items-center rounded-xl hover:bg-slate-50 hover:text-purple-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ===== MY REQUESTS VIEW ===== */}
      {activeView === 'my-requests' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Session Requests</h2>
          {myRequests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No requests yet</h3>
              <p className="text-slate-500 mb-4">Browse mentors and send your first session request!</p>
              <button onClick={() => setActiveView('browse')} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold">
                Browse Mentors
              </button>
            </div>
          ) : (
            myRequests.map((req, idx) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white shadow", colors[idx % colors.length])}>
                      {getInitials(req.mentorId?.name)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{req.mentorId?.name || 'Mentor'}</h4>
                      <p className="text-xs text-slate-500">{req.mentorId?.email}</p>
                      {req.scheduledTime && (
                        <p className="text-xs text-purple-600 font-bold mt-1 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(req.scheduledTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={cn("px-3 py-1 rounded-lg text-xs font-black uppercase flex items-center gap-1", statusColors[req.status])}>
                    {statusIcons[req.status]} {req.status}
                  </span>
                </div>
                {req.message && (
                  <div className="mt-3 ml-16 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{req.message}"</p>
                  </div>
                )}
                {req.notes && (
                  <div className="mt-2 ml-16 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800">
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1 uppercase">Mentor Notes</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{req.notes}</p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2 ml-16">
                  {new Date(req.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ===== REQUEST SESSION MODAL ===== */}
      <AnimatePresence>
        {selectedMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMentor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Request Session with {selectedMentor.name}</h3>
                <button onClick={() => setSelectedMentor(null)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {/* Available Slots */}
              {mentorAvailability.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1">
                    <Calendar size={16} className="text-purple-500" /> Available Slots
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {DAYS.map(day => {
                      const daySlots = mentorAvailability.filter(s => s.day === day);
                      if (daySlots.length === 0) return null;
                      return (
                        <div key={day} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                          <span className="font-bold text-sm text-slate-700 dark:text-slate-300 w-24">{day}</span>
                          <div className="flex flex-wrap gap-2">
                            {daySlots.map(slot => (
                              <span key={slot._id} className="px-3 py-1 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold">
                                {slot.startTime} — {slot.endTime}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {mentorAvailability.length === 0 && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                    ⚠️ This mentor hasn't set availability yet. You can still send a request with a preferred time.
                  </p>
                </div>
              )}

              {/* Request Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Preferred Date & Time</label>
                  <input
                    type="datetime-local"
                    value={requestForm.scheduledTime}
                    onChange={(e) => setRequestForm({ ...requestForm, scheduledTime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message to Mentor</label>
                  <textarea
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    placeholder="Hi! I'd love to discuss career guidance in software engineering..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
                <button
                  onClick={sendRequest}
                  disabled={sending}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : <><Send size={18} /> Send Request</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mentorship;
