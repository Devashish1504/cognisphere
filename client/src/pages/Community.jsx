import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, Send, Search, Plus, X, Tag,
  Clock, ChevronDown, ChevronUp, Trash2, Flag, Filter,
  Sparkles, TrendingUp, Users, AlertCircle
} from 'lucide-react';
import { cn } from '../utils';

const TAGS = ['General', 'Study Tips', 'Mental Health', 'Career', 'Tech', 'Campus Life', 'Exam Prep', 'Projects'];

const Community = () => {
  const { token, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', tags: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [sending, setSending] = useState(false);

  const fetchPosts = async () => {
    try {
      const params = {};
      if (activeTag !== 'All') params.tag = activeTag;
      if (searchQuery) params.search = searchQuery;
      
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { 'x-auth-token': token },
        params
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPosts();
  }, [token, activeTag]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) fetchPosts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const createPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    setSending(true);
    try {
      await axios.post('http://localhost:5000/api/posts', newPost, {
        headers: { 'x-auth-token': token }
      });
      setNewPost({ title: '', body: '', tags: [] });
      setShowNewPost(false);
      await fetchPosts();
    } catch (err) {
      console.error('Error creating post', err);
    } finally {
      setSending(false);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: { 'x-auth-token': token }
      });
      setPosts(prev => prev.map(p => 
        p._id === postId ? { ...p, likes: res.data.likes } : p
      ));
    } catch (err) {
      console.error('Error liking post', err);
    }
  };

  const addReply = async (postId) => {
    const content = replyText[postId];
    if (!content?.trim()) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/reply`, { content }, {
        headers: { 'x-auth-token': token }
      });
      setPosts(prev => prev.map(p => p._id === postId ? res.data : p));
      setReplyText(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error adding reply', err);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { 'x-auth-token': token }
      });
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };

  const reportPost = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}/report`, {}, {
        headers: { 'x-auth-token': token }
      });
      alert('Post reported. Admin will review it.');
    } catch (err) {
      console.error('Error reporting post', err);
    }
  };

  const toggleTag = (tag) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';
  const colors = ['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-pink-600', 'bg-indigo-600'];
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Community</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Share knowledge, ask questions, and connect with peers.</p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      {/* Search + Tags */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, topics, or tags..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
          {['All', ...TAGS].map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all",
                activeTag === tag
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 border border-slate-100 dark:border-slate-700'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold">Loading posts...</p>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-16 text-center">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No posts yet</h3>
              <p className="text-slate-500 mb-4">Be the first to start a conversation!</p>
              <button onClick={() => setShowNewPost(true)} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold">
                Create Post
              </button>
            </div>
          )}

          <AnimatePresence>
            {posts.map((post, idx) => {
              const isLiked = post.likes.includes(user?.id);
              const isExpanded = expandedReplies[post._id];
              const isAuthor = post.author?._id === user?.id;

              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="p-6">
                    {/* Author row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black text-white shadow", colors[idx % colors.length])}>
                          {getInitials(post.author?.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{post.author?.name || 'Anonymous'}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {timeAgo(post.createdAt)}
                            {post.author?.role === 'mentor' && (
                              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-black rounded-md uppercase">Mentor</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {(isAuthor || user?.role === 'admin') && (
                          <button onClick={() => deletePost(post._id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        )}
                        {!isAuthor && (
                          <button onClick={() => reportPost(post._id)} className="p-2 text-slate-300 hover:text-amber-500 transition-colors" title="Report">
                            <Flag size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Post content */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{post.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 whitespace-pre-wrap">{post.body}</p>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action bar */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => toggleLike(post._id)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                          isLiked
                            ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'
                            : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        )}
                      >
                        <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                        {post.likes.length}
                      </button>
                      <button
                        onClick={() => setExpandedReplies(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                      >
                        <MessageSquare size={16} />
                        {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Replies Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                      >
                        <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                          {post.replies.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-2">No replies yet. Be the first!</p>
                          )}
                          {post.replies.map((reply, ri) => (
                            <div key={reply._id || ri} className="flex gap-3">
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0", colors[(idx + ri + 1) % colors.length])}>
                                {getInitials(reply.author?.name)}
                              </div>
                              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{reply.author?.name || 'User'}</span>
                                  <span className="text-[10px] text-slate-400">{timeAgo(reply.createdAt)}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Reply input */}
                        <div className="px-4 pb-4 flex gap-2">
                          <input
                            type="text"
                            value={replyText[post._id] || ''}
                            onChange={(e) => setReplyText(prev => ({ ...prev, [post._id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && addReply(post._id)}
                            placeholder="Write a reply..."
                            className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                          />
                          <button
                            onClick={() => addReply(post._id)}
                            className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="glass-card rounded-[2.5rem] p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-500" /> Community Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Total Posts</span>
                <span className="font-black text-slate-900 dark:text-white">{posts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Total Replies</span>
                <span className="font-black text-slate-900 dark:text-white">
                  {posts.reduce((acc, p) => acc + p.replies.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Total Likes</span>
                <span className="font-black text-rose-600">
                  {posts.reduce((acc, p) => acc + p.likes.length, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="glass-card rounded-[2.5rem] p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" /> Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => {
                const count = posts.filter(p => p.tags?.includes(tag)).length;
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      activeTag === tag
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 border border-slate-100 dark:border-slate-700'
                    )}
                  >
                    #{tag} {count > 0 && <span className="text-[10px] ml-1 opacity-60">({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white">
            <h4 className="font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-purple-400" /> Community Guidelines</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Be respectful and supportive</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Share knowledge generously</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Use appropriate tags</li>
              <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">✗</span> No spam or self-promotion</li>
              <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">✗</span> No offensive content</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===== NEW POST MODAL ===== */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus size={20} className="text-purple-500" /> Create Post
                </h3>
                <button onClick={() => setShowNewPost(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={createPost} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Content</label>
                  <textarea
                    value={newPost.body}
                    onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Share your thoughts, questions, or insights..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                          newPost.tags.includes(tag)
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {sending ? 'Publishing...' : 'Publish Post'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
