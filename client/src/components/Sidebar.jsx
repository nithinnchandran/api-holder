import { FiHome, FiStar, FiArchive, FiSettings, FiLogOut, FiDownload, FiActivity, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';

const Sidebar = ({ activeTab, setActiveTab, keys = [] }) => {
  const { logout } = useAuth();
  
  const navItems = [
    { id: 'all', icon: <FiHome size={18} />, label: 'All Keys' },
    { id: 'favorites', icon: <FiStar size={18} />, label: 'Favorites' },
    { id: 'archived', icon: <FiArchive size={18} />, label: 'Archived' },
    { id: 'analytics', icon: <FiActivity size={18} />, label: 'Analytics' },
  ];

  const handleExport = async () => {
    try {
      const res = await api.get('/keys');
      const keysData = res.data.data;
      const blob = new Blob([JSON.stringify(keysData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vaultx-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data', err);
      alert('Failed to export data');
    }
  };

  return (
    <aside className="w-64 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 hidden md:flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-20">
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-600 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <FiLock size={18} />
          </div>
          VaultX
        </h1>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">Main Menu</div>
        
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 z-10 group ${
              activeTab === item.id 
                ? 'text-white font-medium' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-md shadow-primary-500/20 -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            
            {!activeTab && activeTab !== item.id && (
               <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            )}
            
            <div className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </div>
            {item.label}
          </button>
        ))}
      </div>
      
      <div className="p-4 mx-4 mb-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-1">
        <button 
          onClick={handleExport} 
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-sm"
        >
          <FiDownload size={16} />
          Export Backup
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm ${
            activeTab === 'settings' 
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FiSettings size={16} />
          Settings
        </button>
        <div className="my-1 border-t border-slate-200 dark:border-slate-700/50 mx-2"></div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
        >
          <FiLogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
