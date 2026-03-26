import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Book, 
  Video, 
  FileText, 
  Download, 
  Bookmark, 
  Star, 
  Filter, 
  Play, 
  Clock, 
  Eye,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { cn } from '../utils';

const LearningResources = () => {
  const { token, user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    type: 'Video',
    category: 'Programming',
    duration: '10 min',
    thumbnailUrl: ''
  });

  const categories = ['All', 'Programming', 'Design', 'Business', 'Academic', 'Wellness', 'Career', 'Soft Skills'];
  const types = ['All', 'Video', 'PDF', 'Course', 'Tutorial', 'Article'];

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/resources', {
        headers: { 'x-auth-token': token },
        params: {
          category: activeTab,
          search: searchQuery
        }
      });
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchResources();
  }, [token, activeTab]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) fetchResources();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/resources', newResource, {
        headers: { 'x-auth-token': token }
      });
      setShowAddModal(false);
      setNewResource({
        title: '',
        description: '',
        url: '',
        type: 'Video',
        category: 'Programming',
        duration: '10 min',
        thumbnailUrl: ''
      });
      fetchResources();
    } catch (err) {
      console.error('Error adding resource:', err);
    }
  };

  const handleView = async (id, url) => {
    try {
      await axios.put(`http://localhost:5000/api/resources/${id}/view`, {}, {
        headers: { 'x-auth-token': token }
      });
      window.open(url, '_blank', 'noopener,noreferrer');
      fetchResources(); // Refresh views
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const toggleBookmark = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/resources/${id}/bookmark`, {}, {
        headers: { 'x-auth-token': token }
      });
      setResources(prev => prev.map(r => 
        r._id === id 
          ? { ...r, bookmarkedBy: r.bookmarkedBy.includes(user.id) 
              ? r.bookmarkedBy.filter(uid => uid !== user.id) 
              : [...r.bookmarkedBy, user.id] 
            } 
          : r
      ));
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Search and Title Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="max-w-xl">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Intelligence Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Explore curated resources, peer notes, and expert-led tutorials designed for excellence.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 lg:w-[28rem]">
            <div className="absolute inset-y-0 left-0 pl-14 flex items-center pointer-events-none z-10">
              <Search size={18} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <div className="absolute left-2.5 top-2.5 bottom-2.5 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
              <Filter size={16} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, topics, or files..." 
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-[1.25rem] pl-16 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-sm"
            />
          </div>
          {(user?.role === 'admin' || user?.role === 'mentor') && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-4 bg-purple-600 text-white font-bold rounded-[1.25rem] hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Plus size={20} /> Add Resource
            </button>
          )}
        </div>
      </div>

      {/* Featured Banner (Dynamic from first trending resource or static) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group border border-slate-700/50"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-600/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-purple-300">
              <TrendingUp size={12} /> Recommended for you
            </div>
            <h2 className="text-3xl font-bold mb-4">Mastering Modern Web Architecture</h2>
            <p className="text-slate-400 font-medium mb-8 leading-relaxed">
              Step-by-step masterclass on building scalable applications using React, Node, and Microservices.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3.5 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center gap-2">
                Continue Watching <Play size={18} fill="currentColor" />
              </button>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-center gap-4">
            <div className="w-40 h-40 rounded-3xl bg-slate-800 flex items-center justify-center border border-slate-700 relative group-hover:scale-105 transition-transform duration-500 shadow-2xl overflow-hidden">
               <Video size={48} className="text-purple-500 opacity-50" />
               <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-none">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              "whitespace-nowrap px-8 py-3.5 rounded-2xl font-bold text-sm transition-all relative overflow-hidden",
              activeTab === cat 
                ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20' 
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 border border-slate-100 dark:border-slate-700'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="glass-card rounded-[2.5rem] p-7 h-80 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {resources.map(resource => {
              const isBookmarked = resource.bookmarkedBy?.includes(user?.id);
              return (
                <motion.div 
                  key={resource._id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-[2.5rem] p-7 group cursor-pointer border border-transparent hover:border-purple-200 dark:hover:border-purple-900/30 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      resource.type === 'Video' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500' :
                      resource.type === 'PDF' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-500' :
                      'bg-purple-50 dark:bg-purple-950/20 text-purple-500'
                    )}>
                      {resource.type === 'Video' ? <Video size={24} /> : 
                       resource.type === 'PDF' ? <FileText size={24} /> : 
                       <Book size={24} />}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(resource._id); }}
                      className={cn(
                        "p-3 rounded-full transition-all",
                        isBookmarked ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' : 'text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase rounded-lg">
                        {resource.category}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{resource.duration}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {resource.title}
                    </h3>
                    
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-1.5">
                      by <span className="text-slate-600 dark:text-slate-300">{resource.uploadedBy?.name || 'Expert'}</span>
                    </p>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-8 px-1">
                      <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-lg">
                        <Star size={14} fill="currentColor" /> {resource.rating}
                      </span>
                      <span className="flex items-center gap-1"><Eye size={14} /> {resource.views}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleView(resource._id, resource.url)}
                    className="btn-premium w-full py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-all shadow-sm"
                  >
                    {resource.type === 'PDF' ? <Download size={18} /> : <Play size={18} />}
                    {resource.type === 'Video' ? 'Start Session' : resource.type === 'PDF' ? 'View/Download' : 'Access Resource'}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Resource Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <BookOpen size={24} className="text-purple-600" /> New Resource
                </h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddResource} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Title</label>
                  <input 
                    type="text" 
                    required
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="e.g. Master React Hooks"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">URL / Link</label>
                  <input 
                    type="url" 
                    required
                    value={newResource.url}
                    onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Type</label>
                    <select 
                      value={newResource.type}
                      onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {types.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                    <select 
                      value={newResource.category}
                      onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                  <textarea 
                    required
                    value={newResource.description}
                    onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                    placeholder="Short summary..."
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg"
                >
                  Publish Resource
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningResources;
