import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Video, FileText, CheckCircle, Clock, X,
  Plus, Trash2, ChevronRight, ChevronDown, Mail, Star, 
  MessageSquare, AlertCircle, BookOpen, Shield
} from 'lucide-react';
import { cn } from '../utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MentorDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [showAvailForm, setShowAvailForm] = useState(false);
  const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '09:00', endTime: '10:00' });
  const [notesModal, setNotesModal] = useState(null); // { requestId, existing notes }
  const [noteText, setNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/mentor/dashboard', {
        headers: { 'x-auth-token': token }
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching mentor dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token]);

  // Accept or reject a request
  const handleRequest = async (requestId, status) => {
    setActionLoading(prev => ({ ...prev, [requestId]: status }));
    try {
      await axios.put(`http://localhost:5000/api/mentorship/request/${requestId}`, {
        status
      }, {
        headers: { 'x-auth-token': token }
      });
      await fetchDashboard(); // refresh
    } catch (err) {
      console.error(`Error updating request`, err);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  // Save session notes
  const saveNotes = async () => {
    if (!notesModal) return;
    try {
      await axios.put(`http://localhost:5000/api/mentorship/request/${notesModal.requestId}/notes`, {
        notes: noteText
      }, {
        headers: { 'x-auth-token': token }
      });
      setNotesModal(null);
      setNoteText('');
      await fetchDashboard();
    } catch (err) {
      console.error('Error saving notes', err);
    }
  };

  // Add availability slot
  const addSlot = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/mentor/availability', newSlot, {
        headers: { 'x-auth-token': token }
      });
      setShowAvailForm(false);
      setNewSlot({ day: 'Monday', startTime: '09:00', endTime: '10:00' });
      await fetchDashboard();
    } catch (err) {
      console.error('Error adding slot', err);
    }
  };

  // Delete availability slot
  const deleteSlot = async (slotId) => {
    try {
      await axios.delete(`http://localhost:5000/api/mentor/availability/${slotId}`, {
        headers: { 'x-auth-token': token }
      });
      await fetchDashboard();
    } catch (err) {
      console.error('Error deleting slot', err);
    }
  };

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';
  const avatarColors = ['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600'];

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data ? [
    { title: 'Pending Requests', value: data.stats.pendingCount, icon: <Clock className="w-6 h-6" />, color: 'bg-amber-500' },
    { title: 'Accepted Sessions', value: data.stats.acceptedCount, icon: <CheckCircle className="w-6 h-6" />, color: 'bg-emerald-500' },
    { title: 'Total Students', value: data.stats.totalStudents, icon: <Users className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Availability Slots', value: data.stats.availabilitySlots, icon: <Calendar className="w-6 h-6" />, color: 'bg-purple-500' }
  ] : [];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Mentor Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Welcome back, {user?.name || 'Mentor'}! Manage your sessions and students.
          </p>
        </div>
        <button 
          onClick={() => setShowAvailForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:-translate-y-1 mt-4 md:mt-0 flex items-center gap-2"
        >
          <Plus size={18} /> Set Availability
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} rounded-full mix-blend-multiply opacity-5 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:rotate-12 transition-transform`}>
              {stat.icon}
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">{stat.title}</h3>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'requests', label: 'Pending Requests', count: data?.stats.pendingCount },
          { id: 'students', label: 'My Students', count: data?.stats.totalStudents },
          { id: 'history', label: 'Session History', count: data?.stats.acceptedCount },
          { id: 'availability', label: 'My Availability', count: data?.stats.availabilitySlots },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2",
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 border border-slate-100 dark:border-slate-700'
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-black",
                activeTab === tab.id ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* ===== PENDING REQUESTS TAB ===== */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mentorship Requests</h2>
              {data?.pendingRequests.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-400 mb-2">All caught up!</h3>
                  <p className="text-slate-500">No pending requests right now.</p>
                </div>
              ) : (
                data?.pendingRequests.map((req, idx) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg", avatarColors[idx % avatarColors.length])}>
                        {getInitials(req.studentId?.name)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{req.studentId?.name || 'Unknown Student'}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Mail size={14} /> {req.studentId?.email}
                        </p>
                        {req.scheduledTime && (
                          <p className="text-sm text-purple-600 dark:text-purple-400 font-bold mt-1 flex items-center gap-1">
                            <Calendar size={14} /> Requested: {new Date(req.scheduledTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        )}
                        {req.message && (
                          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{req.message}"</p>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                          Sent {new Date(req.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRequest(req._id, 'accepted')}
                          disabled={actionLoading[req._id]}
                          className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-xl transition-colors font-bold text-sm disabled:opacity-50 flex items-center gap-1"
                        >
                          <CheckCircle size={16} />
                          {actionLoading[req._id] === 'accepted' ? 'Accepting...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleRequest(req._id, 'rejected')}
                          disabled={actionLoading[req._id]}
                          className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 rounded-xl transition-colors font-bold text-sm disabled:opacity-50 flex items-center gap-1"
                        >
                          <X size={16} />
                          {actionLoading[req._id] === 'rejected' ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* ===== MY STUDENTS TAB ===== */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Student Roster</h2>
              {data?.studentRoster.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-400 mb-2">No students yet</h3>
                  <p className="text-slate-500">Accept mentorship requests to build your student roster.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data?.studentRoster.map((student, idx) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md transition-all"
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white shadow", avatarColors[idx % avatarColors.length])}>
                        {getInitials(student.name)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">{student.name}</h4>
                        <p className="text-xs text-slate-500">{student.email}</p>
                        {student.department && (
                          <p className="text-xs text-purple-500 font-bold mt-1">{student.department}</p>
                        )}
                      </div>
                      <button className="p-2 text-slate-300 hover:text-purple-500 transition-colors">
                        <Mail size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== SESSION HISTORY TAB ===== */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Session History</h2>
              {data?.sessionHistory.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center">
                  <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-400 mb-2">No sessions yet</h3>
                  <p className="text-slate-500">Accepted sessions will appear here.</p>
                </div>
              ) : (
                data?.sessionHistory.map((session, idx) => (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white shadow", avatarColors[idx % avatarColors.length])}>
                          {getInitials(session.studentId?.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{session.studentId?.name || 'Student'}</h4>
                          <p className="text-xs text-slate-500">{session.studentId?.email}</p>
                          {session.scheduledTime && (
                            <p className="text-xs text-purple-600 font-bold mt-1">
                              {new Date(session.scheduledTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">
                            Accepted {new Date(session.updatedAt || session.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-xs font-black rounded-lg uppercase">
                          Accepted
                        </span>
                        <button
                          onClick={() => {
                            setNotesModal({ requestId: session._id });
                            setNoteText(session.notes || '');
                          }}
                          className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                          title="Add Notes"
                        >
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </div>
                    {session.notes && (
                      <div className="mt-3 ml-16 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800">
                        <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1 uppercase">Session Notes</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{session.notes}</p>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* ===== AVAILABILITY TAB ===== */}
          {activeTab === 'availability' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Availability</h2>
                <button
                  onClick={() => setShowAvailForm(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm flex items-center gap-1 hover:bg-purple-700 transition-colors"
                >
                  <Plus size={16} /> Add Slot
                </button>
              </div>
              {data?.availability.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center">
                  <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-400 mb-2">No availability set</h3>
                  <p className="text-slate-500 mb-4">Students won't be able to book sessions until you set your available time slots.</p>
                  <button
                    onClick={() => setShowAvailForm(true)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold"
                  >
                    Set Availability
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DAYS.map(day => {
                    const daySlots = data?.availability.filter(s => s.day === day) || [];
                    if (daySlots.length === 0) return null;
                    return (
                      <div key={day} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <Calendar size={16} className="text-purple-500" />
                          {day}
                        </h4>
                        <div className="space-y-2">
                          {daySlots.map(slot => (
                            <div key={slot._id} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                                {slot.startTime} — {slot.endTime}
                              </span>
                              <button
                                onClick={() => deleteSlot(slot._id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Video className="w-6 h-6 mr-2 text-purple-400" /> Quick Summary
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between">
                <span className="text-slate-300 text-sm">Pending</span>
                <span className="font-black text-amber-400">{data?.stats.pendingCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 text-sm">Accepted</span>
                <span className="font-black text-emerald-400">{data?.stats.acceptedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 text-sm">Rejected</span>
                <span className="font-black text-red-400">{data?.stats.rejectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 text-sm">Students</span>
                <span className="font-black text-blue-400">{data?.stats.totalStudents}</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
              <p className="text-sm text-slate-200">
                💡 <strong>Tip:</strong> Set your availability so students can request sessions at convenient times.
              </p>
            </div>
          </div>

          {/* Recent Students */}
          {data?.studentRoster.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Users size={18} className="text-blue-500" /> Recent Students
              </h3>
              <div className="space-y-3">
                {data.studentRoster.slice(0, 5).map((student, i) => (
                  <div key={student._id} className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white", avatarColors[i % avatarColors.length])}>
                      {getInitials(student.name)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{student.name}</h4>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== ADD AVAILABILITY MODAL ===== */}
      <AnimatePresence>
        {showAvailForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAvailForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Availability Slot</h3>
                <button onClick={() => setShowAvailForm(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={addSlot} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Day</label>
                  <select
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">End Time</label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all"
                >
                  Add Slot
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== NOTES MODAL ===== */}
      <AnimatePresence>
        {notesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setNotesModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={20} className="text-purple-500" /> Session Notes
                </h3>
                <button onClick={() => setNotesModal(null)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add notes about this session (e.g., topics covered, next steps for the student)..."
                rows={5}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 resize-none"
              />
              <button
                onClick={saveNotes}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all"
              >
                Save Notes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorDashboard;
