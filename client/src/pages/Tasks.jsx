import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar, 
  AlertCircle, 
  TrendingUp, 
  MoreVertical,
  Trash2,
  Filter,
  ListTodo,
  CalendarDays,
  Sparkles,
  ChevronRight,
  X,
  Tag,
  Flag,
  CalendarCheck
} from 'lucide-react';
import { cn } from '../utils';

const Tasks = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'General',
    deadline: new Date().toISOString().split('T')[0]
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { 'x-auth-token': token }
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', newTask, {
        headers: { 'x-auth-token': token }
      });
      setTasks([res.data, ...tasks]);
      setShowAddModal(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'General',
        deadline: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error adding task', err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        status: newStatus
      }, {
        headers: { 'x-auth-token': token }
      });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('Error toggling task', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting task', err);
    }
  };

  const getDeadlineStatus = (date) => {
    if (!date) return { label: 'No Data', color: 'text-slate-400' };
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    if (d < today) return { label: 'Overdue', color: 'text-rose-500' };
    if (d.getTime() === today.getTime()) return { label: 'Today', color: 'text-amber-500' };
    return { label: 'Upcoming', color: 'text-emerald-500' };
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-10 pb-10 font-['Outfit']">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Workspace</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your academic milestones and daily goals.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-5 py-3 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800">
             <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
               <ListTodo size={20} />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1 tracking-wider">Total Active</p>
               <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none">{pendingTasks.length}</p>
             </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:-translate-y-1 transition-all"
          >
            Create Task <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats Bar */}
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl text-xs font-black flex items-center gap-2 border border-rose-100 dark:border-rose-900/30">
              <AlertCircle size={14} /> {pendingTasks.filter(t => getDeadlineStatus(t.deadline).label === 'Overdue').length} Overdue
            </div>
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-xl text-xs font-black flex items-center gap-2 border border-amber-100 dark:border-amber-900/30">
              <Clock size={14} /> {pendingTasks.filter(t => getDeadlineStatus(t.deadline).label === 'Today').length} Today
            </div>
          </div>

          {/* Task List */}
          <section>
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CalendarCheck size={20} className="text-purple-600" /> Pending Workload
              </h2>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-3xl animate-pulse" />)
              ) : pendingTasks.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-20" />
                  <p className="text-slate-400 font-bold">Inbox zero! No pending tasks.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {pendingTasks.map((task) => {
                    const status = getDeadlineStatus(task.deadline);
                    return (
                      <motion.div 
                        key={task._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card rounded-[2rem] p-5 md:p-6 group flex items-center gap-6 border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900/30 transition-all shadow-sm"
                      >
                        <button 
                          onClick={() => toggleTask(task._id)}
                          className="w-10 h-10 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-transparent hover:text-emerald-500 hover:border-emerald-500 transition-all group-hover:scale-105"
                        >
                          <CheckCircle size={22} />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 transition-colors mb-2 text-lg truncate">{task.title}</h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider", status.color)}>
                              <Calendar size={12} /> {status.label} • {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                              task.priority === 'High' ? "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800" :
                              task.priority === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800" :
                              "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800"
                            )}>
                              {task.priority}
                            </span>
                            <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase rounded-lg border border-slate-100 dark:border-slate-700">
                              {task.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => deleteTask(task._id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </section>

          {/* Recently Completed */}
          {completedTasks.length > 0 && (
            <section className="opacity-60 hover:opacity-100 transition-opacity">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-2">History</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedTasks.slice(0, 6).map(task => (
                  <div key={task._id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                    <p className="flex-1 font-bold text-slate-500 text-sm line-through truncate">{task.title}</p>
                    <button onClick={() => toggleTask(task._id)} className="text-[10px] font-black text-purple-600 uppercase hover:underline">Revive</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <TrendingUp size={120} className="group-hover:scale-125 transition-transform duration-1000" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-2">My Efficiency</p>
              <h3 className="text-3xl font-black mb-8 leading-tight">Mastering Consistent.</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest opacity-80">
                    <span>Task Velocity</span>
                    <span>84%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5">
                    <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} transition={{ duration: 1.5 }} className="h-full bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest opacity-80">
                    <span>Weekly Streak</span>
                    <span>5 Days</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5">
                    <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="text-purple-500" size={24} /> AI Focus Coach
            </h3>
            <div className="space-y-6 text-sm font-medium">
              <div className="flex gap-4 p-5 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50">
                <Clock className="text-purple-600 mt-1 shrink-0" size={20} />
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your batch completion rate for <strong>Academic</strong> tasks is up by 15%. Keep this momentum!
                </p>
              </div>
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">Top Category</p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-800 dark:text-white">Computer Science</span>
                  <div className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg text-xs font-black">42% Focus</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <CalendarDays size={24} className="text-purple-600" /> New Milestone
                </h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={addTask} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Task Heading</label>
                  <input 
                    type="text" required
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g. Prepare for Networking Quiz"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 font-bold transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Priority</label>
                    <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
                      {['Low', 'Medium', 'High'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewTask({...newTask, priority: p})}
                          className={cn(
                            "flex-1 py-3 px-2 rounded-xl text-[10px] font-black transition-all",
                            newTask.priority === p 
                              ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm" 
                              : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Subject / Tag</label>
                    <select 
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-purple-500 font-bold"
                    >
                      <option>General</option>
                      <option>Computer Science</option>
                      <option>Mathematics</option>
                      <option>Engineering</option>
                      <option>Career</option>
                      <option>Wellness</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Execution Deadline</label>
                  <input 
                    type="date" required
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium px-2 italic">
                  * Scheduling this task will automatically add it to your peak-productivity heatmaps.
                </p>
                <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:opacity-90 transition-all mt-4">
                  Schedule Milestone
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
