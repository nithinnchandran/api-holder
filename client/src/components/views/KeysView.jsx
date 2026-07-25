import React from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import KeyCard from '../KeyCard';
import { motion } from 'framer-motion';

const KeysView = ({ 
  loading, 
  filteredKeys, 
  viewMode, 
  handleAddNew, 
  handleView, 
  toggleFavorite,
  search,
  activeTab
}) => {

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (filteredKeys.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border border-dashed shadow-sm"
      >
        <div className="text-slate-400 mb-4 flex justify-center"><FiSearch size={48} /></div>
        <h3 className="text-xl font-medium text-slate-800 dark:text-white">
          {search ? 'No keys match your search' : `No ${activeTab === 'all' ? '' : activeTab} keys found`}
        </h3>
        <p className="text-slate-500 mt-2">Try adjusting your search or add a new key.</p>
        <button onClick={handleAddNew} className="btn-primary mt-6 inline-flex items-center gap-2">
          <FiPlus /> Add New Key
        </button>
      </motion.div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
      {filteredKeys.map((key, index) => (
        <motion.div 
          key={key.id || key._id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <KeyCard 
            item={key} 
            onView={handleView} 
            onToggleFavorite={toggleFavorite}
            viewMode={viewMode}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default KeysView;
