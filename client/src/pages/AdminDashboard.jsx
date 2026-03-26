import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ShieldCheck, Database, Settings, FileCheck, Flag,
  ChevronRight, TrendingUp, BarChart, CheckCircle, X,
  UserPlus, UserMinus, Clock, AlertCircle, Crown, Trash2
} from 'lucide-react';
import { cn } from '../utils';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [actionLoading, setActionLoading] = useState({});

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { 'x-auth-token': token }
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  const approveMentor = async (mentorId) => {
    setActionLoading(prev => ({ ...prev, [mentorId]: 'approve' }));
    try {
      await axios.put(`http://localhost:5000/api/admin/mentor/${mentorId}/approve`, {}, {
        headers: { 'x-auth-token': token }
      });
      await fetchStats();
    } catch (err) {
      console.error('Error approving mentor', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [mentorId]: null }));
    }
  };

  const rejectMentor = async (mentorId) => {
    setActionLoading(prev => ({ ...prev, [mentorId]: 'reject' }));
    try {
      await axios.put(`http://localhost:5000/api/admin/mentor/${mentorId}/reject`, {}, {
        headers: { 'x-auth-token': token }
      });
      await fetchStats();
    } catch (err) {
      console.error('Error rejecting mentor', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [mentorId]: null }));
    }
  };

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';

  if (loading) {
    return (
      <div className="space-y-10 pb-10 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data ? [
    { name: 'Total Users', value: data.stats.totalUsers.toLocaleString(), icon: <Users size={24} />, color: 'from-blue-500 to-indigo-600', desc: `${data.stats.totalStudents} students, ${data.stats.totalMentors} mentors` },
    { name: 'Active Mentors', value: data.stats.totalMentors.toString(), icon: <ShieldCheck size={24} />, color: 'from-emerald-500 to-teal-600', desc: `${data.pendingMentors.length} pending approval` },
    { name: 'Sessions', value: data.stats.acceptedSessions.toString(), icon: <CheckCircle size={24} />, color: 'from-purple-500 to-pink-600', desc: `${data.stats.pendingSessions} pending` },
    { name: 'Weekly Assessments', value: data.stats.weeklyAssessments.toString(), icon: <TrendingUp size={24} />, color: 'from-amber-500 to-orange-600', desc: `${data.stats.totalTasks} total tasks` },
  ] : [];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">System Controls</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Governance and platform health monitoring — real-time data.</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.25rem] font-bold flex items-center gap-2 hover:opacity-90 transition-all">
          System Settings <Settings size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-[2.5rem] p-7"
          >
            <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-6", stat.color)}>
              {stat.icon}
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</h3>
            <p className="text-xs font-medium text-slate-500 mt-2">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'mentors', label: 'Mentor Approvals', count: data?.pendingMentors.length },
          { id: 'users', label: 'Recent Users' },
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
                activeTab === tab.id ? 'bg-white/20' : 'bg-rose-100 text-rose-600'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              {/* Platform Growth Chart */}
              <section className="glass-card rounded-[2.5rem] p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Platform Growth</h2>
                <p className="text-sm text-slate-500 mb-8">Monthly user registrations</p>
                <div className="h-64 flex items-end justify-between px-4 pb-2 space-x-2 pt-10">
                  {data?.monthlyGrowth.length > 0 ? (
                    data.monthlyGrowth.map((m, i) => {
                      const maxCount = Math.max(...data.monthlyGrowth.map(g => g.count), 1);
                      const height = (m.count / maxCount) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-xs font-black text-slate-500">{m.count}</span>
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(height, 5)}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-lg min-h-[8px]" 
                          />
                          <span className="text-[10px] font-black text-slate-400 uppercase">
                            {monthNames[m._id.month - 1]}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 text-center text-slate-400 self-center">
                      <p className="font-bold">No growth data yet</p>
                      <p className="text-sm">Data will appear as users register</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-4xl font-black text-slate-900 dark:text-white">{data?.stats.totalTasks}</p>
                  <p className="text-xs font-black text-slate-400 uppercase mt-2">Total Tasks Created</p>
                  <p className="text-xs text-emerald-500 font-bold mt-1">{data?.stats.completedTasks} completed</p>
                </div>
                <div className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-4xl font-black text-slate-900 dark:text-white">{data?.stats.acceptedSessions}</p>
                  <p className="text-xs font-black text-slate-400 uppercase mt-2">Mentor Sessions</p>
                  <p className="text-xs text-amber-500 font-bold mt-1">{data?.stats.pendingSessions} pending</p>
                </div>
              </div>
            </>
          )}

          {/* MENTOR APPROVALS TAB */}
          {activeTab === 'mentors' && (
            <section className="glass-card rounded-[2.5rem] p-8 md:p-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Pending Mentor Approvals</h2>
              {data?.pendingMentors.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-400 mb-2">All clear!</h3>
                  <p className="text-slate-500">No mentors waiting for approval.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.pendingMentors.map((mentor, i) => (
                    <motion.div
                      key={mentor._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-6 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                        {getInitials(mentor.name)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{mentor.name}</h4>
                        <p className="text-xs text-slate-500">{mentor.email}</p>
                        {(mentor.department || mentor.institution) && (
                          <p className="text-xs text-purple-500 font-bold mt-1">{mentor.department} {mentor.institution && `• ${mentor.institution}`}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">Applied {new Date(mentor.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveMentor(mentor._id)}
                          disabled={actionLoading[mentor._id]}
                          className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <CheckCircle size={16} />
                          {actionLoading[mentor._id] === 'approve' ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => rejectMentor(mentor._id)}
                          disabled={actionLoading[mentor._id]}
                          className="px-5 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold text-sm rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <X size={16} />
                          {actionLoading[mentor._id] === 'reject' ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* RECENT USERS TAB */}
          {activeTab === 'users' && (
            <section className="glass-card rounded-[2.5rem] p-8 md:p-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Recent Registrations</h2>
              <div className="space-y-3">
                {data?.recentUsers.map((u, i) => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow",
                      u.role === 'admin' ? 'bg-amber-600' : u.role === 'mentor' ? 'bg-purple-600' : 'bg-blue-600'
                    )}>
                      {getInitials(u.name)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{u.name}</h4>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase",
                      u.role === 'admin' ? 'bg-amber-100 text-amber-700' :
                      u.role === 'mentor' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    )}>
                      {u.role}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="glass-card rounded-[2.5rem] p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" /> Platform Summary
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> Students
                </span>
                <span className="font-black text-slate-900 dark:text-white">{data?.stats.totalStudents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Crown size={16} className="text-purple-500" /> Mentors
                </span>
                <span className="font-black text-slate-900 dark:text-white">{data?.stats.totalMentors}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-500" /> Admins
                </span>
                <span className="font-black text-slate-900 dark:text-white">{data?.stats.totalAdmins}</span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" /> Tasks Done
                </span>
                <span className="font-black text-emerald-600">{data?.stats.completedTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <TrendingUp size={16} className="text-rose-500" /> Assessments (7d)
                </span>
                <span className="font-black text-rose-600">{data?.stats.weeklyAssessments}</span>
              </div>
            </div>
          </div>

          {/* Pending Alerts */}
          {data?.pendingMentors.length > 0 && (
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-[50px]" />
              <div className="relative z-10">
                <AlertCircle className="w-8 h-8 mb-4 opacity-80" />
                <h4 className="text-xl font-bold mb-2">Action Required</h4>
                <p className="text-sm opacity-80 mb-4">
                  {data.pendingMentors.length} mentor{data.pendingMentors.length > 1 ? 's' : ''} waiting for your approval.
                </p>
                <button
                  onClick={() => setActiveTab('mentors')}
                  className="w-full py-3 bg-white/20 border border-white/30 rounded-xl font-bold text-sm hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                >
                  Review Now <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Server Status */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[50px]" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">System Status</p>
            <h4 className="text-xl font-bold mb-6">Infrastructure</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>API Server</span>
                  <span className="text-emerald-400">Online</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="w-full h-full bg-emerald-400 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Database</span>
                  <span className="text-emerald-400">Connected</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="w-[95%] h-full bg-emerald-400 rounded-full" />
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              View Server Logs <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
