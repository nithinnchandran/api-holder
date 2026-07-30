import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy, FiEye, FiEyeOff, FiEdit2, FiTrash2, FiStar, FiCalendar, FiTag, FiServer, FiArchive } from 'react-icons/fi';
import { format } from 'date-fns';

const KeyDetailModal = ({ isOpen, onClose, currentKey, onEdit, onDelete, onToggleFavorite, onToggleArchive }) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (currentKey && currentKey.apiKey) {
      navigator.clipboard.writeText(currentKey.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getEnvColor = (env) => {
    switch (env) {
      case 'Production': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Staging': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Development': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    try {
      return format(new Date(dateStr), 'MMMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const safeName = currentKey?.serviceName || 'Unknown Service';

  if (!isOpen || !currentKey) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-dark-card w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-primary-500/30">
                {safeName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  {safeName}
                  <button 
                    onClick={() => onToggleFavorite(currentKey.id || currentKey._id, currentKey.favorite)}
                    className={`p-1 rounded-md transition-colors ${currentKey.favorite ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
                  >
                    <FiStar size={20} className={currentKey.favorite ? 'fill-current' : ''} />
                  </button>
                </h2>
                <span className={`inline-block mt-1 text-xs px-2.5 py-1 rounded-full font-medium ${getEnvColor(currentKey.environment)}`}>
                  {currentKey.environment || 'No Env'}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors p-2 rounded-full">
              <FiX size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* The API Key Display */}
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Secret API Key</label>
              <div className="bg-slate-100/80 dark:bg-[#0b1120]/80 rounded-2xl p-4 flex items-center justify-between border border-slate-200 dark:border-slate-800 shadow-inner">
                <span className="font-mono text-base md:text-lg text-slate-800 dark:text-slate-200 truncate pr-4 tracking-wider select-all">
                  {showKey ? (currentKey.apiKey || 'No key data') : '••••••••••••••••••••••••••••'}
                </span>
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    onClick={() => setShowKey(!showKey)} 
                    className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                    title={showKey ? "Hide Key" : "Reveal Key"}
                  >
                    {showKey ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                  <button 
                    onClick={handleCopy} 
                    className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 ${copied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-slate-500 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-800'}`}
                  >
                    {copied ? <span className="text-xs font-bold px-1">COPIED</span> : <FiCopy size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                  <FiTag size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Category</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{currentKey.category || 'Uncategorized'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <FiCalendar size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Created On</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatDate(currentKey.createdAt)}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {currentKey.description && (
              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Notes / Description</label>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 text-sm text-slate-700 dark:text-slate-300">
                  {currentKey.description}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 flex flex-wrap gap-2 justify-between">
            <button 
              onClick={() => {
                onDelete(currentKey.id || currentKey._id);
                onClose();
              }} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <FiTrash2 /> Delete Key
            </button>
            
            <div className="flex flex-wrap justify-end gap-2">
              <button 
                onClick={() => {
                  onToggleArchive(currentKey.id || currentKey._id, currentKey.archived);
                }} 
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors border ${currentKey.archived ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 border-transparent' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'}`}
              >
                <FiArchive /> {currentKey.archived ? 'Unarchive' : 'Archive'}
              </button>
              <button 
                onClick={() => {
                  onEdit(currentKey);
                  onClose();
                }} 
                className="btn-primary flex items-center gap-2"
              >
                <FiEdit2 /> Edit Details
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default KeyDetailModal;
