import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiPlus, FiGrid, FiList } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import KeyModal from '../components/KeyModal';
import KeyDetailModal from '../components/KeyDetailModal';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import KeysView from '../components/views/KeysView';
import AnalyticsView from '../components/views/AnalyticsView';
import SettingsView from '../components/views/SettingsView';
import ProfileView from '../components/views/ProfileView';

const Dashboard = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const [keys, setKeys] = useState([]);
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false); // For Creating/Editing
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // For Viewing details
  const [currentKey, setCurrentKey] = useState(null);
  
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, favorites: 0, recentlyAdded: 0 });
  const [activeTab, setActiveTab] = useState('all'); // all, favorites, archived, analytics, settings
  const [history, setHistory] = useState(['all']);

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Welcome to VaultX', 
      text: 'Securely store and manage your API keys.', 
      type: 'info',
      time: new Date().toLocaleTimeString(),
      action: () => setActiveTab('all')
    }
  ]);
  const [hasUnread, setHasUnread] = useState(true);

  const addNotification = (title, text, type = 'info') => {
    setNotifications(prev => [{
      id: Date.now(),
      title,
      text,
      type,
      time: new Date().toLocaleTimeString(),
    }, ...prev]);
    setHasUnread(true);
  };

  const handleSetTab = (newTab) => {
    if (newTab !== activeTab) {
      setHistory(prev => [...prev, newTab]);
      setActiveTab(newTab);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevTab = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setActiveTab(prevTab);
    }
  };

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await api.get('/keys');
      setKeys(res.data.data);
      
      // Calculate stats
      const total = res.data.data.length;
      const favorites = res.data.data.filter(k => k.favorite).length;
      const recentlyAdded = res.data.data.filter(k => {
        if (!k.createdAt) return false;
        const added = new Date(k.createdAt);
        if (isNaN(added.getTime())) return false;
        const now = new Date();
        const diffDays = Math.ceil((now - added) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }).length;
      
      setStats({ total, favorites, recentlyAdded });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  // Effect to filter keys based on activeTab and search
  useEffect(() => {
    let result = keys;

    // First filter by tab
    if (activeTab === 'favorites') {
      result = result.filter(k => k.favorite);
    } else if (activeTab === 'archived') {
      result = result.filter(k => k.archived);
    } else {
      // For 'all', we might want to hide archived keys by default unless specifically on archived tab
      result = result.filter(k => !k.archived);
    }

    // Then filter by search query
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(k => 
        (k.serviceName && k.serviceName.toLowerCase().includes(lowerSearch)) ||
        (k.category && k.category.toLowerCase().includes(lowerSearch)) ||
        (k.tags && k.tags.some(t => t.toLowerCase().includes(lowerSearch)))
      );
    }
    
    setFilteredKeys(result);
  }, [search, keys, activeTab]);

  const handleAddNew = () => {
    setCurrentKey(null);
    setIsModalOpen(true);
  };

  const handleView = (key) => {
    setCurrentKey(key);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (key) => {
    setCurrentKey(key);
    setIsModalOpen(true);
    setIsDetailModalOpen(false); // Close view modal if opening edit
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this key?')) {
      try {
        await api.delete(`/keys/${id}`);
        fetchKeys();
        setIsDetailModalOpen(false); // Close view modal if it was open
        addNotification('Key Deleted', 'Successfully deleted the API key.', 'delete');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleFavorite = async (id, currentFavorite) => {
    try {
      await api.put(`/keys/${id}`, { favorite: !currentFavorite });
      // Update local state optimistic UI
      setKeys(keys.map(k => {
        if ((k.id || k._id) === id) {
          return { ...k, favorite: !currentFavorite };
        }
        return k;
      }));
      // Also update currentKey if a modal is open
      if (currentKey && (currentKey.id || currentKey._id) === id) {
        setCurrentKey({ ...currentKey, favorite: !currentFavorite });
      }
    } catch (err) {
      console.error(err);
      fetchKeys(); // fallback
    }
  };

  const toggleArchive = async (id, currentArchived) => {
    try {
      await api.put(`/keys/${id}`, { archived: !currentArchived });
      setKeys(keys.map(k => {
        if ((k.id || k._id) === id) {
          return { ...k, archived: !currentArchived };
        }
        return k;
      }));
      if (currentKey && (currentKey.id || currentKey._id) === id) {
        setCurrentKey({ ...currentKey, archived: !currentArchived });
      }
    } catch (err) {
      console.error(err);
      fetchKeys();
    }
  };

  // Render the correct view based on active tab
  const renderContent = () => {
    if (activeTab === 'analytics') {
      return <AnalyticsView keys={keys} stats={stats} />;
    }
    if (activeTab === 'settings') {
      return <SettingsView keys={keys} />;
    }
    if (activeTab === 'profile') {
      return <ProfileView />;
    }

    // Default to KeysView (for all, favorites, archived)
    return (
      <div className="p-6 lg:p-8">
        {/* Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
              {activeTab === 'all' ? (
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
                  Good {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
                </span>
              ) : (
                `${activeTab} Keys`
              )}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage and securely access your API keys.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <FiGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <FiList size={18} />
              </button>
            </div>
            <button onClick={handleAddNew} className="btn-primary flex items-center gap-2 flex-1 sm:flex-none justify-center">
              <FiPlus /> New Key
            </button>
          </div>
        </motion.div>

        <KeysView 
          loading={loading}
          filteredKeys={filteredKeys}
          viewMode={viewMode}
          handleAddNew={handleAddNew}
          handleView={handleView}
          toggleFavorite={toggleFavorite}
          search={search}
          activeTab={activeTab}
        />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={handleSetTab} keys={keys} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar 
          user={user} 
          search={search} 
          setSearch={setSearch} 
          setActiveTab={handleSetTab} 
          handleBack={handleBack}
          canGoBack={history.length > 1}
          notifications={notifications}
          hasUnread={hasUnread}
          setHasUnread={setHasUnread}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <KeyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentKey={currentKey}
        onSave={fetchKeys}
        addNotification={addNotification}
      />
      
      <KeyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        currentKey={currentKey}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={toggleFavorite}
        onToggleArchive={toggleArchive}
      />
    </div>
  );
};

export default Dashboard;
