import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, TrendingUp, Users, Search, Hash } from 'lucide-react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('Trending');
  
  const posts = [
    {
      id: 1,
      author: 'Alex J.',
      time: '2 hours ago',
      title: 'How to structure a React application for large projects?',
      content: 'I\'m starting a new project and I want to make sure the folder structure is scalable. What are your best practices for a React/Vite stack?',
      tags: ['React', 'Architecture'],
      likes: 42,
      replies: 15,
      avatar: 'AJ'
    },
    {
      id: 2,
      author: 'Samantha P.',
      time: '5 hours ago',
      title: 'Study group for upcoming Data Structures midterm',
      content: 'Anyone want to join a study session this Friday? We\'ll be going over trees, graphs, and dynamic programming.',
      tags: ['Study Group', 'CS201'],
      likes: 18,
      replies: 8,
      avatar: 'SP'
    },
    {
      id: 3,
      author: 'Prof. Davis',
      time: '1 day ago',
      title: 'Summer Internship Opportunities at Google & Microsoft',
      content: 'I\'ve compiled a list of open internship roles that are well-suited for sophomores and juniors. Make sure to apply by the end of the month!',
      tags: ['Careers', 'Internships'],
      likes: 156,
      replies: 34,
      avatar: 'PD'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Community Forums</h1>
          <p className="text-slate-500 text-lg">Connect with peers, ask questions, and share knowledge.</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:-translate-y-1">
          New Discussion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" /> Navigation
            </h3>
            <div className="space-y-2">
              {['Trending', 'Latest', 'My Posts', 'Saved'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Hash className="w-5 h-5 mr-2 text-blue-600" /> Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Careers', 'Study Group', 'Python', 'Machine Learning', 'Exam Prep'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-100 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative w-full mb-6">
            <input 
              type="text" 
              placeholder="Search discussions..." 
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm font-medium"
            />
            <Search className="absolute left-4 top-4 text-slate-400 w-6 h-6" />
          </div>

          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold mr-3 shadow-inner">
                  {post.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{post.author}</h4>
                  <p className="text-xs text-slate-500">{post.time}</p>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-2">{post.title}</h2>
              <p className="text-slate-600 mb-4 line-clamp-2 md:line-clamp-none leading-relaxed">
                {post.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-6 text-slate-500 font-medium border-t border-slate-100 pt-4">
                <button className="flex items-center hover:text-purple-600 transition-colors">
                  <ThumbsUp className="w-5 h-5 mr-2" /> {post.likes}
                </button>
                <button className="flex items-center hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-5 h-5 mr-2" /> {post.replies} Replies
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
