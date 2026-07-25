import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiBell, FiMenu, FiKey, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user, search, setSearch }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Welcome to VaultX', text: 'Securely store and manage your API keys.', icon: <FiKey className="text-primary-500" />, time: 'Just now' },
    { id: 2, title: 'Security Tip', text: 'Enable auto-lock in settings for better security.', icon: <FiAlertCircle className="text-amber-500" />, time: '2 hours ago' }
  ];

  return (
    <header className="h-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0b1120]/70 backdrop-blur-xl flex items-center justify-between px-6 lg:px-8 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <FiMenu size={24} />
        </button>
        
        <div className="relative w-full max-w-md hidden sm:block group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all placeholder:text-slate-400 shadow-sm"
            placeholder="Search keys, services, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-105 ${showNotifications ? 'bg-primary-50 text-primary-600 dark:bg-slate-800 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <FiBell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0b1120]"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                  <button className="text-xs text-primary-500 hover:text-primary-600 font-medium">Mark all as read</button>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.map(notif => (
                    <div key={notif.id} className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 cursor-pointer group">
                      <div className="mt-1 flex-shrink-0 p-2 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:scale-110 transition-transform">
                        {notif.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{notif.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.text}</p>
                        <span className="text-[10px] text-slate-400 mt-2 block">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <button className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700/80">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-slate-800 dark:text-white">{user?.name || 'User'}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
          </div>
          <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
