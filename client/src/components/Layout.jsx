import React, { useContext, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Compass, 
  BookOpen, 
  Users, 
  Heart, 
  MessageSquare, 
  BarChart2, 
  LogOut,
  Bell,
  Search,
  Menu,
  Moon,
  Sun
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const studentNavItems = [
    { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
    { name: 'Tasks & Planning', path: '/student/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Career Guidance', path: '/student/career', icon: <Compass size={20} /> },
    { name: 'Learning Resources', path: '/student/resources', icon: <BookOpen size={20} /> },
    { name: 'Mentorship', path: '/student/mentorship', icon: <Users size={20} /> },
    { name: 'Mental Health', path: '/student/mental-health', icon: <Heart size={20} /> },
    { name: 'Community', path: '/student/community', icon: <MessageSquare size={20} /> },
    { name: 'Analytics', path: '/student/analytics', icon: <BarChart2 size={20} /> },
  ];

  const mentorNavItems = [
    { name: 'Dashboard', path: '/mentor', icon: <LayoutDashboard size={20} /> },
    { name: 'Community', path: '/student/community', icon: <MessageSquare size={20} /> },
  ];

  const navItems = user?.role === 'mentor' ? mentorNavItems : studentNavItems;

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      <div className="flex-1 flex flex-col min-h-screen relative bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
          <div className="flex h-16 items-center flex-shrink-0 px-6 border-b border-slate-200 dark:border-slate-700">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 tracking-tight">CogniSphere</div>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-300' 
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50'}`}
                  >
                    <div className={`mr-3 flex-shrink-0 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400'}`}>
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <LogOut size={20} className="mr-3 text-slate-400" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex flex-col flex-1 transition-all duration-300 w-full overflow-hidden`}>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center flex-1">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 mr-4 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-lg md:hidden">
                <Menu size={24} />
              </button>
              <div className="max-w-md w-full ml-auto md:ml-0 md:max-w-sm relative group hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-full leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200"
                  placeholder="Search resources, topics..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <div className="flex items-center">
                <img className="h-8 w-8 rounded-full border border-slate-200 shadow-sm object-cover" src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`} alt="User avatar" />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto text-slate-900 dark:text-slate-100 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
