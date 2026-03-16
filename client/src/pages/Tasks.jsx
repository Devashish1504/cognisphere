import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, Clock, Calendar } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete React assignment', status: 'pending', deadline: '2026-03-20', priority: 'High' },
    { id: 2, title: 'Review MongoDB notes', status: 'completed', deadline: '2026-03-15', priority: 'Medium' },
    { id: 3, title: 'Schedule mentoring session', status: 'pending', deadline: '2026-03-18', priority: 'Low' },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, {
      id: Date.now(),
      title: newTask,
      status: 'pending',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'Medium'
    }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t));
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Management</h1>
          <p className="text-slate-500 mt-1">Organize your academic journey and stay on track.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-slate-700">{pendingTasks.length} Pending</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={addTask} className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-slate-700 outline-none"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:scale-105 transition-transform shadow-md shadow-purple-500/20">
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Active Tasks</h2>
            </div>
            <div className="divide-y divide-slate-100 px-2">
              {pendingTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                  <div className="flex items-center space-x-4">
                    <button onClick={() => toggleTask(task.id)} className="text-slate-300 hover:text-green-500 transition-colors">
                      <Circle className="w-6 h-6" />
                    </button>
                    <div>
                      <p className="font-medium text-slate-800 group-hover:text-purple-700 transition-colors">{task.title}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs font-medium">
                        <span className="flex items-center text-slate-500"><Calendar className="w-3 h-3 mr-1" /> {task.deadline}</span>
                        <span className={`px-2 py-0.5 rounded-md ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="p-8 text-center text-slate-400">All caught up! 🎉</div>
              )}
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Completed</h2>
                <span className="text-sm font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-lg">{completedTasks.length} Done</span>
              </div>
              <div className="divide-y divide-slate-100 px-2">
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center p-4">
                    <button onClick={() => toggleTask(task.id)} className="text-green-500 mr-4">
                      <CheckCircle className="w-6 h-6" />
                    </button>
                    <p className="font-medium text-slate-500 line-through decoration-slate-300">{task.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <h3 className="text-lg font-bold mb-2">Weekly Productivity</h3>
            <div className="text-4xl font-black tracking-tight mb-4">84%</div>
            <p className="text-purple-100 text-sm font-medium">You've completed 5 tasks this week. Keep up the great work!</p>
            <div className="mt-6 w-full bg-black/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-[84%]"></div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {pendingTasks.slice(0, 3).map(t => (
                <div key={t.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                  <div>
                    <p className="font-semibold text-sm text-slate-700 line-clamp-1">{t.title}</p>
                    <p className="text-xs text-slate-500 font-medium">Due: {t.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
