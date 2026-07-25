import { FiStar } from 'react-icons/fi';
import { format } from 'date-fns';

const KeyCard = ({ item, onView, onToggleFavorite, viewMode }) => {
  const getEnvColor = (env) => {
    switch (env) {
      case 'Production': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Staging': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Development': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const safeName = item?.serviceName || 'Unknown';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onView(item)}
        className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 hover:shadow-md transition-all group cursor-pointer hover:border-primary-500/30 dark:hover:border-primary-500/50"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xl text-primary-500 shadow-inner">
            {safeName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 group-hover:text-primary-600 transition-colors">
              {safeName}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getEnvColor(item.environment)}`}>
                {item.environment || 'No Env'}
              </span>
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.category || 'Uncategorized'}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-4" onClick={(e) => e.stopPropagation()}>
          <div className="hidden sm:block text-xs text-slate-400">
            Added {formatDate(item.createdAt)}
          </div>
          <button 
            onClick={() => onToggleFavorite(item.id || item._id, item.favorite)}
            className={`p-2 rounded-lg transition-colors ${item.favorite ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
          >
            <FiStar className={item.favorite ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    );
  }

  // Grid mode
  return (
    <div 
      onClick={() => onView(item)}
      className="glass-card rounded-2xl p-5 flex flex-col h-full group hover:-translate-y-1 hover:shadow-lg hover:border-primary-500/30 dark:hover:border-primary-500/50 transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 shadow-inner group-hover:scale-105 transition-transform">
            {safeName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{safeName}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.category || 'Uncategorized'}</p>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onToggleFavorite(item.id || item._id, item.favorite)}
            className={`p-2 rounded-xl transition-colors ${item.favorite ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
          >
            <FiStar className={item.favorite ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
      
      <div className="mt-2 mb-6">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getEnvColor(item.environment)}`}>
          {item.environment || 'No Env'}
        </span>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
        <span className="text-xs font-medium text-slate-400">Added {formatDate(item.createdAt)}</span>
        <span className="text-xs font-semibold text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          View Details <span className="text-lg leading-none">&rarr;</span>
        </span>
      </div>
    </div>
  );
};

export default KeyCard;
