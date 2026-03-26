import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
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
  Sun,
  X
} from 'lucide-react';

const Layout = () => {
  const { user, token, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications
  const fetchNotifCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/notifications/unread-count', {
        headers: { 'x-auth-token': token }
      });
      setUnreadCount(res.data.count);
    } catch (err) { /* silent */ }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
    } catch (err) { /* silent */ }
  };

  useEffect(() => {
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [token]);

  const openNotifications = async () => {
    setShowNotif(!showNotif);
    if (!showNotif) {
      await fetchNotifications();
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
        headers: { 'x-auth-token': token }
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { /* silent */ }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.read) {
      try {
        await axios.put(`http://localhost:5000/api/notifications/${notif._id}/read`, {}, {
          headers: { 'x-auth-token': token }
        });
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) { /* silent */ }
    }
    setShowNotif(false);
    if (notif.link) navigate(notif.link);
  };

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
  ];

  const adminNavItems = [
    { name: 'System Controls', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Platform Health', path: '/admin/health', icon: <BarChart2 size={20} /> },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : user?.role === 'mentor' ? mentorNavItems : studentNavItems;

  return (
    <div className={cn("min-h-screen flex selection:bg-purple-100 selection:text-purple-900", darkMode ? 'dark' : '')}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out md:sticky flex flex-col shadow-2xl md:shadow-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:w-20"
      )}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          {(sidebarOpen || !sidebarOpen) && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">C</div>
              {sidebarOpen && <span className="text-xl font-bold text-gradient tracking-tight">CogniSphere</span>}
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 md:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1.5 font-['Outfit']">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "group flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-300 relative",
                    isActive 
                      ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <div className={cn(
                    "mr-3.5 flex-shrink-0 transition-colors duration-300",
                    isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                  )}>
                    {item.icon}
                  </div>
                  {sidebarOpen && <span>{item.name}</span>}
                  {isActive && sidebarOpen && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1.5 h-6 bg-purple-600 rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 mt-auto">
          {sidebarOpen && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-800/50 rounded-2xl p-5 mb-6 border border-purple-100 dark:border-slate-700/50">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Weekly Goal</p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-full w-[65%] rounded-full" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">65% of your study goal reached</p>
            </div>
          )}
          <button
            onClick={logout}
            className={cn(
              "flex items-center w-full px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300",
              !sidebarOpen && "justify-center"
            )}
          >
            <LogOut size={20} className={cn(sidebarOpen && "mr-3")} />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
        {/* Header */}
        <header className={cn(
          "sticky top-0 z-40 h-20 flex items-center justify-between px-6 sm:px-10 transition-all duration-300",
          scrolled ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm" : "bg-transparent"
        )}>
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl">
              <Menu size={20} />
            </button>
            <div className="max-w-md w-full relative group hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 shadow-sm shadow-slate-200/20"
                placeholder="Search resources, topics, mentors..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 lg:space-x-5">
            <button onClick={toggleDarkMode} className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-300 hover:rotate-12">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button 
                onClick={openNotifications}
                className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-all duration-300"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                  >
                    <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h4>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs font-bold text-purple-600 hover:underline">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-400">No notifications yet</div>
                      ) : (
                        notifications.slice(0, 10).map(notif => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotifClick(notif)}
                            className={cn(
                              "px-4 py-3 border-b border-slate-50 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                              !notif.read && "bg-purple-50/50 dark:bg-purple-900/10"
                            )}
                          >
                            <p className={cn("text-sm", !notif.read ? "font-bold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              {new Date(notif.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">{user?.name || 'Student'}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">{user?.role || 'Basic Plan'}</p>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
                <img className="relative h-10 w-10 rounded-full border-2 border-white dark:border-slate-800 shadow-md object-cover cursor-pointer" src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff&bold=true`} alt="User avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 sm:px-10 py-8 lg:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
