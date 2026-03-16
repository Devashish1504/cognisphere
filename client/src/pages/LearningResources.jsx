import React, { useState } from 'react';
import { Search, Book, Video, FileText, Download, Bookmark, Star } from 'lucide-react';

const LearningResources = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  const categories = ['All', 'Computer Science', 'Mathematics', 'Engineering', 'Data Science', 'Career Prep'];
  
  const resources = [
    { id: 1, title: 'Introduction to Algorithms', type: 'Video', category: 'Computer Science', views: '2.1k', rating: 4.8, bookmarked: true },
    { id: 2, title: 'Advanced Calculus Notes', type: 'PDF', category: 'Mathematics', views: '850', rating: 4.5, bookmarked: false },
    { id: 3, title: 'System Design Interview Prep', type: 'Course', category: 'Career Prep', views: '3.4k', rating: 4.9, bookmarked: true },
    { id: 4, title: 'Machine Learning Basics', type: 'Tutorial', category: 'Data Science', views: '1.2k', rating: 4.6, bookmarked: false },
    { id: 5, title: 'Microprocessor Architecture', type: 'PDF', category: 'Engineering', views: '640', rating: 4.2, bookmarked: false },
    { id: 6, title: 'Data Structures with Python', type: 'Video', category: 'Computer Science', views: '1.8k', rating: 4.7, bookmarked: false },
  ];

  const filteredResources = activeTab === 'All' ? resources : resources.filter(r => r.category === activeTab);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Learning Hub</h1>
          <p className="text-slate-500 text-lg">Curated resources, tutorials, and notes for your academic growth.</p>
        </div>
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search subjects, topics, or files..." 
            className="w-full bg-white border border-slate-200 text-slate-900 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-2 mb-8 pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
              activeTab === cat 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div key={resource.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 group relative">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                resource.type === 'Video' ? 'bg-red-50 text-red-500' :
                resource.type === 'PDF' ? 'bg-blue-50 text-blue-500' :
                'bg-purple-50 text-purple-500'
              }`}>
                {resource.type === 'Video' ? <Video className="w-6 h-6" /> : 
                 resource.type === 'PDF' ? <FileText className="w-6 h-6" /> : 
                 <Book className="w-6 h-6" />}
              </div>
              <button className={`${resource.bookmarked ? 'text-purple-600' : 'text-slate-300 hover:text-slate-400'} transition-colors`}>
                <Bookmark className="w-6 h-6" fill={resource.bookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg mb-3">
              {resource.category}
            </span>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[56px]">{resource.title}</h3>
            
            <div className="flex items-center text-sm font-medium text-slate-500 space-x-4 mb-6">
              <span className="flex items-center"><Star className="w-4 h-4 text-amber-400 mr-1" /> {resource.rating}</span>
              <span>•</span>
              <span>{resource.views} views</span>
              <span>•</span>
              <span>{resource.type}</span>
            </div>
            
            <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors flex justify-center items-center border border-slate-200">
              {resource.type === 'PDF' ? <Download className="w-4 h-4 mr-2" /> : <BookOpen className="w-4 h-4 mr-2" />}
              {resource.type === 'Video' ? 'Watch Now' : resource.type === 'PDF' ? 'Download' : 'View Course'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningResources;
